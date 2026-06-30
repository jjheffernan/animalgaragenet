<script lang="ts">
	import { resolve } from '$app/paths';
	import Hero from '$lib/components/Hero.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import CollectionCard from '$lib/components/CollectionCard.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import VehicleSelector from '$lib/components/VehicleSelector.svelte';
	import ModelPicker from '$lib/components/ModelPicker.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import UGCWall from '$lib/components/UGCWall.svelte';
	import TrustBlocks from '$lib/components/TrustBlocks.svelte';
	import ManifestoBlock from '$lib/components/ManifestoBlock.svelte';
	import CountdownTimer from '$lib/components/CountdownTimer.svelte';
	import BuildCard from '$lib/components/BuildCard.svelte';
	import GuideCard from '$lib/components/GuideCard.svelte';
	import BrandCard from '$lib/components/BrandCard.svelte';
	import ClearanceSection from '$lib/components/ClearanceSection.svelte';
	import StaffPicks from '$lib/components/StaffPicks.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Animal Garage — Garage Culture Delivered</title>
</svelte:head>

<Hero />

<section class="border-b border-zinc-800 bg-zinc-900/50 py-12">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Find Parts for Your Ride" subtitle="Year, make, model — shop what fits." />
		</AnimatedReveal>
		<div class="mt-6">
			<VehicleSelector />
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Shop by Model" subtitle="Popular platforms, ready to mod." />
	</AnimatedReveal>
	<ModelPicker models={data.popularModels} class="mt-6" />
</section>

{#if data.activeCampaign?.availableFrom}
	<section class="border-y border-red-900/50 bg-red-950/30 py-10">
		<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
			<AnimatedReveal>
				<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Drop Incoming</p>
				<h2 class="mt-2 font-display text-3xl font-bold uppercase text-white">
					{data.activeCampaign.name}
				</h2>
				<p class="mt-2 text-zinc-400">{data.activeCampaign.description}</p>
				<CountdownTimer endDate={data.activeCampaign.availableFrom} class="mt-6" />
			</AnimatedReveal>
		</div>
	</section>
{/if}

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal delay={100}>
		<SectionHeading title="Featured Collections" subtitle="Curated drops from the shop floor." />
	</AnimatedReveal>
	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		{#each data.collections as collection, i (collection.id)}
			<AnimatedReveal delay={150 * i}>
				<CollectionCard {collection} />
			</AnimatedReveal>
		{/each}
	</div>
</section>

<section class="border-y border-zinc-800 bg-zinc-900/50 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<StaffPicks />
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<ClearanceSection />
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading
				title="Featured Videos"
				subtitle="Builds, burnouts, and shop chaos."
				align="center"
			/>
		</AnimatedReveal>
		<VideoGrid videos={data.videos} class="mt-6" />
		<div class="mt-10 text-center">
			<a
				href={resolve('/watch')}
				class="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				Watch all →
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<UGCWall items={data.ugc} />
</section>

<section class="border-y border-zinc-800 bg-zinc-900/50 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Build Threads" subtitle="Real cars, real mods, real stories." />
		</AnimatedReveal>
		<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.builds as build (build.id)}
				<BuildCard {build} />
			{/each}
		</div>
		<div class="mt-10 text-center">
			<a
				href={resolve('/builds')}
				class="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				All builds →
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<TrustBlocks />
</section>

<ManifestoBlock />

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Guides" subtitle="Learn before you wrench." />
	</AnimatedReveal>
	<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.guides as guide (guide.id)}
			<GuideCard {guide} />
		{/each}
	</div>
</section>

<section class="border-y border-zinc-800 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Brand Lanes" subtitle="Shop by the brands we trust." />
		</AnimatedReveal>
		<div class="mt-6 flex flex-wrap gap-6">
			{#each data.brands as brand (brand.id)}
				<BrandCard {brand} />
			{/each}
		</div>
	</div>
</section>
