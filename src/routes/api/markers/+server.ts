import { error, json, type RequestHandler } from '@sveltejs/kit';
import { locations, users_reputation } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { asc, between, desc, eq } from 'drizzle-orm';
import { type GeoGroup, getGeoGroups, type UserLocation } from '$lib/utils/geo';

export const GET: RequestHandler = async ({ url }) => {
	const latitude_str = url.searchParams.get('latitude');
	const longitude_str = url.searchParams.get('longitude');

	if (!latitude_str || !longitude_str) {
		throw error(400, 'Invalid location');
	}

	const latitude = parseFloat(latitude_str);
	const longitude = parseFloat(longitude_str);

	if (isNaN(latitude) || isNaN(longitude)) {
		throw error(400, 'Invalid location');
	}

	let groups: GeoGroup[] = [];
	try {
		const recent_locations = await db
			.selectDistinctOn([ locations.id_user ], {
				id: locations.id,
				id_user: locations.id_user,
				latitude: locations.latitude,
				longitude: locations.longitude,
				timestamp: locations.timestamp,
				mode: locations.mode,
				reputation: users_reputation.reputation
			})
			.from(locations)
			.leftJoin(users_reputation, eq(locations.id_user, users_reputation.id_user))
			.where(between(locations.timestamp, new Date(Date.now() - 1000 * 3600), new Date()))
			.orderBy(asc(locations.id_user), desc(locations.timestamp))
			.execute();
		groups = getGeoGroups(recent_locations as UserLocation[], { latitude, longitude });
	} catch (e) {
		console.error(e);
		throw error(500, 'Could not fetch location data');
	}

	return json({
		groups
	});
};
