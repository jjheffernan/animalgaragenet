<script lang="ts">
	import { resolve } from '$app/paths';
	import type { UGCItem } from '$lib/types/domain';
	import { mockUGC } from '$lib/data/mock/ugc';

	interface Props {
		items?: UGCItem[];
		limit?: number;
		class?: string;
	}

	let { items = mockUGC, limit, class: className = '' }: Props = $props();

	const display = $derived(limit ? items.slice(0, limit) : items);
</script>

<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 {className}">
	{#each display as item (item.id)}
		<a
			href={resolve('/media')}
			class="group relative aspect-square overflow-hidden rounded-sm bg-zinc-800"
		>
			<img
				src={item.image}
				alt={item.caption}
				class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
				loading="lazy"
			/>
			<div
				class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100"
			>
				<p class="text-xs text-white line-clamp-2">{item.caption}</p>
				<p class="text-[10px] text-red-500">{item.handle}</p>
			</div>
		</a>
	{/each}
</div>
