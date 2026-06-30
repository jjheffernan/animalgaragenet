<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import OAuthButton from '$lib/components/OAuthButton.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let email = $state(form?.email ?? '');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Sign In — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Sign In</h1>
		<p class="mt-2 text-zinc-400">Magic link, Google, Discord, or Microsoft — Supabase-ready when keys are set.</p>

		{#if form?.error}
			<p class="mt-4 rounded-sm border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-400">{form.error}</p>
		{/if}

		{#if form?.success && form?.message}
			<p class="mt-4 rounded-sm border border-emerald-800 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">{form.message}</p>
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
			<input type="hidden" name="redirect" value={data.redirectTo} />

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
				{loading ? 'Sending…' : 'Send Magic Link'}
			</button>
		</form>

		{#if data.localDevAuthEnabled}
			<div class="mt-8 rounded-sm border border-dashed border-zinc-700 bg-zinc-900/40 p-4">
				<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Local dev quick login</p>
				<p class="mt-1 text-xs text-zinc-600">Localhost only — never enabled on production.</p>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each data.devAccounts as account (account.email)}
						<form method="POST" action="?/devSignIn" use:enhance>
							<input type="hidden" name="email" value={account.email} />
							<input type="hidden" name="redirect" value={data.redirectTo} />
							<button
								type="submit"
								class="rounded-sm border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white"
							>
								{account.label}
							</button>
						</form>
					{/each}
				</div>
			</div>
		{/if}

		<div class="relative my-8">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-zinc-800"></div>
			</div>
			<div class="relative flex justify-center text-xs uppercase tracking-widest">
				<span class="bg-zinc-950 px-3 text-zinc-500">or</span>
			</div>
		</div>

		<OAuthButton provider="google" redirectTo={data.redirectTo} disabled={loading} onloading={(v) => (loading = v)}>
			{#snippet children()}
				<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
			{/snippet}
		</OAuthButton>

		<div class="mt-3">
			<OAuthButton provider="discord" redirectTo={data.redirectTo} disabled={loading} onloading={(v) => (loading = v)} />
		</div>

		<div class="mt-3">
			<OAuthButton provider="azure" redirectTo={data.redirectTo} disabled={loading} onloading={(v) => (loading = v)}>
				{#snippet children()}
					<svg class="h-5 w-5 shrink-0" viewBox="0 0 23 23" aria-hidden="true">
						<path fill="#f35325" d="M1 1h10v10H1z" />
						<path fill="#81bc06" d="M12 1h10v10H12z" />
						<path fill="#05a6f0" d="M1 12h10v10H1z" />
						<path fill="#ffba08" d="M12 12h10v10H12z" />
					</svg>
				{/snippet}
			</OAuthButton>
		</div>

		<p class="mt-8 text-center text-sm text-zinc-500">
			No account?
			<a href={resolve('/auth/sign-up')} class="text-red-500 hover:text-red-400">Sign up</a>
		</p>
	</AnimatedReveal>
</section>
