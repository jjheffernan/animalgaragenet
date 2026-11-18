<script lang="ts">
	import type { Product } from '#lib/types/saleor.ts';
	import { CATALOG_KIND_LABELS, getCatalogKind } from '#lib/data/catalog-helpers.ts';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();

	const kind = $derived(getCatalogKind(product));
</script>

{#if kind === 'PARTS'}
	<span
		class="shrink-0 rounded-sm bg-zinc-800 px-2 py-0.5 text-[10px] font-bold tracking-wider text-zinc-300 uppercase"
	>
		{CATALOG_KIND_LABELS.PARTS}
	</span>
{/if}
