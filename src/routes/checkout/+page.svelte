<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { CheckoutShippingDisplay } from '$lib/types/checkout';
	import { cart } from '$lib/stores/cart.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import CatalogKindBadge from '$lib/components/catalog/CatalogKindBadge.svelte';

	let { data } = $props();

	let firstName = $state('');
	let lastName = $state('');
	let streetAddress1 = $state('');
	let city = $state('');
	let countryArea = $state('');
	let postalCode = $state('');
	let country = $state('US');
	let selectedMethodId = $state('');
	let shipping = $state<CheckoutShippingDisplay | null>(data.shipping);
	let shippingSaving = $state(false);
	let shippingError = $state('');
	let addressSaved = $state(Boolean(data.shipping?.shippingMethods.length));

	onMount(() => {
		cart.init();
		if (data.saleorEnabled && data.checkout) {
			cart.hydrateCheckout(data.checkout);
		}
		if (data.shipping?.selectedShippingMethodId) {
			selectedMethodId = data.shipping.selectedShippingMethodId;
		}
	});

	const useSaleorDisplay = $derived(data.saleorEnabled && cart.checkout !== null);
	const checkoutLines = $derived(cart.checkout?.lines ?? []);
	const cartProducts = $derived(cart.getCartProducts());
	const isEmpty = $derived(
		useSaleorDisplay ? checkoutLines.length === 0 : cartProducts.length === 0
	);

	const paymentConfigured = $derived(
		data.saleorEnabled ? (shipping?.paymentGateways.length ?? 0) > 0 : false
	);
	const shippingComplete = $derived(Boolean(shipping?.selectedShippingMethodId));
	const canPay = $derived(
		data.saleorEnabled && paymentConfigured && shippingComplete && !isEmpty
	);

	const payButtonLabel = $derived.by(() => {
		if (!data.saleorEnabled) return 'Checkout unavailable — Saleor not configured';
		if (!shippingComplete) return 'Select shipping to continue';
		if (!paymentConfigured) return 'Payment unavailable — configure Payment App in Saleor';
		return 'Pay with Stripe';
	});

	const summarySubtotal = $derived(
		useSaleorDisplay
			? (shipping?.subtotal.amount ?? cart.subtotal)
			: cart.subtotal
	);
	const summaryCurrency = $derived(
		useSaleorDisplay
			? (shipping?.subtotal.currency ?? cart.subtotalCurrency)
			: cart.subtotalCurrency
	);
	const summaryShipping = $derived(shipping?.shippingPrice ?? null);
	const summaryTotal = $derived(
		useSaleorDisplay && shipping
			? shipping.total.amount
			: cart.subtotal
	);

	async function saveAddress(event: SubmitEvent) {
		event.preventDefault();
		if (!data.saleorEnabled) return;

		shippingSaving = true;
		shippingError = '';

		try {
			const response = await fetch('/checkout/shipping', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					address: { firstName, lastName, streetAddress1, city, countryArea, postalCode, country }
				})
			});
			const payload = (await response.json()) as {
				shipping?: CheckoutShippingDisplay;
				error?: string;
			};

			if (!response.ok) {
				shippingError = payload.error ?? 'Could not save shipping address.';
				return;
			}

			shipping = payload.shipping ?? null;
			addressSaved = Boolean(shipping?.shippingMethods.length);
			if (shipping?.selectedShippingMethodId) {
				selectedMethodId = shipping.selectedShippingMethodId;
			}
		} catch {
			shippingError = 'Network error — try again.';
		} finally {
			shippingSaving = false;
		}
	}

	async function selectShippingMethod(methodId: string) {
		if (!data.saleorEnabled || !methodId) return;

		selectedMethodId = methodId;
		shippingSaving = true;
		shippingError = '';

		try {
			const response = await fetch('/checkout/shipping', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ deliveryMethodId: methodId })
			});
			const payload = (await response.json()) as {
				shipping?: CheckoutShippingDisplay;
				error?: string;
			};

			if (!response.ok) {
				shippingError = payload.error ?? 'Could not select shipping method.';
				return;
			}

			shipping = payload.shipping ?? null;
		} catch {
			shippingError = 'Network error — try again.';
		} finally {
			shippingSaving = false;
		}
	}
</script>

