<script lang='ts'>
	import Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import { createEventDispatcher, setContext } from 'svelte';
	import type { Coords } from '$lib/types';
	import { OSM } from 'ol/source';

	export let map: Map | null = null;
	export let center: Coords = { latitude: 0, longitude: 0 };
	export const centerMap = (center: Coords) => {
		if (!map) return;
		const point = new Point(fromLonLat([ center.longitude, center.latitude ]));
		map.getView().setCenter(point.getCoordinates());
	};

	const { latitude, longitude } = center;

	// dispatch event using svelte event dispatcher
	const dispatch = createEventDispatcher();

	setContext('map', {
		get instance() {
			return map;
		}
	});

	function initMap(div: HTMLDivElement) {
		const point = new Point(fromLonLat([ longitude, latitude ]));
		const tileLayer = new TileLayer({
			source: new OSM()
		});
		map = new Map({
			target: div,
			layers: [
				tileLayer
			],
			view: new View({
				center: point.getCoordinates(),
				zoom: 15
			})
		});

		// change mouse cursor when over marker
		map.on('pointermove', function(e) {
			if (!map) return;
			const pixel = map.getEventPixel(e.originalEvent);
			const hit = map.hasFeatureAtPixel(pixel);
			const target = map.getTarget();
			if (target instanceof HTMLElement) {
				target.style.cursor = hit ? 'pointer' : '';
			}
		});

		dispatch('mapready', { map });

		return {
			destroy() {
				map?.setTarget(undefined);
				map = null;
			}
		};
	}
</script>

<div class='map fixed w-full h-full' use:initMap>
	<slot></slot>
</div>