<script lang="ts">
	import { resolve } from '$app/paths';
	import PromoCodeForm from '$lib/components/commerce/PromoCodeForm.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const appliedCode = $derived(
		data.checkout?.voucherCodes?.[0] ?? data.mockPromo?.code ?? form?.mockPromo?.code ?? null
	);
	const appliedLabel = $derived(
		data.checkout?.discountName ?? data.mockPromo?.label ?? form?.mockPromo?.label ?? null
	);
</script>

<svelte:head>
	<title>Redeem Code — Animal Garage</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Redeem</h1>
<p class="mt-1 text-zinc-400">Apply voucher and gift card codes from Saleor to your cart.</p>

<PromoCodeForm
	appliedCode={form?.success
		? appliedCode
		: (data.mockPromo?.code ?? data.checkout?.voucherCodes?.[0] ?? null)}
	appliedLabel={form?.success
		? appliedLabel
		: (data.mockPromo?.label ?? data.checkout?.discountName ?? null)}
/>

{#if form?.error}
	<p class="mt-4 text-sm text-red-400">{form.error}</p>
{/if}
{#if form?.success && form.message}
	<p class="mt-4 text-sm text-emerald-400">{form.message}</p>
{/if}

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Cart</h2>
	{#if data.saleorEnabled}
		{#if data.checkout}
			<p class="mt-3 text-sm text-zinc-400">
				{data.checkout.lines.length} item{data.checkout.lines.length === 1 ? '' : 's'} in your Saleor
				checkout.
			</p>
			{#if data.checkout.discount && data.checkout.discount.amount > 0}
				<p class="mt-2 text-sm text-emerald-400">
					Discount: {locale.formatPrice(data.checkout.discount.amount)}
					{#if data.checkout.discountName}
						<span class="text-zinc-500">({data.checkout.discountName})</span>
					{/if}
				</p>
			{/if}
		{:else}
			<p class="mt-3 text-sm text-zinc-500">
				No active checkout yet — add items from the shop first.
			</p>
		{/if}
	{:else if data.mockPromo}
		<p class="mt-3 text-sm text-emerald-400">
			Mock code <span class="font-mono text-white">{data.mockPromo.code}</span> will apply at cart
			subtotal
			{#if data.mockPromo.percentOff > 0}
				({data.mockPromo.percentOff}% off)
			{/if}.
		</p>
	{:else}
		<p class="mt-3 text-sm text-zinc-500">
			Saleor is not connected — try mock codes:
			<span class="font-mono text-zinc-400">{data.mockCodesHint.join(', ')}</span>
		</p>
	{/if}
	<a href={resolve('/cart')} class="mt-4 inline-block text-sm text-red-500 hover:text-red-400"
		>View cart →</a
	>
</section>
