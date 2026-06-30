<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Brand } from '$lib/types/domain';

	interface Props {
		brand: Brand;
		class?: string;
	}

	let { brand, class: className = '' }: Props = $props();
</script>

<a
	href={resolve(`/brands/${brand.slug}`)}
	class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 p-4 transition hover:border-red-600/50 {className}"
>
	<img
		src={brand.logoUrl}
		alt={brand.name}
		class="mx-auto h-16 w-16 rounded-full object-cover"
		loading="lazy"
	/>
	<h3 class="mt-3 text-center text-sm font-bold uppercase tracking-wider text-white group-hover:text-red-400">
		{brand.name}
	</h3>
	<p class="mt-1 text-center text-xs text-zinc-500 line-clamp-2">{brand.description}</p>
</a>
