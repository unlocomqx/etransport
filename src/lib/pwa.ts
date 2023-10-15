// This variable will save the event for later use.
import { get, writable } from 'svelte/store';
import type { BeforeInstallPromptEvent } from '$lib/types';
import { browser } from '$app/environment';

export const prompt = writable<BeforeInstallPromptEvent | null>(null);

if (browser) {
	window.addEventListener('beforeinstallprompt', (e) => {
		console.log('beforeinstallprompt');
		// Prevents the default mini-infobar or install dialog from appearing on mobile
		e.preventDefault();
		// Save the event because you'll need to trigger it later.
		prompt.set(e as BeforeInstallPromptEvent);
	});
}

export async function install() {
	const p = get(prompt);
	if (p instanceof Event) {
		const prompt_result = p.prompt();
		console.log({ prompt_result });

		const { outcome } = await p.userChoice;
		prompt.set(null);

		if (outcome === 'accepted') {
			console.log('User accepted the install prompt.');
		} else if (outcome === 'dismissed') {
			console.log('User dismissed the install prompt');
		}
	}
}