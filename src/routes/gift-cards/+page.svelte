<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Gift Cards — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Gift Cards</h1>
		<p class="mt-2 text-zinc-400">Digital gift cards — $25 to $200. Delivered by email.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Choose Amount" subtitle="Never expires. Redeem on merch and parts." />
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each data.giftCards as card (card.id)}
			<a href={resolve(`/shop/${card.slug}`)} class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50">
				{#if card.thumbnail}
					<img src={card.thumbnail.url} alt={card.name} class="aspect-square w-full object-cover" loading="lazy" />
				{/if}
				<div class="p-4 text-center">
					<h3 class="font-display text-2xl font-bold text-white">{locale.formatPrice(card.pricing.priceRange.start.amount)}</h3>
					<p class="mt-1 text-sm text-zinc-500">Digital delivery</p>
				</div>
			</a>
		{/each}
	</div>
	<ListControls pagination={data.pagination} />
</section>
