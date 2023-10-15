<script lang='ts'>
	import { theme as themeStore } from '$lib/stores/theme';

	export let theme: string;

	function setTheme() {
		$themeStore = theme;
	}
</script>

<button
	class='border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 outline-transparent'
	class:!outline-secondary-focus={$themeStore === theme}
	on:click={setTheme}>
	<span class='bg-base-100 text-base-content w-full cursor-pointer font-sans' data-theme='{theme}'>
		<span class='grid grid-cols-5 grid-rows-3'>
			<span class='bg-base-200 col-start-1 row-span-2 row-start-1'></span>
			<span class='bg-base-300 col-start-1 row-start-3'></span>
			<span class='bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2'>
				<span class='font-bold'>{theme}</span>
				<span class='flex flex-wrap gap-1'>
					<span class='bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
						<span class='text-primary-content text-sm font-bold'>A</span>
					</span>
					<span class='bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
						<span class='text-secondary-content text-sm font-bold'>A</span>
					</span>
					<span class='bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
						<span class='text-accent-content text-sm font-bold'>A</span>
					</span>
					<span class='bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
						<span class='text-neutral-content text-sm font-bold'>A</span>
					</span>
				</span>
			</span>
		</span>
	</span>
</button>