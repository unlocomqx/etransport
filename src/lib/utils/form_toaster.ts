import type { SubmitFunction } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const formToaster = (cb: SubmitFunction = () => {}) => {
	return ((params) => {
		const cb_result = cb(params);

		return async (args) => {
			const { result, update } = args;

			if (result.type === 'success') {
				if (result.data?.message) {
					toast.success(result.data.message);
				}
			}

			if (result.type === 'failure') {
				if (result.data?.message) {
					toast.error(result.data.message);
				}
			}

			if (result.type === 'error') {
				if (result.error?.message) {
					toast.error(result.error.message);
				}
			}

			await update();

			if (typeof cb_result === 'function') {
				cb_result(args);
			}
		};
	}) satisfies SubmitFunction;
};
