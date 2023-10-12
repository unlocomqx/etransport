import { Icon, Style } from 'ol/style';
import { Feature } from 'ol';
import Point from 'ol/geom/Point.js';
import { fromLonLat } from 'ol/proj';
import { Vector } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import type { Coordinate } from 'ol/coordinate';

export function getCenterIcon(coords: Coordinate) {
	const iconStyle = new Style({
		image: new Icon({
			src: '/map/location-indicator-red.svg',
			scale: 3
		})
	});
	const iconFeature = new Feature(new Point(fromLonLat(coords)));
	iconFeature.setStyle(iconStyle);

	const vectorSource = new Vector({
		features: [iconFeature]
	});

	return new VectorLayer({
		source: vectorSource
	});
}
