<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import type { PartCategory } from '$lib/types/domain';
	import { mockPartCategories } from '$lib/data/mock/part-categories';

	interface Props {
		categories?: PartCategory[];
		activeSlug?: string;
		class?: string;
	}

	let { categories = mockPartCategories, activeSlug, class: className = '' }: Props = $props();

	const currentSlug = $derived(activeSlug ?? $page.params.category ?? '');
</script>

<nav aria-label="Part categories" class="space-y-1 {className}">
	{#each categories as cat (cat.id)}
		<div>
			<a
				href={resolve(`/parts/${cat.slug}`)}
				class="block rounded-sm px-3 py-2 text-sm font-medium uppercase tracking-wider transition {currentSlug ===
				cat.slug
					? 'bg-red-600/10 text-red-500'
					: 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}"
			>
				{cat.name}
			</a>
			{#if cat.children && (currentSlug === cat.slug || cat.children.some((c) => c.slug === currentSlug))}
				<ul class="ml-3 border-l border-zinc-800 pl-3">
					{#each cat.children as child (child.id)}
						<li>
							<a
								href={resolve(`/parts/${child.slug}`)}
								class="block py-1.5 text-xs transition {currentSlug === child.slug
									? 'text-red-500'
									: 'text-zinc-500 hover:text-white'}"
							>
								{child.name}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/each}
</nav>
