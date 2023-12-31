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
	import Analytics from './components/Analytics.svelte';

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
		<div class='flex-1'>
			<a class='btn btn-ghost normal-case text-xl' data-sveltekit-reload href='/'>
				<img alt='Logo' src='/logo.svg' width='32'>
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
		<Toaster closeButton position='top-center' richColors />
		<Flash {flash} />
		<slot />
	</div>

	{#if $prompt && $interacted}
		<div class='fixed bottom-0 left-0 w-full bg-neutral p-4 flex items-center gap-4 z-20' transition:fade>
			<span class='flex-1'></span>
			<button class='btn btn-primary self-end' on:click={install}>
				<Icon class='text-2xl' icon='ic:round-install-mobile' />
				<span>Install App</span>
			</button>
			<button class='btn' on:click={() => prompt.set(null)}>
				<Icon class='text-2xl' icon='mdi:close' />
			</button>
		</div>
	{/if}

	{#if loaded}
		<span class='hidden' data-cy='loaded'></span>
	{/if}
</div>

<div class='bg'>
	<img alt='Background' src='/logo.svg'>
</div>

<Analytics />

<style>
  .bg {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: saturate(0%);
    opacity: .1;
  }

  .bg img {
    position: fixed;
    top: 0;
    right: 0;
    height: 300%;
    translate: 50%;
    max-width: unset;
  }
</style>