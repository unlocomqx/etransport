<script lang='ts'>
	import Icon from '@iconify/svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { setInteracted } from '$lib/stores/interacted';
	import { afterNavigate } from '$app/navigation';

	let state = 'idle';

	afterNavigate(() => {
		state = 'idle';
	});
</script>

<div class='text-center'>
	<a class='btn btn-primary h-auto relative overflow-hidden' href='/map'
		 on:click={() => {
			state = 'loading';
			setInteracted();
		 }}>
		<span class='flex flex-col items-center text-lg gap-2 p-4'>
			<Icon class='text-5xl' icon='ri:scan-2-fill' />
			<span>Find transport</span>
			<span class='text-xs text-primary-content/70'>Find nearby buses and trains</span>
		</span>
		{#if state === "loading"}
			<Loading />
		{/if}
	</a>
</div>