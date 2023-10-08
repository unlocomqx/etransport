<script lang="ts">
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";

  let tracking_id: number;
  let state = "idle";

  async function track() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
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
    if (tracking_id) {
      navigator.geolocation.clearWatch(tracking_id);
    }
    state = "idle";
  }
</script>

<button class="btn relative" disabled={state !== "idle"} on:click={track}>
  <Icon class="text-2xl" icon="basil:location-solid" />
  <span>Track my location</span>
</button>
{#if state !== "idle"}
  <button class="btn btn-error" on:click={stopTracking}>
    <Icon icon="mdi:stop" class="text-2xl" />
    <span>Stop</span>
  </button>
{/if}