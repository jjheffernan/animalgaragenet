<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Video } from '$lib/types/domain';
	import { mockVideos } from '$lib/data/mock/videos';
	import VideoCard from './VideoCard.svelte';

	interface Props {
		videos?: Video[];
		limit?: number;
		onselect?: (video: Video) => void;
		class?: string;
	}

	let { videos = mockVideos, limit, onselect, class: className = '' }: Props = $props();

	const display = $derived(limit ? videos.slice(0, limit) : videos);

	function handleSelect(video: Video) {
		if (onselect) {
			onselect(video);
			return;
		}
		goto(resolve(`/watch/${video.id}`));
	}
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 {className}">
	{#each display as video (video.id)}
		<VideoCard {video} onclick={() => handleSelect(video)} />
	{/each}
</div>
