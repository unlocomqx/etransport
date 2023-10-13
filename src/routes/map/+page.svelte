<script lang="ts">
  import type { PageData } from "./$types";
  import "ol/ol.css";
  import Map from "$lib/components/map/Map.svelte";
  import CenterMarker from "$lib/components/map/CenterMarker.svelte";
  import TransportMarker from "$lib/components/map/TransportMarker.svelte";
  import Icon from "@iconify/svelte";
  import { toast } from "svelte-sonner";
  import Loading from "$lib/components/Loading.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let { latitude, longitude } = data;

  $: groups = data.groups;

  let state = "idle";

  async function update() {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      toast.error("Geolocation for this site is disabled. Please enable it in your browser settings.");
      return;
    }

    console.log("update");

    state = "loading";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position, position.coords.latitude, position.coords.longitude);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        state = "idle";
        goto(`/map?latitude=${latitude}&longitude=${longitude}`, { invalidateAll: true });
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

  onMount(() => {
    const interval = setInterval(() => {
      update();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<Map center={{latitude, longitude}}>
  <CenterMarker coords={{latitude, longitude}} />
  {#each groups as group}
    <TransportMarker group={group} />
  {/each}
  <button class="btn btn-circle btn-secondary fixed bottom-4 right-4 z-10 overflow-hidden" data-cy="update-position"
          on:click={update}>
    <Icon class="text-2xl" icon="mdi:my-location" />
    {#if state === "loading"}
      <Loading />
    {/if}
  </button>
</Map>