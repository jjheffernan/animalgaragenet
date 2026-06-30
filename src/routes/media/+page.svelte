<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import MediaGallery from '$lib/components/content/MediaGallery.svelte';
	import UGCWall from '$lib/components/content/UGCWall.svelte';
	import VideoGrid from '$lib/components/video/VideoGrid.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import PaginatedListCanvas from '$lib/components/catalog/PaginatedListCanvas.svelte';
	import MediaFilterTabs from '$lib/components/content/MediaFilterTabs.svelte';
	import CatalogRibbonShell from '$lib/components/catalog/CatalogRibbonShell.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Media — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Media</h1>
		<p class="mt-2 text-zinc-400">
			Builds, events, and behind-the-scenes from the Animal Garage crew.
		</p>
	</div>
</section>

<div>
	<CatalogRibbonShell ariaLabel="Media filters">
		<MediaFilterTabs activeTab={data.tab} />
	</CatalogRibbonShell>

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		{#snippet mediaFilters()}
			<MediaFilterTabs activeTab={data.tab} />
		{/snippet}

		{#if data.tab === 'ugc'}
			<AnimatedReveal>
				<SectionHeading
					title="UGC Wall"
					subtitle="From the squad — tag @animalgarage"
					align="center"
				/>
			</AnimatedReveal>
			<PaginatedListCanvas pagination={data.pagination} filters={mediaFilters} class="mt-8">
				<UGCWall items={data.ugcItems} />
			</PaginatedListCanvas>
		{:else if data.tab === 'videos'}
			<AnimatedReveal>
				<SectionHeading title="Videos" subtitle="{data.pagination.total} videos" />
			</AnimatedReveal>
			<PaginatedListCanvas pagination={data.pagination} filters={mediaFilters} class="mt-8">
				<VideoGrid videos={data.videos} />
			</PaginatedListCanvas>
		{:else}
			<AnimatedReveal>
				<SectionHeading
					title={data.tab === 'photos' ? 'Photos' : 'Gallery'}
					subtitle="{data.pagination.total} items"
					align="center"
				/>
			</AnimatedReveal>
			<PaginatedListCanvas pagination={data.pagination} filters={mediaFilters}>
				<MediaGallery items={data.mediaItems} />
			</PaginatedListCanvas>
		{/if}
	</section>
</div>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-12">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<a
			href={resolve('/watch')}
			class="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>Full video hub →</a
		>
	</div>
</section>
