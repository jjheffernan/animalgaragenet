<script lang="ts">
	import type { Product } from '#lib/types/saleor.ts';

	interface Props {
		product: Product;
		selectedVariantId?: string;
		onselect?: (variantId: string) => void;
		class?: string;
	}

	let { product, selectedVariantId, onselect, class: className = '' }: Props = $props();

	const selected = $derived(selectedVariantId ?? product.variants[0]?.id);
</script>

{#if product.variants.length > 1}
	<div class="space-y-2 {className}">
		<p class="text-xs font-bold tracking-wider text-zinc-400 uppercase">Select Option</p>
		<div class="flex flex-wrap gap-2">
			{#each product.variants as variant (variant.id)}
				<button
					type="button"
					class="rounded-sm border px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition {selected ===
					variant.id
						? 'border-red-600 bg-red-600/10 text-red-500'
						: 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
					onclick={() => onselect?.(variant.id)}
				>
					{variant.name}
				</button>
			{/each}
		</div>
	</div>
{/if}
