<script lang="ts">
	import { resolve } from '$app/paths';
	import { getProductPath } from '$lib/data/catalog-helpers';
	import { cart } from '$lib/stores/cart.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { resolvePath } from '$lib/utils/paths';
	import SideDrawer from './SideDrawer.svelte';
	import CartActions from './CartActions.svelte';
	import CatalogKindBadge from './CatalogKindBadge.svelte';
	import PriceDisplay from './PriceDisplay.svelte';

	interface Props {
		open?: boolean;
		onclose?: () => void;
		/** Match mobile nav drawer width on small screens */
		mobileOnly?: boolean;
	}

	let { open = false, onclose, mobileOnly = false }: Props = $props();

	$effect(() => {
		if (open) cart.init();
	});
</script>

{#snippet drawerHeader()}
	<div class="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-4">
		<h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">
			Cart ({cart.itemCount})
		</h2>
		<button
			type="button"
			class="p-2 text-zinc-400 transition hover:text-white"
			aria-label="Close cart"
			onclick={() => onclose?.()}
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/snippet}

{#snippet drawerBody()}
	<div class="flex-1 overflow-y-auto px-5 py-4">
		{#if cart.itemCount === 0}
			<p class="py-8 text-center text-sm text-zinc-500">Your cart is empty.</p>
		{:else if cart.checkout}
			<ul class="space-y-4">
				{#each cart.checkout.lines as line (line.id)}
					<li class="flex gap-3 border-b border-zinc-800 pb-4">
						{#if line.thumbnail}
							<img
								src={line.thumbnail.url}
								alt={line.productName}
								class="h-20 w-20 rounded-sm object-cover"
							/>
						{/if}
						<div class="min-w-0 flex-1">
							<a
								href={resolve(`/shop/${line.productSlug}`)}
								class="truncate text-sm font-medium text-white hover:text-red-400"
								onclick={() => onclose?.()}
							>
								{line.productName}
							</a>
							<p class="text-xs text-zinc-500">{line.variantName}</p>
							<div class="mt-2 flex items-center justify-between">
								<span class="text-sm text-white">Qty {line.quantity}</span>
								<span class="text-sm text-zinc-400">
									{locale.formatPrice(line.lineTotal.amount)}
								</span>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="space-y-4">
				{#each cart.getCartProducts() as { item, product } (item.productId + item.variantId)}
					{@const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]}
					<li class="flex gap-3 border-b border-zinc-800 pb-4">
						{#if product.thumbnail}
							<img
								src={product.thumbnail.url}
								alt={product.name}
								class="h-20 w-20 rounded-sm object-cover"
							/>
						{/if}
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<a
									href={resolvePath(getProductPath(product))}
									class="truncate text-sm font-medium text-white hover:text-red-400"
									onclick={() => onclose?.()}
								>
									{product.name}
								</a>
								<CatalogKindBadge {product} />
							</div>
							<p class="text-xs text-zinc-500">{variant.name}</p>
							<div class="mt-2 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<button
										type="button"
										class="flex h-6 w-6 items-center justify-center rounded-sm border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
										onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity - 1)}
									>−</button>
									<span class="text-sm text-white">{item.quantity}</span>
									<button
										type="button"
										class="flex h-6 w-6 items-center justify-center rounded-sm border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
										onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity + 1)}
									>+</button>
								</div>
								<span class="text-sm text-zinc-400">
									{locale.formatPrice(variant.pricing.price.amount * item.quantity)}
								</span>
							</div>
							<button
								type="button"
								class="mt-1 text-xs text-zinc-600 hover:text-red-500"
								onclick={() => cart.removeItem(item.productId, item.variantId)}
							>
								Remove
							</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		{#if cart.itemCount > 0 && !cart.checkout}
			{@const upsells = cart.getUpsellSuggestions(3)}
			{#if upsells.length > 0}
				<div class="mt-8">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">You Might Also Like</p>
					<ul class="mt-3 space-y-2">
						{#each upsells as product (product.id)}
							<li class="flex items-center justify-between gap-2 rounded-sm border border-zinc-800 p-2">
								<div class="min-w-0 flex-1">
									<p class="truncate text-xs text-white">{product.name}</p>
									<PriceDisplay {product} />
								</div>
								<button
									type="button"
									class="shrink-0 rounded-sm bg-red-600 px-2.5 py-1 text-xs font-bold uppercase text-white transition hover:bg-red-500"
									onclick={() => cart.addItem(product.id)}
								>
									Add
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

{#snippet drawerFooter()}
	<div class="shrink-0 border-t border-zinc-800 px-5 py-4">
		<div class="flex justify-between text-sm">
			<span class="text-zinc-400">Subtotal</span>
			<span class="font-medium text-white">{locale.formatPrice(cart.subtotal)}</span>
		</div>
		<div class="mt-4">
			<CartActions empty={cart.itemCount === 0} size="drawer" onNavigate={() => onclose?.()} />
		</div>
	</div>
{/snippet}

<SideDrawer
	{open}
	side="right"
	onclose={() => onclose?.()}
	ariaLabel="Shopping cart"
	{mobileOnly}
	header={drawerHeader}
	children={drawerBody}
	footer={drawerFooter}
/>
