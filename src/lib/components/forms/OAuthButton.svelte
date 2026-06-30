<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { OAUTH_BUTTON_LABELS, type OAuthProvider } from '$lib/auth/oauth';

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
</script>

<form
	method="POST"
	action="?/oauth"
	use:enhance={() => {
		onloading?.(true);
		return async ({ result, update }) => {
			onloading?.(false);
			if (result.type === 'redirect') {
				goto(result.location);
				return;
			}
			await update();
		};
	}}
>
	<input type="hidden" name="provider" value={provider} />
	<input type="hidden" name="redirect" value={redirectTo} />
	<button
		type="submit"
		{disabled}
		class="flex w-full items-center justify-center gap-3 rounded-sm border border-zinc-700 py-4 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white disabled:opacity-50"
	>
		{#if children}
			{@render children()}
		{/if}
		{buttonLabel}
	</button>
</form>
