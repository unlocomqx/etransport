<script lang="ts">
  import type { Writable } from "svelte/store";
  import { toast } from "svelte-sonner";
  import { afterUpdate } from "svelte";

  export let flash: Writable<{
    type: "error" | "success";
    message: string
  } | undefined>;

  afterUpdate(() => {
    if ($flash) {
      if ($flash.message) {
        if ($flash.type === "success") {
          toast.success($flash.message, { duration: 3000 });
        } else if ($flash.type === "error") {
          toast.error($flash.message, { duration: 3000 });
        }
      }
    }
  });
</script>