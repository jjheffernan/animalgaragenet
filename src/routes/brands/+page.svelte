<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import ListControls from '$lib/components/ListControls.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Brands — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Brands</h1>
		<p class="mt-2 text-zinc-400">Shop the brands we trust and run in our own builds.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Brands" />
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.brands as brand (brand.id)}
			<a href={resolve(`/brands/${brand.slug}`)} class="group flex flex-col overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50">
				{#if brand.heroImage}
					<img src={brand.heroImage} alt={brand.name} class="aspect-[16/7] w-full object-cover" loading="lazy" />
				{/if}
				<div class="flex flex-1 items-start gap-4 p-6">
					<img src={brand.logoUrl} alt={brand.name} class="h-14 w-14 rounded-full border border-zinc-700 object-cover" loading="lazy" />
					<div>
						<h3 class="font-display font-bold uppercase tracking-wider text-white">{brand.name}</h3>
						<p class="mt-1 text-sm text-zinc-500">{brand.description}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
	<ListControls pagination={data.pagination} />
</section>
