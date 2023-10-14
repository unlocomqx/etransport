import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db/client';
import { locations, modeEnum, users_reputation } from '$lib/schemas/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export const actions = {
	async upvote(event) {
		const data = await event.request.formData();
		const ids = data.getAll('ids[]').map(String);
		const mode = data.get('mode')?.toString() ?? '';
		if (!ids || !mode) {
			return fail(400, { message: 'Invalid data' });
		}

		if (!modeEnum.enumValues.includes(mode as any)) {
			return fail(400, { message: 'Invalid mode' });
		}

		try {
			const id_users = await db
				.select({
					id_user: locations.id_user
				})
				.from(locations)
				.where(and(inArray(locations.id, ids), eq(locations.mode, mode as any)))
				.then((rows) => rows.map((row) => row.id_user));

			await db.transaction(async (trx) => {
				console.log(id_users);
				for (const id_user of id_users) {
					await db
						.insert(users_reputation)
						.values({
							id_user,
							reputation: 1
						})
						.onConflictDoUpdate({
							target: users_reputation.id_user,
							set: {
								reputation: sql`${users_reputation.reputation} + 1`
							}
						});
				}
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error occurred, please try again!' });
		}

		return { success: true, message: 'Thank you for your feedback!' };
	},
	async downvote(event) {
		const data = await event.request.formData();
		const ids = data.getAll('ids[]').map(String);
		const mode = data.get('mode')?.toString() ?? '';
		if (!ids || !mode) {
			return fail(400, { message: 'Invalid data' });
		}

		if (!modeEnum.enumValues.includes(mode as any)) {
			return fail(400, { message: 'Invalid mode' });
		}

		try {
			const id_users = await db
				.select({
					id_user: locations.id_user
				})
				.from(locations)
				.where(and(inArray(locations.id, ids), eq(locations.mode, mode as any)))
				.then((rows) => rows.map((row) => row.id_user));

			await db.transaction(async (trx) => {
				console.log(id_users);
				for (const id_user of id_users) {
					await db
						.insert(users_reputation)
						.values({
							id_user,
							reputation: -1
						})
						.onConflictDoUpdate({
							target: users_reputation.id_user,
							set: {
								reputation: sql`${users_reputation.reputation} - 1`
							}
						});
				}
			});
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error occurred, please try again!' });
		}

		return { success: true, message: 'Thank you for your feedback!' };
	}
} satisfies Actions;

export const load = (async (event) => {}) satisfies PageServerLoad;
