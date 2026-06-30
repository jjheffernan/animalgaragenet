<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import LocaleSelector from '$lib/components/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ListControls from '$lib/components/ListControls.svelte';
	import CatalogRibbonShell from '$lib/components/CatalogRibbonShell.svelte';
	import CategoryPill from '$lib/components/CategoryPill.svelte';
	import { catalogRibbonNavClass } from '$lib/ui/catalog-ribbon';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();

	function categoryHref(cat: string) {
		if (cat === 'ALL') return resolve('/shop');
		return resolve(`/shop?category=${cat}`);
	}
</script>

<svelte:head>
	<title>Shop — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Shop</h1>
				<p class="mt-2 text-zinc-400">Official Animal Garage merch — ships worldwide.</p>
			</div>
			<LocaleSelector />
		</div>
		<p class="mt-4 text-xs text-zinc-600">
			Shipping regions: {locale.current.shippingRegions.join(', ')} · Prices in {locale.current.currency}
		</p>
	</div>
</section>

<div>
	<CatalogRibbonShell ariaLabel="Shop categories">
		<nav class={catalogRibbonNavClass} aria-label="Shop categories">
			{#each data.categories as cat (cat)}
				<CategoryPill
					href={categoryHref(cat)}
					label={cat}
					active={data.category === cat}
				/>
			{/each}
		</nav>
	</CatalogRibbonShell>

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading
			title={data.category === 'ALL' ? 'All Products' : data.category}
			subtitle="{data.pagination.total} items"
		/>
	</AnimatedReveal>
	<ListControls pagination={data.pagination} view={data.view} placement="top" />
	<ProductGrid products={data.products} view={data.view} />
	<ListControls pagination={data.pagination} view={data.view} placement="bottom" />
	</section>
</div>
