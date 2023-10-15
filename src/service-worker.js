/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker'; // Create a unique cache name for this deployment

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const excluded = [];
const excluded_folders = [];
const cacheable = [];

const ASSETS = [
	...build, // the app itself
	...files.filter((file) => !excluded.some((excluded) => file.includes(`/${excluded}/`)))
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

/** @param {ExtendableEvent} event */
self.addEventListener('activate', async (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
	await event.target.clients.claim();
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	if (excluded_folders.some((excluded) => event.request.url.includes(`/${excluded}/`))) return;

	if (!event.request.url.includes(self.location.origin)) {
		return;
	}

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			return cache.match(url.pathname);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);
			if (response.status === 200) {
				if (event.request.url.startsWith('http')) {
					if (cacheable.some((path) => event.request.url.includes(`/${path}/`))) {
						await cache.put(event.request, response.clone());
					}
					await cache.put(event.request, response.clone());
				}
			}

			return response;
		} catch {
			return cache.match(event.request);
		}
	}

	event.respondWith(respond());
});
