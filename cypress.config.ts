import { defineConfig } from 'cypress';
// @ts-ignore
import watch from 'cypress-watch-and-reload/plugins';
import { seed } from './cypress/plugins/seed';
import vitePreprocessor from 'cypress-vite';
import { cypressBrowserPermissionsPlugin } from 'cypress-browser-permissions';
import { insertLocation, seedLocations, updateLocation } from './cypress/plugins/seed-locations';

export default defineConfig({
	video: false,
	e2e: {
		baseUrl: 'http://localhost:5173',

		specPattern: '**/*.cy.ts',

		setupNodeEvents(on, config) {
			on('task', {
				seed: async ({ spec }) => {
					return seed(spec);
				},
				seedLocations,
				insertLocation,
				updateLocation
			});

			on(
				'file:preprocessor',
				vitePreprocessor({
					configFile: './cypress/vite.config.ts',
					mode: 'development'
				})
			);

			watch(on, config);

			config = cypressBrowserPermissionsPlugin(on, config);

			return config;
		},

		retries: {
			runMode: 2,
			openMode: 0
		},

		env: {
			'cypress-watch-and-reload': {
				watch: [
					'src/**/*.svelte',
					'src/**/*.ts',
					'src/**/*.css',
					'src/**/*.html',
					'cypress/**/*.sql'
				]
			},
			browserPermissions: {
				geolocation: 'allow',
				notifications: 'allow'
			}
		}
	}
});
