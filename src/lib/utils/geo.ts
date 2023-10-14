import { getDistance } from 'geolib';
import type { LocationRow } from '$lib/schemas/db/schema';
import type { Coords } from '$lib/types';

export type GeoGroup = Partial<LocationRow> & {
	id_users: string[];
	count: number;
};

export function getGeoGroup(id: string, locations: Partial<LocationRow>[]): GeoGroup {
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
		id,
		id_users: locations.map((loc) => loc.id_user).map((id) => id!),
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
	const distances = locations.map(({ id, id_user, latitude, longitude, timestamp, mode }) => ({
		id,
		id_user,
		latitude,
		longitude,
		timestamp,
		distance: getDistance([origin.latitude, origin.longitude], [latitude, longitude]),
		mode
	}));
	const sorted: Partial<LocationRow>[] = distances.sort((a, b) => a.distance - b.distance);
	const grouped = new Map<string, Partial<LocationRow>[]>();
	let lastIndex = 0;
	for (let index = 0; index < sorted.length; index++) {
		const { id, id_user, latitude, longitude, timestamp, mode } = sorted[
			index
		] as Partial<LocationRow>;
		if (!id || !id_user || !latitude || !longitude || !mode) continue;

		if (index === lastIndex) {
			grouped.set(id, [
				{
					id_user,
					latitude,
					longitude,
					mode
				}
			]);
		} else {
			const {
				id: lastId,
				latitude: lastLatitude,
				longitude: lastLongitude,
				timestamp: lastTimestamp
			} = sorted[lastIndex] as Partial<LocationRow>;
			if (!lastId || !lastLatitude || !lastLongitude) continue;

			const distance = getDistance([lastLatitude, lastLongitude], [latitude, longitude]);
			const time_diff = Math.abs(timestamp!.getTime() - lastTimestamp!.getTime()) / 1000;
			if (distance < 10 && time_diff < 60) {
				grouped.set(lastId!, [
					...grouped.get(lastId)!,
					{
						id_user,
						latitude,
						longitude,
						mode
					}
				]);
			} else {
				grouped.set(id, [
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
		.map(([id, locs]) => getGeoGroup(id, locs));
}
