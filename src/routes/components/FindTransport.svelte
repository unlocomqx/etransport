<script lang="ts">
  import Icon from "@iconify/svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { toast } from "svelte-sonner";
  import type { TrackerComponent } from "./types";
  import { goto } from "$app/navigation";

  export let tracker: TrackerComponent;

  let state = "idle";
  let coords: GeolocationCoordinates | null = null;

  async function start() {
    tracker.stopTracking();
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    state = "loading";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
        coords = position.coords;
        state = "idle";
        goto(`/map?latitude=${coords.latitude}&longitude=${coords.longitude}`);
      },
      (err) => {
        toast.error("Failed to get your location.");
        console.error(err);
        state = "idle";
      },
      {
        timeout: 5000,
        maximumAge: 0
      }
    );
  }
</script>

<button class="btn btn-primary relative overflow-hidden" disabled={state !== "idle"} on:click={start}>
  <Icon class="text-2xl" icon="ri:scan-2-fill" />
  <span>Find transport</span>
  {#if state === "loading"}
    <Loading />
  {/if}
</button>

<form action="/map" method="post">
  <input name="latitude" type="hidden" value="{coords?.latitude}" />
  <input name="longitude" type="hidden" value="{coords?.longitude}" />
</form>