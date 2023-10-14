<script lang='ts'>
	import type { GeoGroup } from '$lib/utils/geo';
	import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
	import { Feature, Overlay } from 'ol';
	import { getContext, onMount } from 'svelte';
	import type Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import { Vector } from 'ol/source';
	import { Vector as VectorLayer } from 'ol/layer';

	export let group: GeoGroup;

	let popover: HTMLDivElement;
	$: ({ latitude, longitude } = group);
	$: icon = group.mode === 'train' ? '/map/train.png' : '/map/bus.png';

	$: key = `${group.id}-${latitude}-${longitude}-${icon}-${group.count}`;
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

		map.on('click', function(evt) {
			if (!latitude || !longitude || !popup) return;

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
			Object.assign(popover.style, {
				opacity: 1,
				pointerEvents: 'auto'
			});
		});

		return () => {
			map.removeLayer(vectorLayer);
		};
	});

	function getStyle() {
		return new Style({
			image: new Icon({
				anchor: [ 0.5, .85 ],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				src: icon,
				scale: 1
			}),
			text: new Text({
				text: group.count.toString(),
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
	}
</script>

<div class='away'
		 data-cy='transport-marker'
		 data-cy-count='{group.count}'
		 data-cy-id='{group.id}'
		 data-cy-mode='{group.mode}'
></div>

<div bind:this={popover} class='p-4 rounded w-fit bg-white opacity-0 transition-opacity'>
	This is a popover
</div>