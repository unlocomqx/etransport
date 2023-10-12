import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const actions = {
	async default(event) {
		console.log('default', event);
	}
} satisfies Actions;

export const load = (async (event) => {
	const { url } = event;
	const latitude = url.searchParams.get('latitude');
	const longitude = url.searchParams.get('longitude');

	if (!latitude || !longitude) {
		throw redirect('/', { type: 'error', message: 'Invalid location' }, event);
	}

	return {
		latitude,
		longitude
	};
}) satisfies PageServerLoad;
