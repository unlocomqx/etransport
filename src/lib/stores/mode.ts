import { persisted } from 'svelte-persisted-store';

export const mode = persisted('mode', { value: 'bus' });
