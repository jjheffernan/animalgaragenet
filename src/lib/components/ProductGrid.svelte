<script lang="ts">
	import type { Product } from '$lib/types/saleor';
	import ProductCard from './ProductCard.svelte';

	interface Props {
		products: Product[];
	}

	let { products }: Props = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
	{#each products as product (product.id)}
		<ProductCard {product} />
	{/each}
</div>
