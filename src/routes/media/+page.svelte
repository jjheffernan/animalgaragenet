<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import MediaGallery from '$lib/components/MediaGallery.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import { mockMedia } from '$lib/data/mock-media';
	import { mockUGC } from '$lib/data/mock-ugc';
	import { mockVideos } from '$lib/data/mock-videos';

	const tabs = ['All', 'Videos', 'Photos', 'UGC'] as const;
	let activeTab = $state<(typeof tabs)[number]>('All');

	const filteredMedia = $derived.by(() => {
		if (activeTab === 'All') return mockMedia;
		if (activeTab === 'Videos') return mockMedia.filter((m) => m.type === 'video');
		if (activeTab === 'Photos') return mockMedia.filter((m) => m.type === 'image');
		return [];
	});
</script>

<svelte:head>
	<title>Media — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Media</h1>
		<p class="mt-2 text-zinc-400">Builds, events, and behind-the-scenes from the Animal Garage crew.</p>
	</div>
</section>

<section class="sticky top-[73px] z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="flex gap-1 py-3" aria-label="Media filters">
			{#each tabs as tab (tab)}
				<button
					type="button"
					onclick={() => (activeTab = tab)}
					class="rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition {activeTab === tab ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
				>
					{tab}
				</button>
			{/each}
		</nav>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	{#if activeTab === 'UGC'}
		<AnimatedReveal>
			<SectionHeading title="UGC Wall" subtitle="From the squad — tag @animalgarage" align="center" />
		</AnimatedReveal>
		<!-- TODO: UGCWall component -->
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
			{#each mockUGC as item (item.id)}
				<div class="relative aspect-square overflow-hidden rounded-sm">
					<img src={item.image} alt={item.caption} class="h-full w-full object-cover" loading="lazy" />
					<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 p-2">
						<p class="text-xs text-white">{item.handle}</p>
						<p class="text-xs text-zinc-400">{item.caption}</p>
					</div>
				</div>
			{/each}
		</div>
	{:else if activeTab === 'Videos'}
		<AnimatedReveal>
			<SectionHeading title="Videos" subtitle="Full builds, events, and shop tours." />
		</AnimatedReveal>
		<!-- TODO: VideoGrid component -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each mockVideos as video (video.id)}
				<a href={resolve('/watch')} class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
					<div class="relative aspect-video">
						<img src={video.thumbnail} alt={video.title} class="h-full w-full object-cover" loading="lazy" />
						<span class="absolute bottom-2 right-2 rounded bg-zinc-950/80 px-2 py-0.5 text-xs text-white">{video.duration}</span>
					</div>
					<div class="p-4">
						<h3 class="font-medium text-white group-hover:text-red-400">{video.title}</h3>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<AnimatedReveal>
			<SectionHeading title="Gallery" subtitle="Photos and video from the garage." align="center" />
		</AnimatedReveal>
		<MediaGallery items={filteredMedia} />
	{/if}
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-12">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<a href={resolve('/watch')} class="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">Full video hub →</a>
	</div>
</section>
