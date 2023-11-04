import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createInsertSchema } from 'drizzle-zod';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { and, desc, eq, notBetween, sql } from 'drizzle-orm';
import { TRACKING_THRESHOLD } from '$lib/flags';

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

		if (lastLocation) {
			if (Date.now() - lastLocation.timestamp.getTime() < TRACKING_THRESHOLD) {
				can_add = false;
				console.log('Too soon. can_add = false');
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
					mode: form.data.mode
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
