import { createLocalStorage, persist, writable } from '@macfja/svelte-persistent-store';

export const mode = persist(writable('bus'), createLocalStorage(), 'mode');
