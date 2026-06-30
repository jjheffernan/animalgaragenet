<script lang="ts">
	import type { Product } from '$lib/types/saleor';
	import ProductCard from '$lib/components/catalog/ProductCard.svelte';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';

	interface Props {
		products: Product[];
		title: string;
		subtitle?: string;
		viewAllHref?: string;
		viewAllLabel?: string;
		limit?: number;
		class?: string;
	}

	let {
		products,
		title,
		subtitle,
		viewAllHref,
		viewAllLabel = 'View all →',
		limit = 4,
		class: className = ''
	}: Props = $props();

	const items = $derived(products.slice(0, limit));
</script>

<section class={className}>
	<SectionHeading {title} {subtitle} />
	<div
		class="mt-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
	>
		{#each items as product (product.id)}
			<div
				class="w-[42vw] max-w-[11rem] shrink-0 sm:w-[28vw] sm:max-w-[12rem] lg:w-auto lg:max-w-none"
			>
				<ProductCard {product} view="grid-sm" />
			</div>
		{/each}
	</div>
	{#if viewAllHref}
		<div class="mt-6 text-center">
			<a
				href={viewAllHref}
				class="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400"
			>
				{viewAllLabel}
			</a>
		</div>
	{/if}
</section>
