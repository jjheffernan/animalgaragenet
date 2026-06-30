<script lang="ts">
	import { resolve } from '$app/paths';
	import type { BuildThread } from '$lib/types/domain';

	interface Props {
		build: BuildThread;
		class?: string;
	}

	let { build, class: className = '' }: Props = $props();
</script>

<a
	href={resolve(`/builds/${build.slug}`)}
	class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50 {className}"
>
	<div class="relative aspect-[16/10] overflow-hidden bg-zinc-800">
		{#if build.photos[0]}
			<img
				src={build.photos[0]}
				alt={build.title}
				class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		{/if}
		{#if build.featured}
			<span class="absolute left-2 top-2 rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
				Featured
			</span>
		{/if}
	</div>
	<div class="p-4">
		<p class="text-xs text-zinc-500">{build.year} {build.make} {build.model}</p>
		<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{build.title}</h3>
		<p class="mt-2 text-xs text-zinc-500">{build.modList.length} mods</p>
	</div>
</a>
