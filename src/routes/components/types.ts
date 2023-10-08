import type { SvelteComponent } from 'svelte';

export type TrackerComponent = SvelteComponent<{
	stopTracking?: () => void;
}>;
