<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import CartActions from '$lib/components/CartActions.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();

	onMount(() => {
		cart.init();
		if (data.saleorEnabled) {
			cart.hydrateCheckout(data.checkout);
		} else {
			cart.hydrateMockPromo(data.mockPromo);
		}
	});

	const cartProducts = $derived(
		cart.getCartProducts().map(({ item, product }) => {
			const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
			return { product, variant, quantity: item.quantity };
		})
	);

	const checkoutLines = $derived(cart.checkout?.lines ?? []);
	const useSaleorDisplay = $derived(cart.saleorEnabled && cart.checkout !== null);
	const isEmpty = $derived(useSaleorDisplay ? checkoutLines.length === 0 : cartProducts.length === 0);
	const subtotal = $derived(cart.subtotal);
	const upsells = $derived(cart.getUpsellSuggestions(4));

	function updateQty(productId: string, variantId: string, delta: number) {
		const line = cart.items.find((l) => l.productId === productId && l.variantId === variantId);
		if (!line) return;
		cart.updateQuantity(productId, variantId, line.quantity + delta);
	}
</script>

<svelte:head>
	<title>Cart — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Cart</h1>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 pb-72 sm:px-6 sm:pb-16 lg:px-8">
	<div class="grid gap-12 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-4">
			{#if isEmpty}
				<AnimatedReveal>
					<p class="text-zinc-400">Your cart is empty.</p>
				</AnimatedReveal>
			{:else if useSaleorDisplay}
				{#each checkoutLines as line (line.id)}
					<div class="flex gap-4 rounded-sm border border-zinc-800 bg-zinc-900 p-4">
						{#if line.thumbnail}
							<img src={line.thumbnail.url} alt={line.productName} class="h-24 w-24 rounded-sm object-cover" />
						{/if}
						<div class="flex flex-1 flex-col justify-between">
							<div>
								<a href={resolve(`/shop/${line.productSlug}`)} class="font-medium text-white hover:text-red-400">{line.productName}</a>
								<p class="text-sm text-zinc-500">{line.variantName}</p>
							</div>
							<div class="flex items-center gap-4">
								<span class="text-sm text-zinc-400">Qty {line.quantity}</span>
								<p class="ml-auto font-medium text-white">{locale.formatPrice(line.lineTotal.amount)}</p>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				{#each cartProducts as item (item.variant.id)}
					<div class="flex gap-4 rounded-sm border border-zinc-800 bg-zinc-900 p-4">
						{#if item.product.thumbnail}
							<img src={item.product.thumbnail.url} alt={item.product.name} class="h-24 w-24 rounded-sm object-cover" />
						{/if}
						<div class="flex flex-1 flex-col justify-between">
							<div>
								<a href={resolve(`/shop/${item.product.slug}`)} class="font-medium text-white hover:text-red-400">{item.product.name}</a>
								<p class="text-sm text-zinc-500">{item.variant.name}</p>
							</div>
							<div class="flex items-center gap-4">
								<div class="flex items-center gap-2">
									<button type="button" onclick={() => updateQty(item.product.id, item.variant.id, -1)} class="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white">−</button>
									<span class="w-8 text-center text-white">{item.quantity}</span>
									<button type="button" onclick={() => updateQty(item.product.id, item.variant.id, 1)} class="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white">+</button>
								</div>
								<p class="ml-auto font-medium text-white">{locale.formatPrice(item.variant.pricing.price.amount * item.quantity)}</p>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950 p-4 lg:static lg:z-auto lg:rounded-sm lg:border lg:border-zinc-800 lg:bg-zinc-900/50 lg:p-6 h-fit">
			<h2 class="font-display text-lg font-bold uppercase text-white">Order Summary</h2>
			<div class="mt-4 flex justify-between text-zinc-400">
				<span>Subtotal</span>
				<span class="text-white">{locale.formatPrice(subtotal)}</span>
			</div>
			{#if subtotal < 75}
				<p class="mt-2 text-xs text-zinc-500">Add {locale.formatPrice(75 - subtotal)} for free shipping</p>
			{:else}
				<p class="mt-2 text-xs text-green-400">You qualify for free standard shipping</p>
			{/if}
			<div class="mt-6">
				<CartActions empty={isEmpty} />
			</div>
		</div>
	</div>
</section>

{#if !useSaleorDisplay && upsells.length > 0}
	<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-8 font-display text-xl font-bold uppercase text-white">You Might Also Like</h2>
			<ProductGrid products={upsells} />
		</div>
	</section>
{/if}
