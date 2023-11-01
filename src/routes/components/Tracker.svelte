<script lang='ts'>
	import Icon from '@iconify/svelte';
	import { setInteracted } from '$lib/stores/interacted';
</script>

<div class='text-center'>
	<a class='btn h-auto relative overflow-hidden' href='/track' on:click={() => setInteracted()}>
		<span class='flex flex-col items-center text-lg gap-2 p-4'>
			<Icon class='text-5xl' icon='ri:scan-2-fill' />
			<span>Track my location</span>
			<span class='text-xs text-base-content/70'>If you are riding a bus or train</span>
		</span>
	</a>
</div>