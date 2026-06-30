<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import PaginatedListCanvas from '$lib/components/catalog/PaginatedListCanvas.svelte';
	import CatalogRibbonShell from '$lib/components/catalog/CatalogRibbonShell.svelte';
	import CategoryPill from '$lib/components/catalog/CategoryPill.svelte';
	import type { ShopFilterOption } from '$lib/server/catalog/shop-filters';
	import { catalogRibbonNavClass } from '$lib/ui/catalog-ribbon';
	import { locale } from '$lib/stores/locale.svelte';
	import { resolvePath } from '$lib/utils/paths';

	let { data } = $props();

	function buildShopUrl(updates: { category?: string; collection?: string | null }) {
		const params = new URLSearchParams();
		const categorySlug =
			updates.category !== undefined
				? updates.category
				: data.category.slug === 'all'
					? ''
					: data.category.slug;
		const collectionSlug =
			updates.collection !== undefined ? (updates.collection ?? '') : (data.collection?.slug ?? '');

		if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
		if (collectionSlug) params.set('collection', collectionSlug);

		const query = params.toString();
		return resolve(query ? `/shop?${query}` : '/shop');
	}

	function categoryHref(cat: ShopFilterOption) {
		return buildShopUrl({ category: cat.slug === 'all' ? '' : cat.slug });
	}

	const collectionValue = $derived(data.collection?.slug ?? '');

	function onCollectionChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value;
		goto(resolvePath(buildShopUrl({ collection: value || null })), {
			keepFocus: true,
			noScroll: true
		});
	}

	const sectionTitle = $derived(
		data.collection
			? data.collection.label
			: data.category.slug === 'all'
				? 'All Products'
				: data.category.label
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
	<CatalogRibbonShell ariaLabel="Shop categories" syncHeightVar>
		<nav class="{catalogRibbonNavClass} items-center" aria-label="Shop categories">
			{#each data.categories as cat (cat.slug)}
				<CategoryPill
					href={categoryHref(cat)}
					label={cat.label}
					active={data.category.slug === cat.slug}
				/>
			{/each}
			{#if data.collections.length > 0}
				<div class="ms-2 shrink-0 border-l border-zinc-800 pl-2">
					<label class="flex items-center gap-2">
						<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
							>Collection</span
						>
						<select
							class="max-w-[12rem] truncate rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 focus:border-red-600 focus:outline-none {data.collection
								? 'border-red-600 text-white'
								: ''}"
							aria-label="Filter by collection"
							value={collectionValue}
							onchange={onCollectionChange}
						>
							<option value="">All collections</option>
							{#each data.collections as col (col.slug)}
								<option value={col.slug}>{col.label}</option>
							{/each}
						</select>
					</label>
				</div>
			{/if}
		</nav>
	</CatalogRibbonShell>

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title={sectionTitle} subtitle="{data.pagination.total} items" />
		</AnimatedReveal>
		<PaginatedListCanvas pagination={data.pagination} view={data.view} stickyTop="catalog">
			<ProductGrid products={data.products} view={data.view} />
		</PaginatedListCanvas>
	</section>
</div>
