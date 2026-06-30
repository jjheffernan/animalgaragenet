<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import LocaleSelector from '$lib/components/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
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

<section class="sticky top-[73px] z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
	<div class="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
		<nav class="flex gap-1 py-3" aria-label="Shop categories">
			{#each data.categories as cat (cat)}
				<a
					href={categoryHref(cat)}
					class="shrink-0 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition {data.category === cat
						? 'bg-red-600 text-white'
						: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
				>
					{cat}
				</a>
			{/each}
		</nav>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading
			title={data.category === 'ALL' ? 'All Products' : data.category}
			subtitle="{data.products.length} items"
		/>
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each data.products as product (product.id)}
			<div class="relative">
				{#if !product.isAvailableForPurchase}
					<span class="absolute right-2 top-2 z-10 rounded-sm bg-zinc-950 px-2 py-1 text-xs font-bold uppercase text-white">Sold Out</span>
				{/if}
				<a
					href={resolve(`/shop/${product.slug}`)}
					class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50 {!product.isAvailableForPurchase ? 'opacity-75' : ''}"
				>
					<div class="relative aspect-square overflow-hidden bg-zinc-800">
						{#if product.thumbnail}
							<img src={product.thumbnail.url} alt={product.name} class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
						{/if}
					</div>
					<div class="p-4">
						{#if product.category}
							<p class="text-xs font-medium uppercase tracking-wider text-red-500">{product.category.name}</p>
						{/if}
						<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{product.name}</h3>
						<p class="mt-2 text-sm text-zinc-400">{locale.formatPrice(product.pricing.priceRange.start.amount)}</p>
					</div>
				</a>
			</div>
		{/each}
	</div>
</section>
