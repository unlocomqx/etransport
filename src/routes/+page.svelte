<script lang="ts">
  import type { PageData } from "./$types";
  import FindTransport from "./components/FindTransport.svelte";

  export let data: PageData;
</script>

<div>
  <FindTransport />
</div>
