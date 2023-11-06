<script lang='ts'>
	import 'ol/ol.css';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import { onMount, SvelteComponent } from 'svelte';
	import { mode } from '$lib/stores/mode';
	import { setInteracted } from '$lib/stores/interacted';
	import TransportMarker from '$lib/components/map/TransportMarker.svelte';
	import Map from '$lib/components/map/Map.svelte';
	import { goto } from '$app/navigation';
	import type { GeoGroup } from '$lib/utils/geo';
	import { fade } from 'svelte/transition';
	import Loading from '$lib/components/Loading.svelte';
	import { DEBUG, TRACKING_NOTIFICATION_DELAY } from '$lib/flags';
	import { transform } from 'ol/proj';
	import CenterMarker from '$lib/components/map/CenterMarker.svelte';

	let mapComp: SvelteComponent;
	let latitude: number;
	let longitude: number;
	let groups: GeoGroup[] = [];

	let tracking_id: number | null = null;
	let last_timestamp: number;
	let state = 'idle';
	let notification_timeout: number | null = null;

	async function fetchMarkers(position: GeolocationPosition) {
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

	const positionChanged = async (position: GeolocationPosition) => {
		if (DEBUG) {
			stopTracking();
		}
		state = 'tracking';
		notification_timeout = window.setTimeout(notify, TRACKING_NOTIFICATION_DELAY);
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		if (mapComp) {
			mapComp.centerMap({ latitude, longitude });
		}
		// console.log(position, position.coords.latitude, position.coords.longitude);
		if (position.timestamp - last_timestamp < 5000 && !DEBUG) {
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
			await fetchMarkers(position);
		}
	};

	async function track() {
		setInteracted();

		const perm = await navigator.permissions.query({ name: 'geolocation' });

		if (perm.state === 'denied') {
			toast.error('Geolocation for this site is disabled. Please enable it in your browser settings.');
			await goto('/');
			return;
		}

		state = 'loading';
		last_timestamp = 0;

		tracking_id = navigator.geolocation.watchPosition(
			positionChanged,
			(err) => {
				if (notification_timeout) clearTimeout(notification_timeout);
				console.error(err);
				toast.error('Location tracking failed.');
				goto('/');
				state = 'idle';
			},
			{
				maximumAge: 0,
				timeout: 10000
			}
		);
	}

	async function notify() {
		if ('Notification' in window) {
			const perm = await Notification.requestPermission();
			if (perm === 'granted') {
				navigator.serviceWorker.ready.then((registration) => {
					registration.showNotification('eTransport is tracking your location', {
						body: 'Expand notification for more options.',
						icon: '/favicon.png',
						vibrate: [ 200 ],
						actions: [
							{
								action: 'stopTracking',
								title: 'Stop tracking',
								icon: '/icons/stop-filled.svg'
							}
						]
					});
					// listen to message notificationClicked
					navigator.serviceWorker.addEventListener('message', (event) => {
						if (event.data?.type === 'notificationclick' &&
							event.data?.action === 'stopTracking') {
							stopTracking();
							registration.getNotifications().then((notifications) => {
								notifications.forEach((notification) => {
									notification.close();
								});
							});
						}
					});
				});
			}
		}
	}

	export function stopTracking() {
		try {
			if (notification_timeout) clearTimeout(notification_timeout);
			if (tracking_id) navigator.geolocation.clearWatch(tracking_id);
			tracking_id = null;
		} catch (e) {
			console.log(e);
		} finally {
			state = 'idle';
		}
	}

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
			await fetchMarkers({
				coords: {
					latitude,
					longitude,
					accuracy: 0,
					altitude: 0,
					altitudeAccuracy: 0,
					heading: 0,
					speed: 0
				},
				timestamp: Date.now()
			});
		}
	}

	onMount(() => {
		track();
		return () => stopTracking();
	});

	function handleMapReady(event: CustomEvent<{
		map: Map
	}>) {
		const { map } = event.detail;
		if (DEBUG) {
			map.on('click', function(e) {
				// get lat/lon of click
				const { coordinate } = e;
				const lonlat = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
				positionChanged({
					coords: {
						latitude: lonlat[1],
						longitude: lonlat[0],
						accuracy: 0,
						altitude: 0,
						altitudeAccuracy: 0,
						heading: 0,
						speed: 0
					},
					timestamp: Date.now()
				});
			});
		}
	}
</script>

{#if latitude && longitude}
	<Map bind:this={mapComp} center={{latitude, longitude}} on:mapready={handleMapReady}>
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
				<button class='relative btn join-item'
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
				<button class='relative btn join-item'
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