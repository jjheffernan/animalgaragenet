<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import LocaleSelector from '$lib/components/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();
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

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Products" subtitle="Placeholder catalog — Saleor integration pending." />
	</AnimatedReveal>
	<ProductGrid products={data.products} />
</section>
