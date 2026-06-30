<script lang="ts">
	import { resolve } from '$app/paths';
	import { getStaffPickProducts } from '$lib/data/mock/products';
	import type { Product } from '$lib/types/saleor';
	import ProductCard from '$lib/components/catalog/ProductCard.svelte';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';

	interface Props {
		products?: Product[];
		limit?: number;
		class?: string;
	}

	let { products: productsProp, limit = 4, class: className = '' }: Props = $props();

	const products = $derived((productsProp ?? getStaffPickProducts()).slice(0, limit));
</script>

<section class={className}>
	<SectionHeading title="Staff Picks" subtitle="Hand-picked by the Animal Garage crew" />
	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
	<div class="mt-6 text-center">
		<a
			href={resolve('/shop?collection=staff-picks')}
			class="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400"
		>
			View All Staff Picks →
		</a>
	</div>
</section>
