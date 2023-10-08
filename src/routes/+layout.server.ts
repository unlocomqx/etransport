import { loadFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/db/client';
import { and, eq } from 'drizzle-orm';
import { users } from '$lib/schemas/db/schema';

export const load = loadFlash(async ({ locals: { session } }) => {
	let user = undefined;

	if (session) {
		const email = session.user.email;
		if (email) {
			const rows = await db
				.select()
				.from(users)
				.where(and(eq(users.email, email), eq(users.active, true)));
			if (rows.length) {
				user = rows[0];
			}
		}
	}

	return {
		session,
		user
	};
});
