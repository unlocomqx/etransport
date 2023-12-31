import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	let {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	if (process.env.TEST) {
		if (!session) {
			session = {
				// @ts-ignore
				user: {
					id: 'new-user'
				}
			};
		}
	}

	event.locals.session = session;
	event.locals.user = session?.user;

	const cookie = event.cookies.get('theme');
	const theme = JSON.parse(cookie || '"night"');

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		},
		transformPageChunk: ({ html, done }) => {
			if (done) {
				return html.replace('%sveltekit.theme%', theme);
			}
		}
	});
};
