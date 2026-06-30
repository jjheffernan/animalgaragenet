<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { getAllCatalogProducts } from '$lib/data/mock-parts';
	import { locale } from '$lib/stores/locale.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';

	// TODO: import cart from '$lib/stores/cart.svelte.ts'
	interface CartLine {
		productId: string;
		variantId: string;
		quantity: number;
	}

	let lines = $state<CartLine[]>([]);

	onMount(() => {
		if (!browser) return;
		lines = JSON.parse(localStorage.getItem('ag-cart') || '[]');
	});

	const cartProducts = $derived(
		lines
			.map((line) => {
				const product = getAllCatalogProducts().find((p) => p.id === line.productId);
				const variant = product?.variants.find((v) => v.id === line.variantId);
				return product && variant ? { product, variant, quantity: line.quantity } : null;
			})
			.filter((item): item is NonNullable<typeof item> => item !== null)
	);

	const subtotal = $derived(
		cartProducts.reduce((sum, item) => sum + item.variant.pricing.price.amount * item.quantity, 0)
	);

	const upsells = $derived(
		getAllCatalogProducts()
			.filter((p) => !lines.some((l) => l.productId === p.id))
			.slice(0, 4)
	);

	function updateQty(variantId: string, delta: number) {
		if (!browser) return;
		const updated = lines.map((l) =>
			l.variantId === variantId ? { ...l, quantity: Math.max(0, l.quantity + delta) } : l
		).filter((l) => l.quantity > 0);
		lines = updated;
		localStorage.setItem('ag-cart', JSON.stringify(updated));
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

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	{#if cartProducts.length === 0}
		<AnimatedReveal>
			<p class="text-zinc-400">Your cart is empty.</p>
			<a href={resolve('/shop')} class="mt-6 inline-block rounded-sm bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500">
				Shop Now
			</a>
		</AnimatedReveal>
	{:else}
		<div class="grid gap-12 lg:grid-cols-3">
			<div class="lg:col-span-2 space-y-4">
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
									<button type="button" onclick={() => updateQty(item.variant.id, -1)} class="h-8 w-8 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white">−</button>
									<span class="w-8 text-center text-white">{item.quantity}</span>
									<button type="button" onclick={() => updateQty(item.variant.id, 1)} class="h-8 w-8 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white">+</button>
								</div>
								<p class="ml-auto font-medium text-white">{locale.formatPrice(item.variant.pricing.price.amount * item.quantity)}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6 h-fit">
				<h2 class="font-display text-lg font-bold uppercase text-white">Order Summary</h2>
				<div class="mt-4 flex justify-between text-zinc-400">
					<span>Subtotal</span>
					<span class="text-white">{locale.formatPrice(subtotal)}</span>
				</div>
				<a href={resolve('/checkout')} class="mt-6 block w-full rounded-sm bg-red-600 py-4 text-center text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500">
					Checkout
				</a>
			</div>
		</div>
	{/if}
</section>

{#if upsells.length > 0}
	<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-8 font-display text-xl font-bold uppercase text-white">You Might Also Like</h2>
			<ProductGrid products={upsells} />
		</div>
	</section>
{/if}
