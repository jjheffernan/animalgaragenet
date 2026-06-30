<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { mockCallbackQuery, OAUTH_BUTTON_LABELS, type OAuthProvider } from '$lib/auth/oauth';
	import { signInWithOAuth } from '$lib/supabase/auth-client';

	let {
		provider,
		redirectTo = '/account',
		disabled = false,
		label,
		onloading,
		children
	}: {
		provider: OAuthProvider;
		redirectTo?: string;
		disabled?: boolean;
		label?: string;
		onloading?: (loading: boolean) => void;
		children?: Snippet;
	} = $props();

	const buttonLabel = $derived(label ?? OAUTH_BUTTON_LABELS[provider]);

	function mockFallbackUrl(): string {
		return `${resolve('/auth/callback')}?${mockCallbackQuery(provider, redirectTo)}`;
	}

	async function signIn() {
		onloading?.(true);
		try {
			const result = await signInWithOAuth(provider, redirectTo);
			if (!result.ok) return;
			window.location.href = result.url ?? mockFallbackUrl();
		} finally {
			onloading?.(false);
		}
	}
</script>

<button
	type="button"
	{disabled}
	onclick={signIn}
	class="flex w-full items-center justify-center gap-3 rounded-sm border border-zinc-700 py-4 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white disabled:opacity-50"
>
	{#if children}
		{@render children()}
	{/if}
	{buttonLabel}
</button>
