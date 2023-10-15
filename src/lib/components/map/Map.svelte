<script lang='ts'>
	import Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import { setContext } from 'svelte';
	import type { Coords } from '$lib/types';
	import { OSM } from 'ol/source';
	import { isDarkTheme, theme } from '$lib/stores/theme';

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

		tileLayer.on('prerender', (evt) => {
			if (!isDarkTheme($theme)) {
				return;
			}
			if (evt.context) {
				const context = evt.context as CanvasRenderingContext2D;
				context.filter = 'grayscale(0%) invert(100%) ';
				context.globalCompositeOperation = 'source-over';
			}
		});

		tileLayer.on('postrender', (evt) => {
			if (!isDarkTheme($theme)) {
				return;
			}
			if (evt.context) {
				const context = evt.context as CanvasRenderingContext2D;
				context.filter = 'none';
			}
		});

		theme.subscribe(() => {
			map?.getLayers().forEach(layer => {
				layer.changed();
			});
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