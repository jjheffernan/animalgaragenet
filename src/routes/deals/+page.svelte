<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ListControls from '$lib/components/ListControls.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Pit Lane Deals — Animal Garage</title>
</svelte:head>

<section class="border-b border-red-900/50 bg-red-950/30 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Homie Hookup</p>
		<h1 class="mt-2 font-display text-4xl font-bold uppercase tracking-wider text-white">Pit Lane Deals</h1>
		<p class="mt-2 text-zinc-400">Curated savings — always something on sale.</p>
	</div>
</section>

{#if data.deals.length > 0}
	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.deals as deal (deal.id)}
				<div class="rounded-sm border border-red-900/50 bg-red-950/10 p-6">
					<span class="rounded-sm bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">{deal.discountLabel}</span>
					<h2 class="mt-3 font-display text-xl font-bold uppercase text-white">{deal.title}</h2>
					<p class="mt-2 text-zinc-400">{deal.description}</p>
					{#if deal.expiresAt}
						<p class="mt-2 text-xs text-zinc-500">Ends {new Date(deal.expiresAt).toLocaleDateString()}</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>
{/if}

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="On Sale Now" subtitle="{data.pagination.total} deals" />
	</AnimatedReveal>
	<ProductGrid products={data.products} />
	<ListControls pagination={data.pagination} />
</section>
