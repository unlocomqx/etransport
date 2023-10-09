<script lang="ts">
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import type { Session } from "@supabase/supabase-js";
  import { onDestroy, onMount } from "svelte";

  let tracking_id: number;
  let last_timestamp: number;
  let state = "idle";

  async function track() {
    if (state === "tracking") {
      toast.info("Already tracking location.");
      return;
    }

    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    const session: Session = $page.data.session;
    if (!session || !session.user) {
      toast.info("Please login using Google to enable location tracking.");
      return;
    }

    state = "tracking";
    last_timestamp = 0;
    tracking_id = navigator.geolocation.watchPosition(
      async (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
        if (position.timestamp - last_timestamp < 10000) {
          console.log("Skipping location update, too soon.");
          // return;
        }
        last_timestamp = position.timestamp;
        const res = await fetch("/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id_user: session.user.id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(position.timestamp).toISOString()
          })
        });

        const data = await res.json();
        if (data.error) {
          toast.warning("The tracking data could not be saved.");
        }
      },
      (err) => {
        console.error(err);
        toast.error("Location tracking failed.");
        state = "idle";
      },
      {
        // enableHighAccuracy: false,
        // timeout: 10000,
        maximumAge: 0
      }
    );
  }

  export function stopTracking() {
    try {
      if (tracking_id) {
        navigator.geolocation.clearWatch(tracking_id);
      }
    } catch (e) {
      console.log(e);
    }
    state = "idle";
  }

  onMount(() => {
    track();
  });
  onDestroy(stopTracking);
</script>

<button class="btn relative" class:btn-success={state === "tracking"} on:click={track}>
  <Icon class="text-2xl" icon="basil:location-solid" />
  <span>Track my location</span>
</button>
{#if state !== "idle"}
  <button class="btn btn-error" on:click={stopTracking}>
    <Icon icon="mdi:stop" class="text-2xl" />
    <span>Stop</span>
  </button>
{/if}