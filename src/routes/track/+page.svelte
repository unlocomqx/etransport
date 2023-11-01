<script lang='ts'>
	import 'ol/ol.css';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { mode } from '$lib/stores/mode';
	import { setInteracted } from '$lib/stores/interacted';
	import TransportMarker from '$lib/components/map/TransportMarker.svelte';
	import CenterMarker from '$lib/components/map/CenterMarker.svelte';
	import Map from '$lib/components/map/Map.svelte';
	import { goto } from '$app/navigation';
	import type { GeoGroup } from '$lib/utils/geo';
	import { fade } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';

	let latitude: number;
	let longitude: number;
	let groups: GeoGroup[] = [];

	let tracking_id: number;
	let last_timestamp: number;
	let state = 'idle';

	async function track() {
		setInteracted();

		const perm = await navigator.permissions.query({ name: 'geolocation' });

		if (perm.state === 'denied') {
			toast.error('Geolocation for this site is disabled. Please enable it in your browser settings.');
			goto('/');
			return;
		}

		state = 'loading';
		last_timestamp = 0;
		tracking_id = navigator.geolocation.watchPosition(
			async (position) => {
				state = 'tracking';
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				// console.log(position, position.coords.latitude, position.coords.longitude);
				if (position.timestamp - last_timestamp < 10000) {
					console.log('Skipping location update, too soon.');
					return;
				}
				last_timestamp = position.timestamp;
				const data = await fetch('/api/location', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						timestamp: new Date(position.timestamp).toUTCString(),
						mode: $mode.value
					})
				}).then((res) => res.json());

				if (data.error) {
					console.log(data.errors);
					toast.warning(data.message || 'The tracking data could not be saved.');
				}
				if (data.success) {
					const url = new URL('/api/markers', window.location.origin);
					url.searchParams.set('latitude', position.coords.latitude.toString());
					url.searchParams.set('longitude', position.coords.longitude.toString());
					const groups_data = await fetch(url, {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then((res) => res.json());
					groups = groups_data.groups;
				}
			},
			(err) => {
				console.error(err);
				toast.error('Location tracking failed.');
				state = 'idle';
			},
			{
				maximumAge: 0,
				timeout: 10000
			}
		);
	}

	export function stopTracking() {
		try {
			if (tracking_id) {
				navigator.geolocation.clearWatch(tracking_id);
			}
		} catch (e) {
			console.log(e);
		} finally {
			state = 'idle';
		}
	}

	onDestroy(stopTracking);

	let mode_state = 'idle';

	async function updateMode(value: string) {
		mode.set({ value });

		const session: Session = $page.data.session;
		if (!session || !session.user) {
			toast.info('Please login using Google to change your mode of transport.');
			return;
		}

		mode_state = 'loading';

		const res = await fetch('/api/mode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				mode: $mode.value
			})
		});

		const data = await res.json();
		if (data.error) {
			console.log(data.errors);
			toast.warning(data.message || 'The mode could not be saved.', {});
		}

		mode_state = 'idle';

		if (data.success) {
			toast.success('Mode updated successfully.');
		}
	}

	onMount(() => {
		track();
	});
</script>

{#if latitude && longitude}
	<Map center={{latitude, longitude}}>
		<CenterMarker coords={{latitude, longitude}} />
		{#each groups as group (group.id)}
			<TransportMarker {group} />
		{/each}
	</Map>
	<div class='bg-neutral fixed left-0 bottom-0 z-10 w-full p-2 flex items-center justify-center'>
		<button class='btn btn-circle btn-secondary self-start'
						on:click={() => goto('/')}>
			<Icon class='text-2xl' icon='mdi:arrow-left' />
		</button>
		<span class='flex-1'></span>
		<div class='join'>
			<div class='join'>
				<button class='relative btn btn-outline join-item'
								class:btn-success={$mode.value === "bus"}
								class:btn-active={$mode.value === "bus"}
								disabled={mode_state === 'loading'}
								on:click={() => updateMode("bus")}>
					<Icon class='text-2xl' icon='noto:oncoming-bus' />
					<span>Bus</span>
					{#if mode_state === 'loading' && $mode.value === 'bus'}
						<Loading />
					{/if}
				</button>
				<button class='relative btn btn-outline join-item'
								class:btn-success={$mode.value === "train"}
								class:btn-active={$mode.value === "train"}
								disabled={mode_state === 'loading'}
								on:click={() => updateMode("train")}>
					<Icon class='text-2xl' icon='noto:train' />
					<span>Train</span>
					{#if mode_state === 'loading' && $mode.value === 'train'}
						<Loading />
					{/if}
				</button>
				<a class='btn btn-error join-item' href='/'>
					<Icon icon='mdi:stop' class='text-2xl' />
					<span>Stop</span>
				</a>
			</div>
		</div>
	</div>
{/if}

{#if state === 'loading'}
	<div class='p-4' transition:fade>
		<div class='alert alert-info'>
			<span class='loading loading-spinner loading-lg'></span>
			<span>Reading your position, please wait...</span>
		</div>
	</div>
{/if}