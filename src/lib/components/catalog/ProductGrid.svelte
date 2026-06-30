<script lang="ts">
	import type { Product } from '$lib/types/saleor';
	import type { ListView } from '$lib/pagination';
	import ProductCard from '$lib/components/catalog/ProductCard.svelte';

	interface Props {
		products: Product[];
		view?: ListView;
	}

	let { products, view = 'grid-lg' }: Props = $props();

	const gridClass = $derived(
		view === 'list'
			? 'flex flex-col gap-3'
			: view === 'grid-sm'
				? 'grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
				: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
	);
</script>

<div class={gridClass}>
	{#each products as product (product.id)}
		<ProductCard {product} {view} />
	{/each}
</div>
