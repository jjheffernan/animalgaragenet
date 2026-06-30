<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import CollectionCard from '$lib/components/CollectionCard.svelte';
	import MediaGallery from '$lib/components/MediaGallery.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import { getFeaturedProducts } from '$lib/data/mock-products';
	import { mockCollections } from '$lib/data/mock-collections';
	import { mockMedia } from '$lib/data/mock-media';

	const featured = getFeaturedProducts(4);
</script>

<svelte:head>
	<title>Animal Garage — Garage Culture Delivered</title>
</svelte:head>

<Hero />

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal delay={100}>
		<SectionHeading title="Featured Collections" subtitle="Curated drops from the shop floor." />
	</AnimatedReveal>
	<div class="grid gap-6 lg:grid-cols-2">
		{#each mockCollections as collection (collection.id)}
			<AnimatedReveal delay={150 * mockCollections.indexOf(collection)}>
				<CollectionCard {collection} />
			</AnimatedReveal>
		{/each}
	</div>
</section>

<section class="border-y border-zinc-800 bg-zinc-900/50 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Top Picks" subtitle="Gear that moves fast." />
		</AnimatedReveal>
		<ProductGrid products={featured} />
		<div class="mt-10 text-center">
			<a
				href="/shop"
				class="inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				View all products →
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<div class="grid items-center gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<SectionHeading title="The Brand" subtitle="Born in the garage. Built for the culture." />
			<p class="text-zinc-400">
				Animal Garage is an automotive lifestyle brand — part shop, part studio, all attitude. We
				build cars, tell stories, and drop merch that carries the same raw energy as a burnout in
				an empty lot.
			</p>
			<a
				href="/about"
				class="mt-6 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				Read our story →
			</a>
		</AnimatedReveal>
		<AnimatedReveal delay={200}>
			<div class="overflow-hidden rounded-sm border border-zinc-800">
				<img
					src="https://picsum.photos/seed/agbrand/800/600"
					alt="Animal Garage shop floor"
					class="aspect-[4/3] w-full object-cover"
					loading="lazy"
				/>
			</div>
		</AnimatedReveal>
	</div>
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading
				title="From the Garage"
				subtitle="Builds, burnouts, and behind-the-scenes."
				align="center"
			/>
		</AnimatedReveal>
		<MediaGallery items={mockMedia} limit={3} />
		<div class="mt-10 text-center">
			<a
				href="/media"
				class="inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				Full media gallery →
			</a>
		</div>
	</div>
</section>
