<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Video } from '$lib/types/domain';
	import type { PaginationMeta } from '$lib/pagination';
	import SectionHeading from './SectionHeading.svelte';
	import AnimatedReveal from './AnimatedReveal.svelte';
	import VideoGrid from './VideoGrid.svelte';
	import VideoHero from './VideoHero.svelte';
	import VideoDetailPanel from './VideoDetailPanel.svelte';
	import ListControls from './ListControls.svelte';
	import { videoPanel } from '$lib/stores/video-panel.svelte';

	interface Props {
		videos: Video[];
		pagination: PaginationMeta;
		featuredVideo?: Video;
		initialVideo?: Video;
	}

	let { videos, pagination, featuredVideo, initialVideo }: Props = $props();

	$effect(() => {
		if (initialVideo) {
			videoPanel.openVideo(initialVideo);
		}
	});

	function handleVideoSelect(video: Video) {
		videoPanel.openVideo(video);
		goto(resolve(`/watch/${video.id}`), { keepFocus: true, noScroll: true });
	}

	function handleClose() {
		if (page.params.id) {
			goto(resolve('/watch'), { replaceState: true, noScroll: true });
		}
	}
</script>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Watch</h1>
		<p class="mt-2 text-zinc-400">Full video hub — builds, events, and shop tours.</p>
	</div>
</section>

{#if featuredVideo}
	<VideoHero video={featuredVideo} onplay={() => handleVideoSelect(featuredVideo)} />
{/if}

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Videos" subtitle="{pagination.total} videos" />
	</AnimatedReveal>
	<VideoGrid {videos} onselect={handleVideoSelect} class="mt-8" />
	<ListControls {pagination} />
</section>

<VideoDetailPanel onclose={handleClose} />
