<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Brand } from '$lib/types/domain';

	interface Props {
		brand: Brand;
		compact?: boolean;
		class?: string;
	}

	let { brand, compact = false, class: className = '' }: Props = $props();
</script>

<a
	href={resolve(`/brands/${brand.slug}`)}
	class="group block h-full transition hover:border-red-600/50 {compact
		? 'flex items-center gap-3 rounded-sm border border-zinc-800 bg-zinc-900/80 px-3 py-2.5'
		: 'overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 p-4'} {className}"
>
	<img
		src={brand.logoUrl}
		alt={brand.name}
		class="{compact
			? 'h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-zinc-700'
			: 'mx-auto h-16 w-16 rounded-full object-cover'}"
		loading="lazy"
	/>
	<div class={compact ? 'min-w-0 flex-1' : ''}>
		<h3
			class="{compact
				? 'truncate text-xs font-bold uppercase tracking-wider text-white group-hover:text-red-400'
				: 'mt-3 text-center text-sm font-bold uppercase tracking-wider text-white group-hover:text-red-400'}"
		>
			{brand.name}
		</h3>
		{#if !compact}
			<p class="mt-1 text-center text-xs text-zinc-500 line-clamp-2">{brand.description}</p>
		{/if}
	</div>
</a>
