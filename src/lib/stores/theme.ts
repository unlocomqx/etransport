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

const light_themes = ['light', 'lemonade'];
const dark_themes = ['dark', 'dracula', 'night'];
export const themes = [...light_themes, ...dark_themes];

export function isDarkTheme(theme: string) {
	return dark_themes.includes(theme);
}
