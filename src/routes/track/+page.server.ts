import type { PageServerLoad } from './$types';
import { cleanUserLocations } from '$lib/server/locations';

export const load = (async ({ locals: { session } }) => {
	if (session?.user) {
		console.log('cleaning user locations');
		await cleanUserLocations(session.user.id);
	}
}) satisfies PageServerLoad;