<svelte:head>
	<title>Checkout — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-12">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-3xl font-bold uppercase text-white">Checkout</h1>
		<p class="mt-2 text-sm text-zinc-400">
			{#if data.saleorEnabled}
				Live Saleor checkout — shipping saves to your session; payment runs when a Payment App is on
				the channel.
			{:else}
				Prototype checkout using your local cart — connect Saleor to complete orders.
			{/if}
		</p>
	</div>
</section>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	{#if isEmpty}
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
					<form class="space-y-8" onsubmit={saveAddress}>
						<fieldset class="space-y-4" disabled={!data.saleorEnabled}>
							<legend class="font-display text-sm font-bold uppercase tracking-widest text-white">
								Shipping
							</legend>
							{#if !data.saleorEnabled}
								<p class="text-sm text-zinc-500">
									Shipping is saved locally for preview. Set <code class="text-zinc-400"
										>PUBLIC_SALEOR_API_URL</code
									> to sync with Saleor.
								</p>
							{/if}
							<div class="grid gap-4 sm:grid-cols-2">
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>First name</span
									>
									<input
										type="text"
										name="firstName"
										bind:value={firstName}
										required
										autocomplete="given-name"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>Last name</span
									>
									<input
										type="text"
										name="lastName"
										bind:value={lastName}
										required
										autocomplete="family-name"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block sm:col-span-2">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500"
										>Address</span
									>
									<input
										type="text"
										name="streetAddress1"
										bind:value={streetAddress1}
										required
										autocomplete="street-address"
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									/>
								</label>
								<label class="block">
									<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">City</span>
									<input
										type="text"
										name="city"
										bind:value={city}
										required
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
										name="countryArea"
										bind:value={countryArea}
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
										name="postalCode"
										bind:value={postalCode}
										required
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
										bind:value={country}
										class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
									>
										<option value="US">United States</option>
										<option value="CA">Canada</option>
										<option value="GB">United Kingdom</option>
										<option value="AU">Australia</option>
									</select>
								</label>
							</div>

							{#if data.saleorEnabled}
								<button
									type="submit"
									disabled={shippingSaving}
									class="rounded-sm border border-zinc-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:border-red-600 disabled:opacity-50"
								>
									{shippingSaving ? 'Saving…' : 'Save address & get rates'}
								</button>
							{/if}

							{#if shippingError}
								<p class="text-sm text-red-400" role="alert">{shippingError}</p>
							{/if}
						</fieldset>

						{#if data.saleorEnabled && addressSaved && shipping?.shippingMethods.length}
							<fieldset class="space-y-3">
								<legend class="font-display text-sm font-bold uppercase tracking-widest text-white">
									Shipping method
								</legend>
								{#each shipping.shippingMethods as method (method.id)}
									<label
										class="flex cursor-pointer items-center justify-between rounded-sm border border-zinc-800 bg-zinc-900/50 px-4 py-3 has-checked:border-red-600"
									>
										<span class="flex items-center gap-3">
											<input
												type="radio"
												name="shippingMethod"
												value={method.id}
												checked={selectedMethodId === method.id}
												onchange={() => selectShippingMethod(method.id)}
												class="text-red-600"
											/>
											<span class="text-sm text-white">{method.name}</span>
										</span>
										<span class="text-sm text-zinc-300"
											>{locale.formatPrice(method.price.amount, method.price.currency)}</span
										>
									</label>
								{/each}
							</fieldset>
						{/if}

						<fieldset class="space-y-4">
							<legend class="font-display text-sm font-bold uppercase tracking-widest text-white">
								Payment
							</legend>
							<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
								{#if !data.saleorEnabled}
									<p class="text-sm text-zinc-400">
										Payment requires Saleor. Your mock cart is preserved in this browser until live
										checkout is enabled.
									</p>
								{:else if !paymentConfigured}
									<p class="text-sm text-zinc-400">
										No Payment App is enabled on this Saleor channel. Install Stripe (or another
										Payment App) in Saleor Dashboard → Apps, then enable it for your channel.
									</p>
								{:else}
									<p class="text-sm text-zinc-400">
										Stripe Payment Element will load here after gateway initialization. Card data
										never touches this server — Saleor Payment Apps handle provider secrets.
									</p>
								{/if}
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
							disabled={!canPay}
							class="w-full rounded-sm py-4 text-sm font-bold uppercase tracking-wider transition {canPay
								? 'bg-red-600 text-white hover:bg-red-500'
								: 'bg-zinc-800 text-zinc-500'}"
							title={payButtonLabel}
						>
							{payButtonLabel}
						</button>
					</form>
				</AnimatedReveal>
			</div>

			<aside class="lg:col-span-2">
				<AnimatedReveal delay={100}>
					<div class="sticky top-24 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
						<h2 class="font-display text-lg font-bold uppercase text-white">Order Summary</h2>
						<ul class="mt-4 space-y-3 border-b border-zinc-800 pb-4">
							{#if useSaleorDisplay}
								{#each checkoutLines as line (line.id)}
									<li class="flex gap-3 text-sm">
										{#if line.thumbnail}
											<img
												src={line.thumbnail.url}
												alt=""
												class="h-12 w-12 rounded-sm object-cover"
											/>
										{/if}
										<div class="min-w-0 flex-1">
											<p class="truncate font-medium text-white">{line.productName}</p>
											<p class="text-xs text-zinc-500">Qty {line.quantity}</p>
										</div>
										<span class="shrink-0 text-zinc-300"
											>{locale.formatPrice(line.lineTotal.amount, line.lineTotal.currency)}</span
										>
									</li>
								{/each}
							{:else}
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
											>{locale.formatPrice(
												variant.pricing.price.amount * item.quantity,
												variant.pricing.price.currency
											)}</span
										>
									</li>
								{/each}
							{/if}
						</ul>
						<div class="mt-4 space-y-2 text-sm">
							<div class="flex justify-between text-zinc-400">
								<span>Subtotal</span>
								<span class="text-white"
									>{locale.formatPrice(summarySubtotal, summaryCurrency)}</span
								>
							</div>
							<div class="flex justify-between text-zinc-400">
								<span>Shipping</span>
								<span class="text-zinc-500">
									{#if summaryShipping}
										{locale.formatPrice(summaryShipping.amount, summaryShipping.currency)}
									{:else if data.saleorEnabled}
										Select method
									{:else}
										Not available
									{/if}
								</span>
							</div>
							<div
								class="flex justify-between border-t border-zinc-800 pt-2 font-medium text-white"
							>
								<span>Total</span>
								<span>{locale.formatPrice(summaryTotal, summaryCurrency)}</span>
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
