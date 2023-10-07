<script lang="ts">
  import Icon from "@iconify/svelte";

  function start() {
    console.log("start");
  }
</script>

<div class="card bordered">
  <div class="card-body">
    <div class="card-title">
      Find transport
    </div>
    <div>
      <button class="btn btn-primary" on:click={start}>
        <Icon class="text-2xl" icon="mdi:play" />
        <span>Start</span>
      </button>
    </div>
  </div>
</div>