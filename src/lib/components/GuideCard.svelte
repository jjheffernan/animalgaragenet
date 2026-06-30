<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Guide } from '$lib/types/domain';

	interface Props {
		guide: Guide;
		class?: string;
	}

	let { guide, class: className = '' }: Props = $props();
</script>

<a
	href={resolve(`/guides/${guide.slug}`)}
	class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50 {className}"
>
	<img
		src={guide.heroImage}
		alt={guide.title}
		class="aspect-[2/1] w-full object-cover transition duration-500 group-hover:scale-105"
		loading="lazy"
	/>
	<div class="p-4">
		<p class="text-xs font-bold uppercase tracking-wider text-red-500">{guide.category}</p>
		<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{guide.title}</h3>
		<p class="mt-2 text-sm text-zinc-500 line-clamp-2">{guide.excerpt}</p>
		<p class="mt-2 text-xs text-zinc-600">{guide.readTimeMinutes} min read</p>
	</div>
</a>
