import { persistCookie } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let prefersDark = false;
if (browser) {
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	prefersDark = media?.matches;
	media.addEventListener('change', ({ matches }) => {
		theme.set(matches ? 'dark' : 'light');
	});
}

export const theme = persistCookie(writable(prefersDark ? 'dark' : 'light'), 'theme');
