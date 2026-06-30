<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getProductPath } from '$lib/data/catalog-helpers';
	import { cart } from '$lib/stores/cart.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { resolvePath } from '$lib/utils/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import CatalogKindBadge from '$lib/components/catalog/CatalogKindBadge.svelte';

	onMount(() => {
		cart.init();
	});

	const cartProducts = $derived(cart.getCartProducts());
</script>

<svelte:head>
	<title>Checkout — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-12">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-3xl font-bold uppercase text-white">Checkout</h1>
		<p class="mt-2 text-sm text-zinc-400">
			Prototype checkout — payment will route through Saleor when wired.
		</p>
	</div>
</section>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	{#if cartProducts.length === 0}
		<AnimatedReveal>
			<p class="text-zinc-400">Your cart is empty. Add items before checking out.</p>
			<a
				href={resolve('/cart')}
				class="mt-6 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			>
				← Back to cart
			</a>
		</AnimatedReveal>
	{:else}
		<div class="grid gap-12 lg:grid-cols-5">
			<div class="space-y-8 lg:col-span-3">
				<AnimatedReveal>
					<form class="space-y-8">
						<fieldset class="space-y-4">
							<legend class="font-display text-sm font-bold uppercase tracking-widest text-white"
								>Shipping</legend
							>
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="block sm:col-span-2">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>Full name</span
									>
									<input
										type="text"
										name="name"
										autocomplete="name"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block sm:col-span-2">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>Address</span
									>
									<input
										type="text"
										name="address"
										autocomplete="street-address"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">City</span
									>
									<input
										type="text"
										name="city"
										autocomplete="address-level2"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>State / Province</span
									>
									<input
										type="text"
										name="state"
										autocomplete="address-level1"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>ZIP / Postal code</span
									>
									<input
										type="text"
										name="zip"
										autocomplete="postal-code"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>Country</span
									>
									<select
										name="country"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									>
										<option value="US">United States</option>
										<option value="CA">Canada</option>
										<option value="GB">United Kingdom</option>
										<option value="AU">Australia</option>
									</select>
								</label>
							</div>
						</fieldset>

						<fieldset class="space-y-4">
							<legend class="font-display text-sm font-bold uppercase tracking-widest text-white"
								>Payment</legend
							>
							<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
								<p class="text-sm text-zinc-400">
									Payment processing will be handled by <strong class="text-zinc-300"
										>Saleor checkout</strong
									> — supporting Stripe, PayPal, and saved payment methods per channel. Card fields and
									3D Secure will appear here once the Saleor API is connected.
								</p>
								<div class="mt-4 space-y-3 opacity-50" aria-hidden="true">
									<input
										type="text"
										placeholder="Card number"
										disabled
										class="w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-600"
									/>
									<div class="grid gap-3 sm:grid-cols-2">
										<input
											type="text"
											placeholder="MM / YY"
											disabled
											class="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-600"
										/>
										<input
											type="text"
											placeholder="CVC"
											disabled
											class="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-600"
										/>
									</div>
								</div>
							</div>
						</fieldset>

						<button
							type="button"
							disabled
							class="w-full rounded-sm bg-zinc-800 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500"
						>
							Place Order — Awaiting Saleor
						</button>
					</form>
				</AnimatedReveal>
			</div>

			<aside class="lg:col-span-2">
				<AnimatedReveal delay={100}>
					<div class="sticky top-24 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
						<h2 class="font-display text-lg font-bold uppercase text-white">Order Summary</h2>
						<ul class="mt-4 space-y-3 border-b border-zinc-800 pb-4">
							{#each cartProducts as { item, product } (item.variantId)}
								{@const variant =
									product.variants.find((v) => v.id === item.variantId) ?? product.variants[0]}
								<li class="flex gap-3 text-sm">
									{#if product.thumbnail}
										<img
											src={product.thumbnail.url}
											alt=""
											class="h-12 w-12 rounded-sm object-cover"
										/>
									{/if}
									<div class="min-w-0 flex-1">
										<p class="truncate font-medium text-white">{product.name}</p>
										<div class="flex items-center gap-2">
											<p class="text-xs text-zinc-500">Qty {item.quantity}</p>
											<CatalogKindBadge {product} />
										</div>
									</div>
									<span class="shrink-0 text-zinc-300"
										>{locale.formatPrice(variant.pricing.price.amount * item.quantity)}</span
									>
								</li>
							{/each}
						</ul>
						<div class="mt-4 space-y-2 text-sm">
							<div class="flex justify-between text-zinc-400">
								<span>Subtotal</span>
								<span class="text-white">{locale.formatPrice(cart.subtotal)}</span>
							</div>
							<div class="flex justify-between text-zinc-400">
								<span>Shipping</span>
								<span class="text-zinc-500">Calculated at Saleor</span>
							</div>
							<div
								class="flex justify-between border-t border-zinc-800 pt-2 font-medium text-white"
							>
								<span>Total</span>
								<span>{locale.formatPrice(cart.subtotal)}</span>
							</div>
						</div>
					</div>
				</AnimatedReveal>
			</aside>
		</div>

		<a
			href={resolve('/cart')}
			class="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
		>
			← Back to cart
		</a>
	{/if}
</section>
