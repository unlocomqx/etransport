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
</script>

<div class='navbar bg-base-100'>
	<div class='flex-none'>
		<button class='btn btn-square btn-ghost'>
			<svg class='inline-block w-5 h-5 stroke-current' fill='none' viewBox='0 0 24 24'
					 xmlns='http://www.w3.org/2000/svg'>
				<path d='M4 6h16M4 12h16M4 18h16' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'></path>
			</svg>
		</button>
	</div>
	<div class='flex-1'>
		<a class='btn btn-ghost normal-case text-xl' href='/'>eTransport</a>
	</div>
	{#if !session}
		<div>
			<a class='btn' href='/login'>
				<Icon class='text-2xl' icon='solar:login-3-bold' />
				<span>Login</span>
			</a>
		</div>
	{/if}
	{#if session}
		<div class='dropdown dropdown-end'>
			<button class='btn btn-ghost btn-circle avatar'>
				<img src='{session.user.user_metadata.avatar_url}' alt='Avatar' class='rounded-full' />
			</button>
			<ul id='actions'
					class='mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52'>
				<li>
					<form action='/?/logout' method='post'>
						<button class='btn' type='submit'>Logout</button>
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

{#if loaded}
	<span class='hidden' data-cy='loaded'></span>
{/if}