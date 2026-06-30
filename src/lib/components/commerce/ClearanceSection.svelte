<script lang="ts">
	import { getClearanceProducts } from '$lib/data/mock/products';
	import type { Product } from '$lib/types/saleor';
	import MiniProductRow from '$lib/components/catalog/MiniProductRow.svelte';

	interface Props {
		products?: Product[];
		limit?: number;
		class?: string;
	}

	let { products: productsProp, limit = 4, class: className = '' }: Props = $props();

	const products = $derived(productsProp ?? getClearanceProducts());
</script>

<MiniProductRow
	{products}
	title="Clearance Pit"
	subtitle="Last-chance deals — no restocks"
	viewAllHref="/shop?collection=clearance"
	viewAllLabel="Shop All Clearance →"
	{limit}
	class={className}
/>
