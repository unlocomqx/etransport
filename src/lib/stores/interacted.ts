import { writable } from 'svelte/store';

export const interacted = writable(false);

export function setInteracted() {
	setTimeout(() => {
		interacted.set(true);
	}, 5000);
}