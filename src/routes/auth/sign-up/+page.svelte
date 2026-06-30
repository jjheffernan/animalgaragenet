<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let email = $state(form?.email ?? '');
	let name = $state(form?.name ?? '');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Sign Up — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Create Account</h1>
		<p class="mt-2 text-zinc-400">Join Garage Squad. Earn XP. Save your builds.</p>

		{#if form?.error}
			<p class="mt-4 rounded-sm border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-400">{form.error}</p>
		{/if}

		<form
			method="POST"
			class="mt-8 space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</span>
				<input
					type="text"
					name="name"
					bind:value={name}
					required
					autocomplete="name"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
					placeholder="Your name"
				/>
			</label>

			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</span>
				<input
					type="email"
					name="email"
					bind:value={email}
					required
					autocomplete="email"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
					placeholder="you@example.com"
				/>
			</label>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-sm bg-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
			>
				{loading ? 'Creating…' : 'Create Account'}
			</button>
		</form>

		<p class="mt-8 text-center text-sm text-zinc-500">
			Already have an account?
			<a href={resolve('/auth/sign-in')} class="text-red-500 hover:text-red-400">Sign in</a>
		</p>
	</AnimatedReveal>
</section>
