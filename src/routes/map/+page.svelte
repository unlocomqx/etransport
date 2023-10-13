<script lang="ts">
  import type { PageData } from "./$types";
  import "ol/ol.css";
  import Map from "$lib/components/map/Map.svelte";
  import CenterIcon from "$lib/components/map/CenterIcon.svelte";

  export let data: PageData;

  const { latitude, longitude } = data;
</script>

<Map center={[latitude, longitude]}>
  <CenterIcon coords={[latitude, longitude]} />
</Map>