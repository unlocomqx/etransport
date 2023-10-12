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
	const latitude_str = url.searchParams.get('latitude');
	const longitude_str = url.searchParams.get('longitude');

	if (!latitude_str || !longitude_str) {
		throw redirect('/', { type: 'error', message: 'Invalid location' }, event);
	}

	const latitude = parseFloat(latitude_str);
	const longitude = parseFloat(longitude_str);

	if (isNaN(latitude) || isNaN(longitude)) {
		throw redirect('/', { type: 'error', message: 'Invalid location' }, event);
	}

	return {
		latitude,
		longitude
	};
}) satisfies PageServerLoad;
