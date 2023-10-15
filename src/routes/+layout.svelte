<script lang='ts'>
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { page } from '$app/stores';
	import Flash from '$lib/components/Flash.svelte';
	import { Toaster } from 'svelte-sonner';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import ThemeBtn from './components/ThemeBtn.svelte';
	import { theme, themes } from '$lib/stores/theme';
	import { install, prompt } from '$lib/pwa';
	import { interacted } from '$lib/stores/interacted';
	import { fade } from 'svelte/transition';

	export let data: LayoutData;

	const flash = getFlash(page);

	let loaded = false;
	afterNavigate(() => {
		loaded = true;
	});

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidateAll();
			}
		});

		return () => data.subscription.unsubscribe();
	});

	onMount(() => {
		return theme.subscribe((current_theme) => {
			document.documentElement.dataset.theme = current_theme;
		});
	});
</script>

<div>
	<div class='navbar bg-base-100 gap-2'>
		<div class='flex-none'>
			<button class='btn btn-square btn-ghost'>
				<svg class='inline-block w-5 h-5 stroke-current' fill='none' viewBox='0 0 24 24'
						 xmlns='http://www.w3.org/2000/svg'>
					<path d='M4 6h16M4 12h16M4 18h16' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'></path>
				</svg>
			</button>
		</div>
		<div class='flex-1'>
			<a class='btn btn-ghost normal-case text-xl' href='/'>
				<Icon class='text-2xl' icon='fa-solid:bus' />
				<span>eTransport</span>
			</a>
		</div>
		<div class='dropdown dropdown-end'>
			<button class='btn btn-circle'>
				<Icon class='text-3xl' icon='mdi:brush' />
			</button>
			<ul
				class='bg-neutral flex flex-col gap-2 mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box z-10 w-[178px]'>
				{#each themes as theme}
					<li>
						<ThemeBtn {theme} />
					</li>
				{/each}
			</ul>
		</div>
		{#if !session}
			<div>
				<a class='btn' href='/login'>
					<Icon class='text-2xl' icon='flat-color-icons:google' />
					<span>Login</span>
				</a>
			</div>
		{/if}
		{#if session}
			<div class='dropdown dropdown-end'>
				<button class='btn btn-ghost btn-circle avatar'>
					<img src='{session.user.user_metadata.avatar_url}' alt='Avatar' class='rounded-full' />
				</button>
				<ul class='bg-neutral mt-3 p-2 shadow menu menu-sm dropdown-content rounded-box z-10'>
					<li>
						<form action='/?/logout' method='post'>
							<button class='btn block w-full' type='submit'>Logout</button>
						</form>
					</li>
				</ul>
			</div>
		{/if}
	</div>

	<div>
		<Toaster position='bottom-right' richColors />
		<Flash {flash} />
		<slot />
	</div>

	{#if ($prompt && $interacted) || true}
		<div class='fixed bottom-0 left-0 w-full bg-neutral p-4 flex items-center gap-4' transition:fade>
			<span class='flex-1'></span>
			<button class='btn btn-secondary self-end' on:click={install}>
				<Icon class='text-2xl' icon='ic:round-install-mobile' />
				<span>Install App</span>
			</button>
			<button class='btn' on:click={install}>
				<Icon class='text-2xl' icon='mdi:close' />
			</button>
		</div>
	{/if}

	{#if loaded}
		<span class='hidden' data-cy='loaded'></span>
	{/if}
</div>