<script lang="ts">
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import type { Session } from "@supabase/supabase-js";
  import { onDestroy } from "svelte";

  let tracking_id: number;
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
    tracking_id = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error(err);
        toast.error("Location tracking failed.");
        state = "idle";
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  function stopTracking() {
    console.log("stop");
    try {
      if (tracking_id) {
        navigator.geolocation.clearWatch(tracking_id);
      }
    } catch (e) {
      console.log(e);
    }
    state = "idle";
  }

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