import { getDistance } from 'geolib';

export function getGeoCenter(data: [number, number][]) {
	const coordLength = data.length;

	let x = 0;
	let y = 0;
	let z = 0;

	for (const [latitude, longitude] of data) {
		const lat = (latitude * Math.PI) / 180;
		const lon = (longitude * Math.PI) / 180;

		x += Math.cos(lat) * Math.cos(lon);
		y += Math.cos(lat) * Math.sin(lon);
		z += Math.sin(lat);
	}

	x /= coordLength;
	y /= coordLength;
	z /= coordLength;

	const lonResult = Math.atan2(y, x);
	const hyp = Math.sqrt(x * x + y * y);
	const latResult = Math.atan2(z, hyp);

	return [(latResult * 180) / Math.PI, (lonResult * 180) / Math.PI];
}

export function getGeoCenters(locations: [string, number, number][]) {
	const distances = locations.map(
		([id, lat, lng]) =>
			[id, [lat, lng], getDistance([0, 0], [lat, lng])] as [string, [number, number], number]
	);
	const sorted = distances.sort((a, b) => a[2] - b[2]);
	const grouped = new Map<string, [number, number][]>();
	let lastIndex = 0;
	for (let index = 0; index < sorted.length; index++) {
		const [id, coords] = sorted[index];
		if (index === lastIndex) {
			grouped.set(id, [coords]);
			// continue;
		} else {
			const [lastId, lastCoords] = sorted[lastIndex];
			if (getDistance(lastCoords, coords) < 1000) {
				grouped.set(lastId, [...grouped.get(lastId)!, coords]);
				// continue;
			} else {
				grouped.set(id, [coords]);
				lastIndex = index;
			}
		}
	}
	console.log({
		grouped: Array.from(grouped.entries())
			.filter(([_, coords]) => coords.length > 1)
			.map(([_, coords]) => coords.map((latlng) => latlng.join(',')))
	});
	const centers = Array.from(grouped.entries()).map(([id, coords]) => [
		id,
		getGeoCenter(coords),
		coords.length
	]);
	return centers;
}
