<script lang="ts">
  import Icon from "@iconify/svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { toast } from "svelte-sonner";

  let state = "idle";

  async function start() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    state = "loading";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        state = "idle";
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

  async function track() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    state = "loading";
    navigator.geolocation.watchPosition(
      (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
        state = "idle";
      },
      (err) => {
        console.error(err);
        toast.error("Failed to get your location.");
        state = "idle";
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }
</script>

<div class="card bordered">
  <div class="card-body">
    <div>
      <button class="btn btn-primary relative overflow-hidden" disabled="{state !== 'idle'}" on:click={start}>
        <Icon class="text-2xl" icon="ri:scan-2-fill" />
        <span>Find transport</span>
        {#if state === "loading"}
          <Loading />
        {/if}
      </button>
      <button class="btn" on:click={track}>
        <Icon class="text-2xl" icon="fe:bus" />
        <span>Track my location</span>
        {#if state === "loading"}
          <Loading />
        {/if}
      </button>
    </div>
  </div>
</div>