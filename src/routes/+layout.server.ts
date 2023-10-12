import { loadFlash } from 'sveltekit-flash-message/server';
import type { ServerLoad } from '@sveltejs/kit';

const loadData = (({ locals }) => {
	return {
		session: locals.session
	};
}) satisfies ServerLoad;

export const load = loadFlash(loadData);
