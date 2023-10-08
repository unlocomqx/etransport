import type { PageServerLoad } from './$types';
import { type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ locals: { supabase, session } }) => {
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/');
		}
	}
};

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
