<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import PartCategoryNav from '$lib/components/navigation/PartCategoryNav.svelte';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

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
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">
			{data.category.name}
		</h1>
		{#if data.category.description}
			<p class="mt-2 max-w-2xl text-zinc-400">{data.category.description}</p>
		{/if}
		{#if data.filterLabel}
			<p
				class="mt-4 rounded-sm border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-400"
			>
				Filtered by: <strong class="text-white">{data.filterLabel}</strong>
			</p>
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
				<a
					href={resolve(`/parts/${child.slug}`)}
					class="rounded-sm border border-zinc-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-white"
				>
					{child.name}
				</a>
			{/each}
		</div>
	</section>
{/if}

<div>
	<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
		<div class="grid gap-12 lg:grid-cols-4">
			<aside class="lg:col-span-1 lg:self-start">
				<div
					class="lg:sticky lg:top-[calc(var(--site-header-height,4.5rem)+var(--parts-ribbon-height,0px))] lg:z-30 lg:max-h-[calc(100vh-var(--site-header-height,4.5rem)-var(--parts-ribbon-height,0px))] lg:overflow-y-auto lg:rounded-sm lg:border lg:border-zinc-800 lg:bg-zinc-950/95 lg:p-4 lg:backdrop-blur"
				>
					<h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Browse</h2>
					<PartCategoryNav activeSlug={data.category.slug} />
				</div>
			</aside>
			<div class="lg:col-span-3">
				<AnimatedReveal>
					<SectionHeading title="Products" subtitle="{data.pagination.total} items" />
				</AnimatedReveal>
				<ListControls pagination={data.pagination} view={data.view} placement="top" />
				<ProductGrid products={data.products} view={data.view} />
				<ListControls pagination={data.pagination} view={data.view} placement="bottom" />
			</div>
		</div>
	</section>
</div>
