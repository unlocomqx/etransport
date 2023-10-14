<script lang='ts'>
	import type { GeoGroup } from '$lib/utils/geo';
	import { Fill, Icon as olIcon, Stroke, Style, Text } from 'ol/style';
	import { Feature, Overlay } from 'ol';
	import { getContext, onMount } from 'svelte';
	import type Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import { Vector } from 'ol/source';
	import { Vector as VectorLayer } from 'ol/layer';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { formToaster } from '$lib/utils/form_toaster.js';

	export let group: GeoGroup;

	let popover: HTMLDivElement;
	let display_popover = false;

	$: ({ latitude, longitude } = group);
	$: icon = group.mode === 'train' ? '/map/train.png' : '/map/bus.png';

	$: key = `${group.id}-${latitude}-${longitude}-${icon}-${group.count}-${group.total_reputation}`;
	$: {
		updateIcon();
		key;
	}

	let iconStyle: Style | null = null;
	let iconFeature: Feature | null = null;
	let popup: Overlay | null = null;

	const mapContext = getContext('map') as {
		instance: Map;
	};

	onMount(() => {
		if (!latitude || !longitude) return;

		const map = mapContext.instance;

		iconStyle = getStyle();

		iconFeature = new Feature({
			geometry: new Point(fromLonLat([ longitude, latitude ]))
		});
		iconFeature.setStyle(iconStyle);

		const vectorSource = new Vector({
			features: [ iconFeature ]
		});

		const vectorLayer = new VectorLayer({
			source: vectorSource
		});

		map.addLayer(vectorLayer);

		popup = new Overlay({
			element: popover,
			positioning: 'bottom-center',
			stopEvent: false,
			autoPan: true,
			offset: [ 0, -50 ]
		});
		map.addOverlay(popup);

		const handleClick = function(evt: any) {
			if (!latitude || !longitude || !popup) return;

			display_popover = false;
			Object.assign(popover.style, {
				opacity: 0,
				pointerEvents: 'none'
			});

			const feature = map!.forEachFeatureAtPixel(evt.pixel, function(feature) {
				return feature;
			});

			if (!feature || feature !== iconFeature) {
				return;
			}

			const coords = new Point(fromLonLat([ longitude, latitude ]));
			popup.setPosition(coords.getCoordinates());
			map.getView().animate({
				center: evt.coordinate,
				duration: 500
			});
			display_popover = true;
			Object.assign(popover.style, {
				opacity: 1,
				pointerEvents: 'auto'
			});
		};
		map.on('click', handleClick);

		return () => {
			map.removeLayer(vectorLayer);
			if (popup) {
				map.removeOverlay(popup);
			}
			map.removeEventListener('click', handleClick);
		};
	});

	function getStyle() {
		return new Style({
			image: new olIcon({
				anchor: [ 0.5, .85 ],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: icon,
				scale: 1
			}),
			text: new Text({
				text: group.total_reputation.toString(),
				offsetY: -6,
				font: 'bold 16px sans-serif',
				justify: 'center',
				fill: new Fill({
					color: 'red'
				}),
				stroke: new Stroke({
					color: 'white',
					width: 5
				})
			})
		});
	}

	function updateIcon() {
		if (!latitude || !longitude) return;

		iconFeature?.setGeometry(new Point(fromLonLat([ longitude, latitude ])));
		iconFeature?.setStyle(getStyle());
	}

	$: updatePopup(popover);

	async function updatePopup(popover: HTMLDivElement) {
		if (!popup) return;

		const map = mapContext.instance;

		map.removeOverlay(popup);
		popup = new Overlay({
			element: popover,
			positioning: 'bottom-center',
			stopEvent: false,
			autoPan: true,
			offset: [ 0, -50 ]
		});
		map.addOverlay(popup);

		if (display_popover) {
			Object.assign(popover.style, {
				opacity: 1,
				pointerEvents: 'auto'
			});
		}
	}
</script>

<div class='away'
		 data-cy='transport-marker'
		 data-cy-count='{group.count}'
		 data-cy-id='{group.id}'
		 data-cy-mode='{group.mode}'
></div>

<div bind:this={popover} class='text-center p-4 rounded w-fit max-w-md bg-white opacity-0 transition-opacity'>
	<form method='post' use:enhance={formToaster()}>
		{#each group.ids as id}
			<input name='ids[]' type='hidden' value='{id}'>
		{/each}
		<input name='mode' type='hidden' value='{group.mode}'>
		<p class='text-2xl font-bold'>
			{group.count} passenger{group.count > 1 ? 's' : ''} reported the location of this {group.mode}.
		</p>
		<p class='text-2xl mt-4 text-gray-500'>
			Is this marker correct?
		</p>
		<div class='mt-4'>
			<button class='btn btn-success' data-cy='upvote-btn' formaction='/api/reaction?/upvote'>
				<Icon class='text-2xl' icon='mdi:arrow-up' />
			</button>
			<button class='btn btn-error' data-cy='downvote-btn' formaction='/api/reaction?/downvote'>
				<Icon class='text-2xl' icon='mdi:arrow-down' />
			</button>
		</div>
	</form>
</div>