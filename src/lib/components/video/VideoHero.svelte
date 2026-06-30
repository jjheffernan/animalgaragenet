<script lang="ts">
	import type { Video } from '$lib/types/domain';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	interface Props {
		video: Video;
		onplay?: () => void;
	}

	let { video, onplay }: Props = $props();

	function formatDate(iso?: string): string | null {
		if (!iso) return null;
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const published = $derived(formatDate(video.publishedAt));
</script>

<section class="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
	<div
		class="absolute inset-0 opacity-15"
		style="background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(220,38,38,0.12) 10px, rgba(220,38,38,0.12) 11px)"
		aria-hidden="true"
	></div>
	<div
		class="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-900/80"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<AnimatedReveal>
			<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">On Deck</p>
			<p class="mt-1 text-sm text-zinc-500">Latest from the channel</p>

			<div class="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
				<button
					type="button"
					class="group relative aspect-video w-full overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 text-left transition hover:border-red-600/60"
					onclick={onplay}
					aria-label="Play {video.title}"
				>
					<img
						src={video.thumbnail}
						alt=""
						class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"
					></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<span
							class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg shadow-red-900/40 transition group-hover:scale-110 group-hover:bg-red-500"
						>
							<svg class="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
								<path
									d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
								/>
							</svg>
						</span>
					</div>
					<span
						class="absolute bottom-3 right-3 rounded-sm bg-zinc-950/90 px-2 py-1 text-xs font-medium text-white"
					>
						{video.duration}
					</span>
				</button>

				<div>
					<h2
						class="font-display text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl"
					>
						{video.title}
					</h2>
					<p class="mt-4 text-base leading-relaxed text-zinc-400 line-clamp-3">
						{video.description}
					</p>
					<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
						{#if published}
							<span>{published}</span>
						{/if}
						<span>{video.duration}</span>
						{#if video.linkedProductIds.length > 0}
							<span class="text-red-500/80">
								{video.linkedProductIds.length} shoppable items
							</span>
						{/if}
					</div>
					<button
						type="button"
						class="mt-8 rounded-sm bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
						onclick={onplay}
					>
						Watch Now
					</button>
				</div>
			</div>
		</AnimatedReveal>
	</div>

	<div
		class="hero-scan absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"
		aria-hidden="true"
	></div>
</section>

<style>
	.hero-scan {
		animation: scan 4s ease-in-out infinite;
	}

	@keyframes scan {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}
</style>
