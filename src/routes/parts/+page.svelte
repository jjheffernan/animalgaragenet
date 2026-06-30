<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ListControls from '$lib/components/ListControls.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Parts — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Parts</h1>
		<p class="mt-2 text-zinc-400">Wheels, suspension, exhaust, and everything in between.</p>
		{#if data.filterLabel}
			<p class="mt-4 rounded-sm border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-400">
				Filtered by: <strong class="text-white">{data.filterLabel}</strong>
			</p>
		{/if}
	</div>
</section>

<div>
	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Categories" subtitle="Browse by system." />
		</AnimatedReveal>
		<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.categories as cat (cat.id)}
				<a href={resolve(`/parts/${cat.slug}`)} class="group overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50">
					{#if cat.imageUrl}
						<img src={cat.imageUrl} alt={cat.name} class="aspect-[16/9] w-full object-cover transition group-hover:scale-105" loading="lazy" />
					{/if}
					<div class="p-4">
						<h3 class="font-display font-bold uppercase tracking-wider text-white">{cat.name}</h3>
						{#if cat.description}
							<p class="mt-1 text-sm text-zinc-500">{cat.description}</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<div class="mt-16 border-t border-zinc-800 pt-16">
			<AnimatedReveal>
				<SectionHeading title="Popular Parts" subtitle="Crew-tested bolt-ons." />
			</AnimatedReveal>
			<ListControls pagination={data.pagination} view={data.view} placement="top" />
			<ProductGrid products={data.products} view={data.view} />
			<ListControls pagination={data.pagination} view={data.view} placement="bottom" />
		</div>
	</section>
</div>
