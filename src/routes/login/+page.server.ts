import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { session } }) => {
	if (session) {
		// throw redirect(303, '/');
	}

	return { session };
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event) => {
		const { data, error: err } = await event.locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: event.url.origin
			}
		});

		if (err) {
			console.log(err);
			return fail(400, {
				message: 'Something went wrong. Please try again later.'
			});
		}

		throw redirect(303, data.url);
	},
	logout: async ({ locals: { supabase, session } }) => {
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/');
		}
	}
};
