<script lang="ts">
	import type { MediaItem } from '$lib/data/mock-media';

	interface Props {
		items: MediaItem[];
		limit?: number;
	}

	let { items, limit }: Props = $props();
	const display = $derived(limit ? items.slice(0, limit) : items);
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each display as item (item.id)}
		<figure class="group overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
			<div class="relative aspect-video overflow-hidden bg-zinc-800">
				<img
					src={item.thumbnail}
					alt={item.title}
					class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					loading="lazy"
				/>
				{#if item.type === 'video'}
					<div
						class="absolute inset-0 flex items-center justify-center bg-zinc-950/40 transition group-hover:bg-zinc-950/20"
					>
						<span
							class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white"
							aria-hidden="true"
						>
							▶
						</span>
					</div>
				{/if}
			</div>
			<figcaption class="p-4">
				<p class="text-xs font-medium uppercase tracking-wider text-red-500">{item.category}</p>
				<p class="mt-1 font-medium text-white">{item.title}</p>
			</figcaption>
		</figure>
	{/each}
</div>
