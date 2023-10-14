<script lang='ts'>
	import type { GeoGroup } from '$lib/utils/geo';
	import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
	import { Feature } from 'ol';
	import { getContext, onMount } from 'svelte';
	import type Map from 'ol/Map';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import { Vector } from 'ol/source';
	import { Vector as VectorLayer } from 'ol/layer';

	export let group: GeoGroup;

	$: ({ latitude, longitude } = group);
	$: icon = group.mode === 'train' ? '/map/train.png' : '/map/bus.png';

	$: key = `${group.id}-${latitude}-${longitude}-${icon}-${group.count}`;
	$: {
		updateIcon();
		key;
	}

	let iconStyle: Style | null = null;
	let iconFeature: Feature | null = null;

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
				scale: .75
			}),
			text: new Text({
				text: group.count.toString(),
				offsetY: -12,
				font: 'bold 24px sans-serif',
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
</script>

<div class='away'
		 data-cy='transport-marker'
		 data-cy-count='{group.count}'
		 data-cy-id='{group.id}'
		 data-cy-mode='{group.mode}'
></div>