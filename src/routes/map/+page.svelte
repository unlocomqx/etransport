<script lang="ts">
  import type { PageData } from "./$types";
  import "ol/ol.css";
  import Map from "$lib/components/map/Map.svelte";
  import CenterMarker from "$lib/components/map/CenterMarker.svelte";
  import TransportMarker from "$lib/components/map/TransportMarker.svelte";
  import { getDistance } from "geolib";

  export let data: PageData;

  const { latitude, longitude } = data;

  console.log(data.groups.map((g) => getDistance(
    { latitude, longitude },
    { latitude: g.latitude, longitude: g.longitude })
  ));

  $: groups = data.groups;
</script>

<Map center={{latitude, longitude}}>
  <CenterMarker coords={{latitude, longitude}} />
  {#each groups as group}
    <TransportMarker group={group} />
  {/each}
</Map>