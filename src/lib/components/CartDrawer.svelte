<script lang="ts">
	import { resolve } from '$app/paths';
	import { cart } from '$lib/stores/cart.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import PriceDisplay from './PriceDisplay.svelte';

	interface Props {
		open?: boolean;
		onclose?: () => void;
	}

	let { open = false, onclose }: Props = $props();

	$effect(() => {
		if (open) cart.init();
	});

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[60] flex justify-end bg-zinc-950/80 backdrop-blur-sm"
		role="presentation"
		onclick={handleBackdrop}
	>
		<div
			class="flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950"
			role="dialog"
			aria-label="Shopping cart"
			tabindex="-1"
		>
			<div class="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
				<h2 class="font-display text-lg font-bold uppercase tracking-wider text-white">
					Cart ({cart.itemCount})
				</h2>
				<button
					type="button"
					class="text-zinc-400 hover:text-white"
					aria-label="Close cart"
					onclick={() => onclose?.()}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto px-4 py-4">
				{#if cart.itemCount === 0}
					<p class="py-8 text-center text-sm text-zinc-500">Your cart is empty.</p>
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
									<p class="truncate text-sm font-medium text-white">{product.name}</p>
									<p class="text-xs text-zinc-500">{variant.name}</p>
									<div class="mt-2 flex items-center justify-between">
										<div class="flex items-center gap-2">
											<button
												type="button"
												class="h-6 w-6 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white"
												onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity - 1)}
											>−</button>
											<span class="text-sm text-white">{item.quantity}</span>
											<button
												type="button"
												class="h-6 w-6 rounded-sm border border-zinc-700 text-zinc-400 hover:text-white"
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

				{#if cart.itemCount > 0}
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
											class="shrink-0 rounded-sm bg-zinc-800 px-2 py-1 text-[10px] font-bold uppercase text-red-500 hover:bg-red-600 hover:text-white"
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

			{#if cart.itemCount > 0}
				<div class="border-t border-zinc-800 px-4 py-4">
					<div class="flex justify-between text-sm">
						<span class="text-zinc-400">Subtotal</span>
						<span class="font-medium text-white">{locale.formatPrice(cart.subtotal)}</span>
					</div>
					<a
						href={resolve('/cart')}
						class="mt-4 block w-full rounded-sm bg-red-600 py-3 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
						onclick={() => onclose?.()}
					>
						View Cart
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
