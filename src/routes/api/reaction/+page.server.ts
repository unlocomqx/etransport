import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db/client';
import { locations, modeEnum, reactions, users_reputation } from '$lib/schemas/db/schema';
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
			const location_rows = await db
				.select({
					id: locations.id,
					id_user: locations.id_user
				})
				.from(locations)
				.where(and(inArray(locations.id, ids), eq(locations.mode, mode as any)))
				.execute();

			const ip = event.getClientAddress();
			await db.transaction(async (trx) => {
				for (const location of location_rows) {
					const upvote = await db
						.select()
						.from(reactions)
						.where(
							and(
								eq(reactions.id_location, location.id),
								eq(reactions.ip, ip),
								eq(reactions.type, 'upvote')
							)
						)
						.then((rows) => rows[0]);
					if (!upvote) {
						await db
							.insert(users_reputation)
							.values({
								id_user: location.id_user,
								reputation: 1
							})
							.onConflictDoUpdate({
								target: users_reputation.id_user,
								set: {
									reputation: sql`${users_reputation.reputation} + 1`
								}
							});
						await db.insert(reactions).values({
							id_location: location.id,
							ip,
							type: 'upvote'
						});
						await db
							.delete(reactions)
							.where(
								and(
									eq(reactions.id_location, location.id),
									eq(reactions.ip, ip),
									eq(reactions.type, 'downvote')
								)
							);
					}
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
			const location_rows = await db
				.select({
					id: locations.id,
					id_user: locations.id_user
				})
				.from(locations)
				.where(and(inArray(locations.id, ids), eq(locations.mode, mode as any)))
				.execute();

			const ip = event.getClientAddress();
			await db.transaction(async (trx) => {
				for (const location of location_rows) {
					const downvote = await db
						.select()
						.from(reactions)
						.where(
							and(
								eq(reactions.id_location, location.id),
								eq(reactions.ip, ip),
								eq(reactions.type, 'downvote')
							)
						)
						.then((rows) => rows[0]);
					if (!downvote) {
						await db
							.insert(users_reputation)
							.values({
								id_user: location.id_user,
								reputation: 1
							})
							.onConflictDoUpdate({
								target: users_reputation.id_user,
								set: {
									reputation: sql`${users_reputation.reputation} - 1`
								}
							});
						await db.insert(reactions).values({
							id_location: location.id,
							ip,
							type: 'downvote'
						});
						await db
							.delete(reactions)
							.where(
								and(
									eq(reactions.id_location, location.id),
									eq(reactions.ip, ip),
									eq(reactions.type, 'upvote')
								)
							);
					}
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
