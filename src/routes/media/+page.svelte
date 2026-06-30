<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import MediaGallery from '$lib/components/content/MediaGallery.svelte';
	import UGCWall from '$lib/components/content/UGCWall.svelte';
	import VideoGrid from '$lib/components/video/VideoGrid.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';
	import { buildPaginationUrl } from '$lib/pagination';
	import { resolvePath } from '$lib/utils/paths';

	const tabs = [
		{ label: 'All', value: 'all' },
		{ label: 'Videos', value: 'videos' },
		{ label: 'Photos', value: 'photos' },
		{ label: 'UGC', value: 'ugc' }
	] as const;

	let { data } = $props();

	function tabHref(tab: string) {
		return resolvePath(buildPaginationUrl(page.url.pathname, page.url.searchParams, { tab }));
	}
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
	<section
		class="sticky top-[var(--site-header-height,4.5rem)] z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<nav class="flex gap-1 py-3" aria-label="Media filters">
				{#each tabs as tab (tab.value)}
					<a
						href={tabHref(tab.value)}
						class="rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition {data.tab ===
						tab.value
							? 'bg-red-600 text-white'
							: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
					>
						{tab.label}
					</a>
				{/each}
			</nav>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		{#if data.tab === 'ugc'}
			<AnimatedReveal>
				<SectionHeading
					title="UGC Wall"
					subtitle="From the squad — tag @animalgarage"
					align="center"
				/>
			</AnimatedReveal>
			<UGCWall items={data.ugcItems} class="mt-8" />
		{:else if data.tab === 'videos'}
			<AnimatedReveal>
				<SectionHeading title="Videos" subtitle="{data.pagination.total} videos" />
			</AnimatedReveal>
			<VideoGrid videos={data.videos} class="mt-8" />
		{:else}
			<AnimatedReveal>
				<SectionHeading
					title={data.tab === 'photos' ? 'Photos' : 'Gallery'}
					subtitle="{data.pagination.total} items"
					align="center"
				/>
			</AnimatedReveal>
			<MediaGallery items={data.mediaItems} />
		{/if}
		<ListControls pagination={data.pagination} />
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
