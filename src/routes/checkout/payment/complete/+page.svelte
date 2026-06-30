<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const message = $derived.by(() => {
		switch (data.status) {
			case 'disabled':
				return 'Checkout payment is unavailable — Saleor is not configured.';
			case 'no_transaction':
				return 'No active payment session. Return to checkout and try again.';
			case 'no_checkout':
				return 'Checkout session expired. Return to cart and start again.';
			case 'process_failed':
				return data.error ?? 'Payment could not be confirmed.';
			case 'complete_failed':
				return data.error ?? 'Order could not be created.';
			default:
				return 'Completing your order…';
		}
	});
</script>

<svelte:head>
	<title>Completing order — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
	<h1 class="font-display text-2xl font-bold uppercase text-white">Payment</h1>
	<p class="mt-4 text-sm text-zinc-400" role="status">{message}</p>
	{#if data.status !== 'success'}
		<a
			href={resolve('/checkout')}
			class="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
		>
			← Back to checkout
		</a>
	{/if}
</section>
