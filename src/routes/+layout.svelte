<script lang="ts">
  import "../app.css";
  import { getFlash } from "sveltekit-flash-message/client";
  import { page } from "$app/stores";
  import Flash from "$lib/components/Flash.svelte";
  import { Toaster } from "svelte-sonner";
  import { afterNavigate } from "$app/navigation";

  const flash = getFlash(page);

  let loaded = false;
  afterNavigate(() => {
    loaded = true;
  });
</script>

<div class="navbar bg-base-100">
  <div class="flex-none">
    <button class="btn btn-square btn-ghost">
      <svg class="inline-block w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
      </svg>
    </button>
  </div>
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/">eTransport</a>
  </div>
  <div class="flex-none">
    <button class="btn btn-square btn-ghost">
      <svg class="inline-block w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          stroke-linecap="round" stroke-linejoin="round"
          stroke-width="2"></path>
      </svg>
    </button>
  </div>
</div>

<div class="p-4">
  <Flash {flash} />
  <Toaster position="bottom-right" richColors />
  <slot />
</div>

{#if loaded}
  <span class="hidden" data-cy="loaded"></span>
{/if}