import { persistCookie } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const theme = persistCookie(writable('light'), 'theme');
