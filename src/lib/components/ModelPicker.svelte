<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PopularModel } from '$lib/types/domain';
	import { mockPopularModels } from '$lib/data/mock-popular-models';

	interface Props {
		models?: PopularModel[];
		class?: string;
	}

	let { models = mockPopularModels, class: className = '' }: Props = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 {className}">
	{#each models as m (m.id)}
		<a
			href={resolve(`/parts?model=${m.slug}`)}
			class="group relative overflow-hidden rounded-sm border border-zinc-800"
		>
			<img
				src={m.heroImage}
				alt={m.name}
				class="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
			<div class="absolute inset-x-0 bottom-0 p-4">
				<p class="text-xs font-bold uppercase tracking-wider text-red-500">{m.make}</p>
				<h3 class="font-display text-lg font-bold uppercase text-white">{m.model}</h3>
				<p class="mt-1 text-xs text-zinc-400 line-clamp-2">{m.description}</p>
			</div>
		</a>
	{/each}
</div>
