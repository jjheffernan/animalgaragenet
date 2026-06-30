<script lang="ts">
	import type { Video } from '$lib/types/domain';

	interface Props {
		video: Video;
		onclick?: () => void;
		compact?: boolean;
		class?: string;
	}

	let { video, onclick, compact = false, class: className = '' }: Props = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		onclick?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}
</script>

<button
	type="button"
	class="group block w-full overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 text-left transition hover:border-red-600/50 {className}"
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	<div class="relative aspect-video overflow-hidden bg-zinc-800">
		<img
			src={video.thumbnail}
			alt={video.title}
			class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<span class="absolute bottom-2 right-2 rounded-sm bg-zinc-950/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
			{video.duration}
		</span>
		<div class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
			<span class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white">
				<svg class="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
				</svg>
			</span>
		</div>
	</div>
	<div class={compact ? 'p-2' : 'p-3'}>
		<h3 class="text-sm font-medium text-white group-hover:text-red-400 line-clamp-2">{video.title}</h3>
		{#if !compact}
			<p class="mt-1 text-xs text-zinc-500 line-clamp-2">{video.description}</p>
		{/if}
		{#if video.linkedProductIds.length > 0}
			<p class="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
				{video.linkedProductIds.length} shoppable items
			</p>
		{/if}
	</div>
</button>
