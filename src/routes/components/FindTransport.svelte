<script lang='ts'>
	import Icon from '@iconify/svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { setInteracted } from '$lib/stores/interacted';

	let state = 'idle';
	let coords: GeolocationCoordinates | null = null;

	async function start() {
		setInteracted();
		const perm = await navigator.permissions.query({ name: 'geolocation' });

		if (perm.state === 'denied') {
			toast.error('Geolocation for this site is disabled. Please enable it in your browser settings.');
			return;
		}

		state = 'loading';
		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log(position, position.coords.latitude, position.coords.longitude);
				coords = position.coords;
				state = 'idle';
				goto(`/map?latitude=${coords.latitude}&longitude=${coords.longitude}`);
			},
			(err) => {
				toast.error('Failed to get your location.');
				console.error(err);
				state = 'idle';
			},
			{
				maximumAge: 0
			}
		);
	}
</script>

<div class='text-center'>
	<button class='btn btn-primary h-auto relative overflow-hidden' disabled={state !== "idle"}
					on:click={start}>
		<span class='flex flex-col items-center text-lg gap-2 p-4'>
			<Icon class='text-5xl' icon='ri:scan-2-fill' />
			<span>Find transport</span>
			<span class='text-xs text-primary-content/70'>Find nearby buses and trains</span>
		</span>
		{#if state === "loading"}
			<Loading />
		{/if}
	</button>
</div>