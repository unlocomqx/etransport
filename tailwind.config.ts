import type { Config } from 'tailwindcss';
import * as colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				field: colors.blue,
				option: colors.orange
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'dracula']
	}
} satisfies Config;
