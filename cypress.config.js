import { defineConfig } from 'cypress';
import watch from 'cypress-watch-and-reload/plugins';
import { seed } from './cypress/plugins/seed';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
	video: false,
	e2e: {
		baseUrl: 'http://localhost:5173',

		specPattern: '**/*.cy.ts',

		setupNodeEvents(on, config) {
			on('task', {
				seed: async ({ spec }) => {
					return seed(spec);
				}
			});

			on(
				'file:preprocessor',
				vitePreprocessor({
					configFile: './cypress/vite.config.ts',
					mode: 'development'
				})
			);

			watch(on, config);
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
			}
		}
	}
});
