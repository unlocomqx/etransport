<script lang='ts'>
	import type { PageData } from './$types';
	import 'ol/ol.css';
	import Map from '$lib/components/map/Map.svelte';
	import CenterMarker from '$lib/components/map/CenterMarker.svelte';
	import TransportMarker from '$lib/components/map/TransportMarker.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import Loading from '$lib/components/Loading.svelte';
	import { onMount } from 'svelte';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	export let data: PageData;

	let { latitude, longitude } = data;

	$: groups = data.groups;

	let state = 'idle';

	async function update(context = 'click') {
		const perm = await navigator.permissions.query({ name: 'geolocation' });

		if (perm.state === 'denied') {
			if (context === 'click') {
				toast.error('Geolocation for this site is disabled. Please enable it in your browser settings.');
			}
			return;
		}

		// console.log("update");

		if (context === 'click') {
			state = 'loading';
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				// console.log(position, position.coords.latitude, position.coords.longitude);
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				state = 'idle';
				goto(`/map?latitude=${latitude}&longitude=${longitude}`, { invalidateAll: true });
			},
			(err) => {
				if (context === 'click') {
					toast.error('Failed to get your location.');
				}
				console.error(err);
				state = 'idle';
			},
			{
				timeout: 5000,
				maximumAge: 0
			}
		);
	}

	onMount(() => {
		const interval = setInterval(() => {
			update('refresh');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});

	let navigating = 'idle';
	beforeNavigate(() => {
		navigating = 'navigating';
	});

	afterNavigate(() => {
		navigating = 'idle';
	});
</script>

<Map center={{latitude, longitude}}>
	<CenterMarker coords={{latitude, longitude}} />
	{#each groups as group (group.id)}
		<TransportMarker group={group} />
	{/each}
	<button class='btn btn-circle btn-secondary fixed bottom-4 right-4 z-10 overflow-hidden' data-cy='update-position'
					on:click={update}>
		<Icon class='text-2xl' icon='mdi:my-location' />
		{#if state === "loading"}
			<Loading />
		{/if}
	</button>
	<button class='btn btn-circle btn-secondary fixed bottom-4 left-4 z-10 overflow-hidden' data-cy='update-position'
					on:click={() => goto('/')}>
		<Icon class='text-2xl' icon='mdi:arrow-left' />
		{#if navigating === "navigating"}
			<Loading />
		{/if}
	</button>
</Map>