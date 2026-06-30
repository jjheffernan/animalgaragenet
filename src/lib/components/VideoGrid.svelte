<script lang="ts">
	import type { Video } from '$lib/types/domain';
	import { mockVideos } from '$lib/data/mock-videos';
	import VideoCard from './VideoCard.svelte';

	interface Props {
		videos?: Video[];
		limit?: number;
		class?: string;
	}

	let { videos = mockVideos, limit, class: className = '' }: Props = $props();

	const display = $derived(limit ? videos.slice(0, limit) : videos);
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 {className}">
	{#each display as video (video.id)}
		<VideoCard {video} />
	{/each}
</div>
