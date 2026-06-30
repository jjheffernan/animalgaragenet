<script lang="ts">
	import { getStaffPickProducts } from '$lib/data/mock/products';
	import type { Product } from '$lib/types/saleor';
	import MiniProductRow from '$lib/components/catalog/MiniProductRow.svelte';

	interface Props {
		products?: Product[];
		limit?: number;
		class?: string;
	}

	let { products: productsProp, limit = 4, class: className = '' }: Props = $props();

	const products = $derived(productsProp ?? getStaffPickProducts());
</script>

<MiniProductRow
	{products}
	title="Staff Picks"
	subtitle="Hand-picked by the Animal Garage crew"
	viewAllHref="/shop?collection=staff-picks"
	viewAllLabel="View All Staff Picks →"
	{limit}
	class={className}
/>
