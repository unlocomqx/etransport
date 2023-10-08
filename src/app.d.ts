// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SupabaseClient, User } from '@supabase/supabase-js';

declare module '*.svelte' {
	export { SvelteComponentDev as default } from 'svelte/internal';
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			session: Session | null;
			user: User | undefined;
		}

		interface PageData {
			flash?: {
				type: 'success' | 'error';
				message: string;
			};
		}

		// interface Platform {}
	}
}

export {};
