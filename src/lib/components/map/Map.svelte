<script lang='ts'>
	import Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import TileLayer from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ';
	import View from 'ol/View';
	import { setContext } from 'svelte';
	import type { Coords } from '$lib/types';

	export let center: Coords = { latitude: 0, longitude: 0 };

	const { latitude, longitude } = center;

	let map: Map | null = null;

	setContext('map', {
		get instance() {
			return map;
		}
	});

	function initMap(div: HTMLDivElement) {
		const point = new Point(fromLonLat([ longitude, latitude ]));
		map = new Map({
			target: div,
			layers: [
				new TileLayer({
					source: new XYZ({
						url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
					})
				})
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