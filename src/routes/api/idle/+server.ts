import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { and, between, eq } from 'drizzle-orm';
import { TRACKING_IDLE_DELAY, TRACKING_IDLE_MIN_TIME, TRACKING_IDLE_RADIUS } from '$lib/flags';
import { getPathLength } from 'geolib';

export const POST: RequestHandler = async ({ locals: { session } }) => {
	if (!session?.user?.id) {
		return json({ success: true });
	}

	const id_user = session.user.id;

	try {
		const recent_locations = await db
			.select({
				latitude: locations.latitude,
				longitude: locations.longitude,
				timestamp: locations.timestamp
			})
			.from(locations)
			.where(
				and(
					eq(locations.id_user, id_user),
					between(locations.timestamp, new Date(Date.now() - (TRACKING_IDLE_DELAY)), new Date())
				)
			)
			.orderBy(locations.timestamp);
		if (recent_locations.length === 0) {
			return json({ success: true, idle: true });
		}
		const pathLength = getPathLength(recent_locations.map((l) => ({
			latitude: l.latitude,
			longitude: l.longitude
		})));
		let time_diff = Date.now() - recent_locations[0].timestamp.getTime();
		if (recent_locations.length > 1) {
			const first = recent_locations[0];
			const last = recent_locations[recent_locations.length - 1];
			time_diff = last.timestamp.getTime() - first.timestamp.getTime();
		}
		console.log({ time_diff, pathLength, TRACKING_IDLE_MIN_TIME });
		if (time_diff > TRACKING_IDLE_MIN_TIME && pathLength < TRACKING_IDLE_RADIUS) {
			return json({ success: true, idle: true });
		}
	} catch (e) {
		console.log(e);
	}

	return json({ success: true });
};
