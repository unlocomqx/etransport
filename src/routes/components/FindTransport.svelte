<script lang="ts">
  import Icon from "@iconify/svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { toast } from "svelte-sonner";

  let location_state = "idle";

  async function start() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    location_state = "loading";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        location_state = "idle";
      },
      (err) => {
        toast.error("Failed to get your location.");
        console.error(err);
        location_state = "idle";
      },
      {
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  let tracking_id: number;
  let tracking_state = "idle";

  async function track() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    tracking_state = "tracking";
    tracking_id = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error(err);
        toast.error("Location tracking failed.");
        tracking_state = "idle";
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  function stopTracking() {
    navigator.geolocation.clearWatch(tracking_id);
    tracking_state = "idle";
  }
</script>

<div class="card bordered">
  <div class="card-body">
    <div class="flex gap-2 flex-wrap">
      <button class="btn btn-primary relative overflow-hidden" disabled={location_state !== "idle"} on:click={start}>
        <Icon class="text-2xl" icon="ri:scan-2-fill" />
        <span>Find transport</span>
        {#if location_state === "loading"}
          <Loading />
        {/if}
      </button>
      <button class="btn relative" disabled={tracking_state !== "idle"} on:click={track}>
        <Icon class="text-2xl" icon="basil:location-solid" />
        <span>Track my location</span>
      </button>
      {#if tracking_state !== "idle"}
        <button class="btn btn-error" on:click={stopTracking}>
          <Icon icon="mdi:stop" class="text-2xl" />
          <span>Stop</span>
        </button>
      {/if}
    </div>
  </div>
</div>