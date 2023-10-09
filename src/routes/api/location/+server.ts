import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createInsertSchema } from 'drizzle-zod';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { desc, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as typeof locations.$inferSelect;

	const form = await superValidate(
		{
			...data,
			timestamp: new Date(data.timestamp)
		},
		createInsertSchema(locations)
	);

	if (!form.valid) {
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

		if (lastLocation && Date.now() - lastLocation.timestamp.getTime() < 10000) {
			can_add = false;
		}

		if (can_add) {
			await db
				.insert(locations)
				.values({
					id_user: form.data.id_user,
					latitude: form.data.latitude,
					longitude: form.data.longitude,
					timestamp: form.data.timestamp
				})
				.execute();
		}
	} catch (e) {
		console.log(e);
	}

	return json({ success: true });
};
