import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createInsertSchema } from 'drizzle-zod';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';
import { desc, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals: { session } }) => {
	if (!session) {
		return json({ error: true, message: 'Please login first!' });
	}

	const data = (await request.json()) as typeof locations.$inferSelect;

	data.id_user = session.user.id;

	const form = await superValidate(
		data,
		createInsertSchema(locations).pick({
			id_user: true,
			mode: true
		})
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

		if (lastLocation) {
			await db
				.update(locations)
				.set({
					mode: form.data.mode
				})
				.where(eq(locations.id, lastLocation.id))
				.execute();
		}
	} catch (e) {
		console.log(e);
	}

	return json({ success: true });
};
