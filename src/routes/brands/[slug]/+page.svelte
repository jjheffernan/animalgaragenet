<script lang="ts">
	import { resolve } from '$app/paths';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.brand.name} — Animal Garage</title>
</svelte:head>

<section class="relative border-b border-zinc-800 py-20">
	{#if data.brand.heroImage}
		<img src={data.brand.heroImage} alt="" class="absolute inset-0 h-full w-full object-cover opacity-30" />
	{/if}
	<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="mb-6 text-sm text-zinc-500">
			<a href={resolve('/brands')} class="hover:text-red-500">Brands</a>
			<span class="mx-2">/</span>
			<span class="text-zinc-300">{data.brand.name}</span>
		</nav>
		<div class="flex items-center gap-6">
			<img src={data.brand.logoUrl} alt={data.brand.name} class="h-20 w-20 rounded-full border-2 border-zinc-700 object-cover" />
			<div>
				<h1 class="font-display text-4xl font-bold uppercase text-white">{data.brand.name}</h1>
				<p class="mt-2 max-w-xl text-zinc-400">{data.brand.description}</p>
			</div>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h2 class="mb-8 font-display text-2xl font-bold uppercase text-white">Products</h2>
	</AnimatedReveal>
	<ProductGrid products={data.products} />
	<ListControls pagination={data.pagination} />
</section>
