<script lang="ts">
	import { locale } from '$lib/stores/locale.svelte';
	import type { Product } from '$lib/types/saleor';

	interface Props {
		product: Product;
		class?: string;
	}

	let { product, class: className = '' }: Props = $props();

	const price = $derived(product.pricing.priceRange.start.amount);
	const compareAt = $derived(product.compareAtPrice?.amount);
	const onSale = $derived(compareAt != null && compareAt > price);
</script>

<div class="flex flex-wrap items-baseline gap-2 {className}">
	<span class="text-sm font-medium text-white">{locale.formatPrice(price)}</span>
	{#if onSale && compareAt}
		<span class="text-xs text-zinc-500 line-through">{locale.formatPrice(compareAt)}</span>
	{/if}
</div>
