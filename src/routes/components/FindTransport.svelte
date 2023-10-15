<script lang='ts'>
	import Icon from '@iconify/svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { toast } from 'svelte-sonner';
	import type { TrackerComponent } from './types';
	import { goto } from '$app/navigation';
	import { setInteracted } from '$lib/stores/interacted';

	export let tracker: TrackerComponent;

	let state = 'idle';
	let coords: GeolocationCoordinates | null = null;

	async function start() {
		setInteracted();
		tracker.stopTracking();
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
			<Icon class='text-4xl' icon='ri:scan-2-fill' />
			<span>Find transport</span>
		</span>
		{#if state === "loading"}
			<Loading />
		{/if}
	</button>
	<form action='/map' method='post'>
		<input name='latitude' type='hidden' value='{coords?.latitude}' />
		<input name='longitude' type='hidden' value='{coords?.longitude}' />
	</form>
</div>