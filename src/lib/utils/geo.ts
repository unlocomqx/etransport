import { getDistance } from 'geolib';
import type { LocationRow } from '$lib/schemas/db/schema';
import type { Coords } from '$lib/types';

export type GeoGroup = Partial<LocationRow> & {
	id_users: string[];
	count: number;
};

export function getGeoGroup(locations: Partial<LocationRow>[]): GeoGroup {
	const coordLength = locations.length;

	let x = 0;
	let y = 0;
	let z = 0;
	const modes: string[] = [];

	for (const { latitude, longitude, mode } of locations) {
		if (!latitude || !longitude || !mode) continue;

		const lat = (latitude * Math.PI) / 180;
		const lon = (longitude * Math.PI) / 180;

		x += Math.cos(lat) * Math.cos(lon);
		y += Math.cos(lat) * Math.sin(lon);
		z += Math.sin(lat);
		modes.push(mode);
	}

	const modesCount = modes.reduce(
		(acc, cur) => {
			if (!acc[cur]) acc[cur] = 0;
			acc[cur]++;
			return acc;
		},
		{} as Record<string, number>
	);

	const mostUsedMode = Object.entries(modesCount).sort(
		(a, b) => b[1] - a[1]
	)[0][0] as LocationRow['mode'];

	x /= coordLength;
	y /= coordLength;
	z /= coordLength;

	const lonResult = Math.atan2(y, x);
	const hyp = Math.sqrt(x * x + y * y);
	const latResult = Math.atan2(z, hyp);

	const lat = (latResult * 180) / Math.PI;
	const lng = (lonResult * 180) / Math.PI;
	return {
		id_users: [], //locations.map((loc) => loc.id_user).map((id) => id!),
		latitude: lat,
		longitude: lng,
		mode: mostUsedMode,
		count: coordLength
	};
}

export function getGeoGroups(
	locations: LocationRow[],
	origin: Coords,
	limit: number | undefined = undefined
): GeoGroup[] {
	const distances = locations.map(({ id_user, latitude, longitude, mode }) => ({
		id_user,
		latitude,
		longitude,
		distance: getDistance([origin.latitude, origin.longitude], [latitude, longitude]),
		mode
	}));
	const sorted: Partial<LocationRow>[] = distances.sort((a, b) => a.distance - b.distance);
	const grouped = new Map<number, Partial<LocationRow>[]>();
	let lastIndex = 0;
	for (let index = 0; index < sorted.length; index++) {
		const { id_user, latitude, longitude, mode } = sorted[index] as Partial<LocationRow>;
		if (!id_user || !latitude || !longitude || !mode) continue;

		if (index === lastIndex) {
			grouped.set(index, [
				{
					id_user,
					latitude,
					longitude,
					mode
				}
			]);
		} else {
			const {
				id_user: lastId,
				latitude: lastLatitude,
				longitude: lastLongitude,
				mode
			} = sorted[lastIndex] as Partial<LocationRow>;
			if (!lastId || !lastLatitude || !lastLongitude || !mode) continue;

			if (getDistance([lastLatitude, lastLongitude], [latitude, longitude]) < 1000) {
				grouped.set(lastIndex!, [
					...grouped.get(lastIndex)!,
					{
						id_user,
						latitude,
						longitude,
						mode
					}
				]);
			} else {
				grouped.set(index, [
					{
						id_user,
						latitude,
						longitude,
						mode
					}
				]);
				lastIndex = index;
			}
		}
	}

	let groupsLimit = grouped.size;
	if (limit) {
		groupsLimit = Math.min(limit, groupsLimit);
	}

	return Array.from(grouped.entries())
		.splice(0, groupsLimit)
		.map(([, locs]) => getGeoGroup(locs));
}
