import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createInsertSchema } from 'drizzle-zod';
import { locations } from '$lib/schemas/db/schema';
import { db } from '$lib/db/client';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	console.log({ data });

	const schema = createInsertSchema(locations);
	const form = await superValidate(
		{
			...data,
			timestamp: new Date(data.timestamp)
		},
		schema
	);

	console.log(form);

	if (!form.valid) {
		return json({
			error: true,
			errors: form.errors
		});
	}

	try {
		await db
			.insert(locations)
			.values({
				id_user: form.data.id_user,
				latitude: form.data.latitude,
				longitude: form.data.longitude,
				timestamp: form.data.timestamp
			})
			.execute();
	} catch (e) {
		console.log(e);
	}

	return json({ success: true });
};
