<script lang="ts">
	import { enhance } from '$app/forms';

	import type { CheckoutDisplay, MockPromoState } from '$lib/types/checkout';
	import { locale } from '$lib/stores/locale.svelte';

	let {
		action = '?/apply',
		initialCode = '',
		appliedCode = null,
		appliedLabel = null,
		compact = false,
		onapplied
	}: {
		action?: string;
		initialCode?: string;
		appliedCode?: string | null;
		appliedLabel?: string | null;
		compact?: boolean;
		onapplied?: (detail: {
			message: string;
			checkout?: CheckoutDisplay | null;
			mockPromo?: MockPromoState | null;
		}) => void;
	} = $props();

	let code = $state(initialCode);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let useFetch = $derived(Boolean(onapplied));

	async function applyViaFetch(event: SubmitEvent) {
		event.preventDefault();
		if (!onapplied) return;

		loading = true;
		error = null;
		success = null;

		try {
			const response = await fetch(`/cart/checkout/promo?locale=${encodeURIComponent(locale.code)}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code })
			});
			const data = (await response.json()) as {
				message?: string;
				error?: string;
				checkout?: CheckoutDisplay | null;
				mockPromo?: MockPromoState | null;
			};
			if (!response.ok) {
				error = data.error ?? 'Could not apply code.';
				return;
			}
			success = data.message ?? 'Code applied.';
			onapplied({
				message: success,
				checkout: data.checkout ?? null,
				mockPromo: data.mockPromo ?? null
			});
		} catch {
			error = 'Could not apply code.';
		} finally {
			loading = false;
		}
	}
</script>

<div class={compact ? '' : 'rounded-sm border border-zinc-800 bg-zinc-900/50 p-6'}>
	{#if !compact}
		<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Redeem code</h2>
		<p class="mt-1 text-sm text-zinc-500">
			Enter a voucher or gift card code from Saleor. Codes apply to your active cart.
		</p>
	{/if}

	{#if appliedCode}
		<p class="mt-3 text-sm text-emerald-400">
			Active: <span class="font-mono text-white">{appliedCode}</span>
			{#if appliedLabel}
				<span class="text-zinc-500">— {appliedLabel}</span>
			{/if}
		</p>
	{/if}

	{#if error}
		<p class="mt-3 text-sm text-red-400">{error}</p>
	{/if}
	{#if success}
		<p class="mt-3 text-sm text-emerald-400">{success}</p>
	{/if}

	{#if useFetch}
		<form class="mt-4 flex flex-wrap gap-2" onsubmit={applyViaFetch}>
			<label class="sr-only" for="promo-code-fetch">Promo code</label>
			<input
				id="promo-code-fetch"
				type="text"
				bind:value={code}
				placeholder="Enter code"
				autocomplete="off"
				class="min-w-[10rem] flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm uppercase text-white placeholder:normal-case placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
			/>
			<button
				type="submit"
				disabled={loading || !code.trim()}
				class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
			>
				{loading ? 'Applying…' : 'Apply'}
			</button>
		</form>
	{:else}
		<form
			method="POST"
			{action}
			class="mt-4 flex flex-wrap gap-2"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					loading = false;
					if (result.type === 'failure') {
						error = String(result.data?.error ?? 'Could not apply code.');
						success = null;
					} else if (result.type === 'success') {
						error = null;
						success = String(result.data?.message ?? 'Code applied.');
						code = '';
					}
					await update();
				};
			}}
		>
			<label class="sr-only" for="promo-code-form">Promo code</label>
			<input
				id="promo-code-form"
				type="text"
				name="code"
				bind:value={code}
				placeholder="Enter code"
				autocomplete="off"
				class="min-w-[10rem] flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm uppercase text-white placeholder:normal-case placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
			/>
			<button
				type="submit"
				disabled={loading || !code.trim()}
				class="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
			>
				{loading ? 'Applying…' : 'Apply'}
			</button>
		</form>
	{/if}
</div>
