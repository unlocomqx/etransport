import type { Config } from 'tailwindcss';
import * as colors from 'tailwindcss/colors';
import daisyui from 'daisyui';

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
	plugins: [daisyui],
	daisyui: {
		themes: ['light', 'lemonade', 'night', 'dark', 'dracula']
	}
} satisfies Config;
