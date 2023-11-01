<script lang='ts'>
	import 'ol/ol.css';
	import Map from '$lib/components/map/Map.svelte';
	import CenterMarker from '$lib/components/map/CenterMarker.svelte';
	import TransportMarker from '$lib/components/map/TransportMarker.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import Loading from '$lib/components/Loading.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { GeoGroup } from '$lib/utils/geo';

	let state = 'idle';
	let groups: GeoGroup[] = [];
	let latitude: number;
	let longitude: number;

	async function update(context = 'click') {
		const perm = await navigator.permissions.query({ name: 'geolocation' });

		if (perm.state === 'denied') {
			toast.error('Geolocation for this site is disabled. Please enable it in your browser settings.');
			await goto('/');
			return;
		}

		if (context === 'click') {
			state = 'loading';
		}
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				state = 'idle';
				const url = new URL('/api/markers', window.location.origin);
				url.searchParams.set('latitude', position.coords.latitude.toString());
				url.searchParams.set('longitude', position.coords.longitude.toString());
				const groups_data = await fetch(url, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then((res) => res.json());
				groups = groups_data.groups;
			},
			(err) => {
				if (context === 'click') {
					toast.error('Failed to get your location.');
					goto('/');
				}
				console.error(err);
				state = 'idle';
			},
			{
				maximumAge: 0
			}
		);
	}

	onMount(() => {
		update('click');

		const interval = setInterval(() => {
			update('refresh');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if latitude && longitude}
	<Map center={{latitude, longitude}}>
		<CenterMarker coords={{latitude, longitude}} />
		{#each groups as group (group.id)}
			<TransportMarker {group} />
		{/each}
		<button class='btn btn-circle btn-secondary fixed bottom-4 right-4 z-10 overflow-hidden' data-cy='update-position'
						on:click={() => update()}>
			<Icon class='text-2xl' icon='mdi:my-location' />
			{#if state === "loading"}
				<Loading />
			{/if}
		</button>
		<button class='btn btn-circle btn-secondary fixed bottom-4 left-4 z-10 overflow-hidden'
						on:click={() => goto('/')}>
			<Icon class='text-2xl' icon='mdi:arrow-left' />
		</button>
	</Map>
{/if}