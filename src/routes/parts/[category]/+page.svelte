<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.category.name} Parts — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="mb-4 text-sm text-zinc-500">
			<a href={resolve('/parts')} class="hover:text-red-500">Parts</a>
			<span class="mx-2">/</span>
			<span class="text-zinc-300">{data.category.name}</span>
		</nav>
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">{data.category.name}</h1>
		{#if data.category.description}
			<p class="mt-2 max-w-2xl text-zinc-400">{data.category.description}</p>
		{/if}
	</div>
</section>

{#if data.category.children && data.category.children.length > 0}
	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Subcategories" />
		</AnimatedReveal>
		<div class="flex flex-wrap gap-3">
			{#each data.category.children as child (child.id)}
				<a href={resolve(`/parts/${child.slug}`)} class="rounded-sm border border-zinc-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-white">
					{child.name}
				</a>
			{/each}
		</div>
	</section>
{/if}

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Products" subtitle="{data.products.length} items" />
	</AnimatedReveal>
	<ProductGrid products={data.products} />
</section>
