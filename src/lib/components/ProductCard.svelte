<script lang="ts">
	import type { Product } from '$lib/types/saleor';
	import { locale } from '$lib/stores/locale.svelte';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>

<a
	href="/shop/{product.slug}"
	class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50"
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
		<div
			class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
		></div>
	</div>
	<div class="p-4">
		{#if product.category}
			<p class="text-xs font-medium uppercase tracking-wider text-red-500">
				{product.category.name}
			</p>
		{/if}
		<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{product.name}</h3>
		<p class="mt-2 text-sm text-zinc-400">
			{locale.formatPrice(product.pricing.priceRange.start.amount)}
		</p>
	</div>
</a>
