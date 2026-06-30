<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Product } from '$lib/types/saleor';
	import { cart } from '$lib/stores/cart.svelte';
	import PriceDisplay from './PriceDisplay.svelte';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();

	const soldOut = $derived(!product.isAvailableForPurchase || product.availableQuantity === 0);

	function handleQuickAdd(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!soldOut) {
			cart.addItem(product.id);
			cart.openDrawer();
		}
	}
</script>

<a
	href={resolve(`/shop/${product.slug}`)}
	class="group relative block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50"
>
	<div class="relative aspect-square overflow-hidden bg-zinc-800">
		{#if product.thumbnail}
			<img
				src={product.thumbnail.url}
				alt={product.thumbnail.alt}
				class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		{/if}
		{#if soldOut}
			<span class="absolute left-2 top-2 rounded-sm bg-zinc-950 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
				Sold Out
			</span>
		{/if}
		{#if product.tags?.includes('staff-pick')}
			<span class="absolute right-2 top-2 rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
				Staff Pick
			</span>
		{/if}
		{#if product.tags?.includes('clearance')}
			<span class="absolute right-2 top-10 rounded-sm bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
				Clearance
			</span>
		{/if}
		<div
			class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
		></div>
		{#if !soldOut}
			<button
				type="button"
				class="absolute bottom-3 right-3 rounded-sm bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
				onclick={handleQuickAdd}
			>
				Quick Add
			</button>
		{/if}
	</div>
	<div class="p-4">
		{#if product.brand}
			<p class="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{product.brand.name}</p>
		{:else if product.category}
			<p class="text-xs font-medium uppercase tracking-wider text-red-500">{product.category.name}</p>
		{/if}
		<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{product.name}</h3>
		<div class="mt-2">
			<PriceDisplay {product} />
		</div>
	</div>
</a>
