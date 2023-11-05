import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createInsertSchema } from 'drizzle-zod';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { and, desc, eq, notBetween, sql } from 'drizzle-orm';
import { HEADING_LIFESPAN, TRACKING_THRESHOLD } from '$lib/flags';
import { getRhumbLineBearing } from 'geolib';

export const POST: RequestHandler = async ({ request, locals: { session } }) => {
	if (!session) {
		return json({ error: true, message: 'Please login first!' });
	}

	const data = (await request.json()) as typeof locations.$inferSelect;

	data.id_user = session.user.id;

	const form = await superValidate(
		{
			...data,
			timestamp: new Date(data.timestamp)
		},
		createInsertSchema(locations)
	);

	if (!form.valid) {
		console.log(form.errors);
		return json({
			error: true,
			errors: form.errors
		});
	}

	try {
		const lastLocation = await db
			.select()
			.from(locations)
			.where(eq(locations.id_user, form.data.id_user))
			.orderBy(desc(locations.timestamp))
			.limit(1)
			.then((r) => r[0]);

		let can_add = true;
		let heading = null;

		if (lastLocation) {
			const time_diff = Date.now() - lastLocation.timestamp.getTime();
			if (time_diff < TRACKING_THRESHOLD) {
				can_add = false;
			}

			if (time_diff < HEADING_LIFESPAN) {
				const bearing = getRhumbLineBearing(
					[ lastLocation.longitude, lastLocation.latitude ],
					[ form.data.longitude, form.data.latitude ]
				);
				heading = parseInt(bearing.toFixed(0));
			}
		}

		if (can_add) {
			const inserted = await db
				.insert(locations)
				.values({
					id_user: form.data.id_user,
					latitude: form.data.latitude,
					longitude: form.data.longitude,
					timestamp: form.data.timestamp,
					mode: form.data.mode,
					heading
				})
				.returning();
			if (!inserted) {
				return json({ error: true, message: 'Could not save location' });
			}

			// delete old locations
			await db
				.delete(locations)
				.where(
					and(
						eq(locations.id_user, form.data.id_user),
						notBetween(locations.timestamp, sql`NOW() - INTERVAL '2 HOURS'`, sql`NOW()`)
					)
				)
				.execute();
		}
	} catch (e) {
		console.log(e);
	}

	return json({ success: true });
};
