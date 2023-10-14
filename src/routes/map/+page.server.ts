import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/db/client';
import { type LocationRow, locations } from '$lib/schemas/db/schema';
import { between, desc } from 'drizzle-orm';
import { type GeoGroup, getGeoGroups } from '$lib/utils/geo';

export const actions = {
	async default(event) {
		console.log('default', event);
	}
} satisfies Actions;

export const load = (async (event) => {
	const { url } = event;
	const latitude_str = url.searchParams.get('latitude');
	const longitude_str = url.searchParams.get('longitude');

	if (!latitude_str || !longitude_str) {
		throw redirect('/', { type: 'error', message: 'Invalid location' }, event);
	}

	const latitude = parseFloat(latitude_str);
	const longitude = parseFloat(longitude_str);

	if (isNaN(latitude) || isNaN(longitude)) {
		throw redirect('/', { type: 'error', message: 'Invalid location' }, event);
	}

	let groups: GeoGroup[] = [];
	try {
		const recent_locations = await db
			.selectDistinct({
				id: locations.id,
				id_user: locations.id_user,
				latitude: locations.latitude,
				longitude: locations.longitude,
				timestamp: locations.timestamp,
				mode: locations.mode
			})
			.from(locations)
			.where(between(locations.timestamp, new Date(Date.now() - 1000 * 3600), new Date()))
			.orderBy(desc(locations.timestamp))
			.execute();
		groups = getGeoGroups(recent_locations as LocationRow[], { latitude, longitude });
	} catch (e) {
		console.error(e);
		throw redirect('/', { type: 'error', message: 'Could not fetch location data' }, event);
	}

	return {
		latitude,
		longitude,
		groups
	};
}) satisfies PageServerLoad;
