import { persistCookie } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

const prefersDark =
	typeof window !== 'undefined' && window?.matchMedia('(prefers-color-scheme: dark)')?.matches;
export const theme = persistCookie(writable(prefersDark ? 'dark' : 'light'), 'theme');
