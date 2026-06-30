<script lang="ts">
	import type { Product } from '$lib/types/saleor';
	import type { ListView } from '$lib/pagination';
	import { getProductPath, isPartProduct } from '$lib/data/catalog-helpers';
	import { cart } from '$lib/stores/cart.svelte';
	import { resolvePath } from '$lib/utils/paths';
	import CatalogKindBadge from '$lib/components/catalog/CatalogKindBadge.svelte';
	import PriceDisplay from '$lib/components/catalog/PriceDisplay.svelte';

	interface Props {
		product: Product;
		view?: ListView;
	}

	let { product, view = 'grid-lg' }: Props = $props();

	const soldOut = $derived(!product.isAvailableForPurchase || product.availableQuantity === 0);
	const isList = $derived(view === 'list');
	const isSmall = $derived(view === 'grid-sm');

	function handleQuickAdd(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!soldOut) {
			cart.addItem(product.id);
			cart.openDrawer();
		}
	}
</script>

<a
	href={resolvePath(getProductPath(product))}
	class="group relative block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 transition hover:border-red-600/50 {isList
		? 'flex gap-4 sm:gap-6'
		: ''}"
>
	<div
		class="relative overflow-hidden bg-zinc-800 {isList
			? 'h-24 w-24 shrink-0 sm:h-32 sm:w-32'
			: isSmall
				? 'aspect-square'
				: 'aspect-square'}"
	>
		{#if product.thumbnail}
			<img
				src={product.thumbnail.url}
				alt={product.thumbnail.alt}
				class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		{/if}
		{#if soldOut}
			<span
				class="absolute left-2 top-2 rounded-sm bg-zinc-950 px-2 py-0.5 text-[10px] font-bold uppercase text-white {isSmall
					? 'left-1 top-1 px-1.5 py-0.5 text-[8px]'
					: ''}"
			>
				Sold Out
			</span>
		{/if}
		{#if isPartProduct(product) && !isList}
			<span
				class="absolute left-2 {soldOut ? 'top-9' : 'top-2'} {isSmall ? 'left-1 scale-90' : ''}"
			>
				<CatalogKindBadge {product} />
			</span>
		{/if}
		{#if product.tags?.includes('staff-pick') && !isList}
			<span
				class="absolute right-2 top-2 rounded-sm bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white {isSmall
					? 'right-1 top-1 px-1.5 text-[8px]'
					: ''}"
			>
				Staff Pick
			</span>
		{/if}
		{#if product.tags?.includes('clearance') && !isList}
			<span
				class="absolute right-2 top-10 rounded-sm bg-amber-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400 {isSmall
					? 'right-1 top-8 px-1.5 text-[8px]'
					: ''}"
			>
				Clearance
			</span>
		{/if}
		{#if !isList}
			<div
				class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
			></div>
			{#if !soldOut}
				<button
					type="button"
					class="absolute bottom-3 right-3 rounded-sm bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100 {isSmall
						? 'bottom-2 right-2 px-2 py-0.5 text-[10px]'
						: ''}"
					onclick={handleQuickAdd}
				>
					Quick Add
				</button>
			{/if}
		{/if}
	</div>
	<div
		class={isList ? 'flex min-w-0 flex-1 flex-col justify-center py-2' : isSmall ? 'p-2.5' : 'p-4'}
	>
		{#if isList && isPartProduct(product)}
			<div class="mb-1">
				<CatalogKindBadge {product} />
			</div>
		{/if}
		{#if product.brand}
			<p
				class="font-medium uppercase tracking-wider text-zinc-500 {isSmall
					? 'text-[9px]'
					: 'text-[10px]'}"
			>
				{product.brand.name}
			</p>
		{:else if product.category}
			<p
				class="font-medium uppercase tracking-wider text-red-500 {isSmall
					? 'text-[10px]'
					: 'text-xs'}"
			>
				{product.category.name}
			</p>
		{/if}
		<h3
			class="font-medium text-white group-hover:text-red-400 {isList
				? 'mt-0.5 text-base sm:text-lg'
				: isSmall
					? 'mt-0.5 text-sm leading-snug'
					: 'mt-1'}"
		>
			{product.name}
		</h3>
		{#if isList && product.description}
			<p class="mt-1 line-clamp-2 text-sm text-zinc-500">{product.description}</p>
		{/if}
		<div class="mt-2 flex flex-wrap items-center gap-2">
			<PriceDisplay {product} />
			{#if isList}
				{#if product.tags?.includes('staff-pick')}
					<span
						class="rounded-sm bg-red-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400"
					>
						Staff Pick
					</span>
				{/if}
				{#if product.tags?.includes('clearance')}
					<span
						class="rounded-sm bg-amber-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400"
					>
						Clearance
					</span>
				{/if}
			{/if}
		</div>
		{#if isList && !soldOut}
			<button
				type="button"
				class="mt-3 w-fit rounded-sm border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white"
				onclick={handleQuickAdd}
			>
				Quick Add
			</button>
		{/if}
	</div>
</a>
