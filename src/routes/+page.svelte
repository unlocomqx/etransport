<script lang="ts">
  import type { PageData } from "./$types";
  import FindTransport from "./components/FindTransport.svelte";
  import Tracker from "./components/Tracker.svelte";

  export let data: PageData;
</script>

<div class="card bordered">
  <div class="card-body">
    <div class="flex gap-2 flex-wrap">
      <FindTransport />
      <Tracker />
    </div>
  </div>
</div>
