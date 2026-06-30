<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Brand } from '$lib/types/domain';
	import BrandCard from '$lib/components/catalog/BrandCard.svelte';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';

	interface Props {
		brands: Brand[];
		class?: string;
	}

	let { brands, class: className = '' }: Props = $props();
</script>

<section class="border-y border-zinc-800 py-14 {className}">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<SectionHeading title="Brand Lanes" subtitle="Shop by the brands we trust." />
			<a
				href={resolve('/brands')}
				class="shrink-0 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				All brands →
			</a>
		</div>

		<ul
			class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-4"
			role="list"
		>
			{#each brands as brand (brand.id)}
				<li class="min-w-0">
					<BrandCard {brand} compact />
				</li>
			{/each}
		</ul>
	</div>
</section>
