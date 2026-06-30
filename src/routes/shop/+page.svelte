<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import CatalogRibbonShell from '$lib/components/catalog/CatalogRibbonShell.svelte';
	import CategoryPill from '$lib/components/catalog/CategoryPill.svelte';
	import type { ShopCollectionFilter } from '$lib/server/catalog/shop-collection';
	import type { ShopFilterOption } from '$lib/server/catalog/shop-filters';
	import { catalogRibbonNavClass } from '$lib/ui/catalog-ribbon';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();

	function categoryHref(cat: ShopFilterOption) {
		if (cat.slug === 'all') return resolve('/shop');
		return resolve(`/shop?category=${cat.slug}`);
	}

	function collectionHref(col: ShopCollectionFilter) {
		return resolve(`/shop?collection=${col.slug}`);
	}

	const sectionTitle = $derived(
		data.collection ? data.collection.label : data.category.slug === 'all' ? 'All Products' : data.category.label
	);
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
			Shipping regions: {locale.current.shippingRegions.join(', ')} · Prices in {locale.current
				.currency}
		</p>
	</div>
</section>

<div>
	<CatalogRibbonShell ariaLabel="Shop categories">
		<nav class={catalogRibbonNavClass} aria-label="Shop categories">
			{#each data.categories as cat (cat.slug)}
				<CategoryPill
					href={categoryHref(cat)}
					label={cat.label}
					active={data.category.slug === cat.slug}
				/>
			{/each}
		</nav>
	</CatalogRibbonShell>

	{#if data.collections.length > 0}
		<CatalogRibbonShell ariaLabel="Shop collections">
			<nav class={catalogRibbonNavClass} aria-label="Shop collections">
				{#each data.collections as col (col.slug)}
					<CategoryPill
						href={collectionHref(col)}
						label={col.label}
						active={data.collection?.slug === col.slug}
					/>
				{/each}
			</nav>
		</CatalogRibbonShell>
	{/if}

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title={sectionTitle} subtitle="{data.pagination.total} items" />
		</AnimatedReveal>
		<ListControls pagination={data.pagination} view={data.view} placement="top" />
		<ProductGrid products={data.products} view={data.view} />
		<ListControls pagination={data.pagination} view={data.view} placement="bottom" />
	</section>
</div>
