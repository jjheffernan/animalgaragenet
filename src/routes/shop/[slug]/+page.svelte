<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { locale } from '$lib/stores/locale.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import VariantSelector from '$lib/components/catalog/VariantSelector.svelte';
	import NotifyMeButton from '$lib/components/catalog/NotifyMeButton.svelte';
	import TrustBlocks from '$lib/components/marketing/TrustBlocks.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { recentlyViewed } from '$lib/stores/recently-viewed.svelte';
	import { getAllCatalogProducts } from '$lib/data/mock/parts';

	let { data } = $props();
	const product = $derived(data.product);
	const soldOut = $derived(!product.isAvailableForPurchase);

	let selectedVariantId = $state('');
	$effect(() => {
		selectedVariantId = product.variants[0]?.id ?? '';
	});

	const catalog = getAllCatalogProducts();
	let recentProducts = $state<typeof catalog>([]);

	onMount(() => {
		cart.init();
		recentlyViewed.init();
		recentlyViewed.add(product.id);
		if (!browser) return;
		recentProducts = recentlyViewed.productIds
			.filter((id) => id !== product.id)
			.map((id) => catalog.find((p) => p.id === id))
			.filter((p): p is (typeof catalog)[number] => p !== undefined)
			.slice(0, 4);
	});

	function addToCart() {
		if (soldOut || !selectedVariantId) return;
		cart.addItem(product.id, selectedVariantId);
		cart.openDrawer();
	}

	let selectedImage = $state(0);
	const images = $derived(product.media.length > 0 ? product.media : product.thumbnail ? [product.thumbnail] : []);
</script>

<svelte:head>
	<title>{product.name} — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<nav class="mb-8 text-sm text-zinc-500">
		<a href={resolve('/shop')} class="hover:text-red-500">Shop</a>
		{#if product.category}
			<span class="mx-2">/</span>
			<a href={resolve(`/shop?category=${product.category.slug}`)} class="hover:text-red-500">{product.category.name}</a>
		{/if}
		<span class="mx-2">/</span>
		<span class="text-zinc-300">{product.name}</span>
	</nav>

	<div class="grid gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<div class="grid gap-4">
				<div class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
					{#if images[selectedImage]}
						<img src={images[selectedImage].url} alt={images[selectedImage].alt} class="aspect-square w-full object-cover" />
					{/if}
				</div>
				{#if images.length > 1}
					<div class="grid grid-cols-4 gap-2">
						{#each images as img, i (img.id)}
							<button type="button" onclick={() => (selectedImage = i)} class="overflow-hidden rounded-sm border {selectedImage === i ? 'border-red-600' : 'border-zinc-800'}">
								<img src={img.url} alt={img.alt} class="aspect-square w-full object-cover" loading="lazy" />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			{#if product.category}
				<p class="text-xs font-bold uppercase tracking-widest text-red-500">{product.category.name}</p>
			{/if}
			<h1 class="mt-2 font-display text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">{product.name}</h1>
			<p class="mt-4 text-2xl font-medium text-white">{locale.formatPrice(product.pricing.priceRange.start.amount)}</p>
			{#if soldOut}
				<span class="mt-2 inline-block rounded-sm bg-zinc-950 px-3 py-1 text-xs font-bold uppercase text-white">Sold Out</span>
			{/if}

			<div class="mt-6 flex items-center gap-4">
				<LocaleSelector />
			</div>

			<VariantSelector
				{product}
				selectedVariantId={selectedVariantId}
				onselect={(id) => (selectedVariantId = id)}
				class="mt-6"
			/>

			<p class="mt-6 leading-relaxed text-zinc-400">{product.description}</p>

			{#if soldOut}
				<div class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
					<p class="text-sm font-bold uppercase tracking-widest text-zinc-300">Notify Me When Available</p>
					<NotifyMeButton productName={product.name} class="mt-3" />
				</div>
			{:else}
				<button
					type="button"
					onclick={addToCart}
					class="mt-8 w-full rounded-sm bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 sm:w-auto"
				>
					Add to Cart
				</button>
			{/if}

			<TrustBlocks class="mt-10" />
		</AnimatedReveal>
	</div>
</section>

{#if data.linkedBuild}
	<section class="border-t border-zinc-800 bg-zinc-900/30 py-12">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="font-display text-xl font-bold uppercase text-white">Shop This Build</h2>
			<a href={resolve(`/builds/${data.linkedBuild.slug}`)} class="mt-4 flex items-center gap-4 rounded-sm border border-zinc-800 bg-zinc-900 p-4 transition hover:border-red-600/50">
				<img src={data.linkedBuild.photos[0]} alt={data.linkedBuild.title} class="h-20 w-32 rounded-sm object-cover" />
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">{data.linkedBuild.year} {data.linkedBuild.make} {data.linkedBuild.model}</p>
					<p class="font-bold text-white">{data.linkedBuild.title}</p>
				</div>
			</a>
		</div>
	</section>
{/if}

{#if recentProducts.length > 0}
	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<h2 class="mb-6 font-display text-xl font-bold uppercase text-white">Recently Viewed</h2>
		<ProductGrid products={recentProducts} />
	</section>
{/if}

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
	<h2 class="mb-6 font-display text-xl font-bold uppercase text-white">You May Also Like</h2>
	<ProductGrid products={data.related} />
</section>
