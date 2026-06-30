<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { CheckoutShippingDisplay } from '$lib/types/checkout';
	import {
		mountPaymentElement,
		readStripeClientSecret,
		readStripePublishableKey,
		type StripeElementsHandle
	} from '$lib/client/checkout/stripe-elements';
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
	let paymentElementContainer = $state<HTMLDivElement | null>(null);
	let stripeHandle = $state<StripeElementsHandle | null>(null);
	let stripePublishableKey = $state<string | null>(null);
	let gatewayInitializing = $state(false);
	let gatewayInitialized = $state(false);
	let gatewayError = $state('');
	let paymentProcessing = $state(false);
	let paymentError = $state('');

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
	const shouldInitializeGateway = $derived(
		data.saleorEnabled && paymentConfigured && shippingComplete && !isEmpty
	);
	const canPay = $derived(
		shouldInitializeGateway && gatewayInitialized && !gatewayInitializing && !paymentProcessing
	);

	const payButtonLabel = $derived.by(() => {
		if (!data.saleorEnabled) return 'Checkout unavailable — Saleor not configured';
		if (!shippingComplete) return 'Select shipping to continue';
		if (!paymentConfigured) return 'Payment unavailable — configure Payment App in Saleor';
		if (gatewayInitializing) return 'Loading payment…';
		if (!gatewayInitialized) return gatewayError || 'Initializing payment…';
		if (paymentProcessing) return 'Processing…';
		return 'Pay with Stripe';
	});

	$effect(() => {
		if (!shouldInitializeGateway) {
			stripePublishableKey = null;
			gatewayInitialized = false;
			gatewayError = '';
			stripeHandle?.destroy();
			stripeHandle = null;
			return;
		}

		const amount = shipping?.total.amount;
		let cancelled = false;

		gatewayInitializing = true;
		gatewayInitialized = false;
		gatewayError = '';

		void (async () => {
			try {
				const response = await fetch('/checkout/payment/initialize', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ amount })
				});
				const payload = (await response.json()) as {
					gateway?: Record<string, unknown>;
					error?: string;
					code?: string;
					hint?: string;
				};

				if (cancelled) return;

				if (!response.ok) {
					const detail = payload.hint ? `${payload.error ?? 'Could not initialize payment gateway.'} ${payload.hint}` : (payload.error ?? 'Could not initialize payment gateway.');
					gatewayError = detail;
					return;
				}

				const publishableKey = readStripePublishableKey(payload.gateway);
				if (!publishableKey) {
					gatewayError = 'Payment gateway did not return a publishable key.';
					return;
				}

				stripePublishableKey = publishableKey;
			} catch {
				if (!cancelled) gatewayError = 'Network error — try again.';
			} finally {
				if (!cancelled) gatewayInitializing = false;
			}
		})();

		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		const key = stripePublishableKey;
		const container = paymentElementContainer;
		if (!key || !container) return;

		let cancelled = false;
		let localHandle: StripeElementsHandle | null = null;

		void (async () => {
			stripeHandle?.destroy();
			stripeHandle = null;

			const handle = await mountPaymentElement(container, key);
			if (cancelled) {
				handle?.destroy();
				return;
			}
			if (!handle) {
				gatewayError = 'Could not load Stripe Payment Element.';
				gatewayInitialized = false;
				return;
			}

			localHandle = handle;
			stripeHandle = handle;
			gatewayInitialized = true;
			gatewayError = '';
		})();

		return () => {
			cancelled = true;
			localHandle?.destroy();
			if (stripeHandle === localHandle) {
				stripeHandle = null;
				gatewayInitialized = false;
			}
		};
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

	async function handlePay() {
		if (!canPay || !stripeHandle || !shipping) return;

		paymentProcessing = true;
		paymentError = '';

		try {
			const { error: submitError } = await stripeHandle.elements.submit();
			if (submitError) {
				paymentError = submitError.message ?? 'Payment validation failed.';
				return;
			}

			const initResponse = await fetch('/checkout/payment/initialize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: shipping.total.amount,
					startTransaction: true
				})
			});
			const initPayload = (await initResponse.json()) as {
				data?: unknown;
				error?: string;
			};

			if (!initResponse.ok) {
				paymentError = initPayload.error ?? 'Could not start payment.';
				return;
			}

			const clientSecret = readStripeClientSecret(initPayload.data);
			if (!clientSecret) {
				paymentError = 'Payment provider did not return a client secret.';
				return;
			}

			const returnUrl = new URL(resolve('/checkout/payment/complete'), window.location.origin).href;
			const { error: confirmError } = await stripeHandle.stripe.confirmPayment({
				elements: stripeHandle.elements,
				clientSecret,
				confirmParams: { return_url: returnUrl }
			});

			if (confirmError) {
				paymentError = confirmError.message ?? 'Payment could not be confirmed.';
			}
		} catch {
			paymentError = 'Network error — try again.';
		} finally {
			paymentProcessing = false;
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
									<div class="space-y-2 text-sm text-zinc-400" role="status">
										<p>
											No Payment App is enabled on this Saleor channel. Shipping and cart sync work;
											card payment unlocks after ops enables a provider in Saleor.
										</p>
										{#if data.paymentAppOpsHint}
											<p class="text-zinc-500">{data.paymentAppOpsHint}</p>
										{/if}
									</div>
								{:else if !shippingComplete}
									<p class="text-sm text-zinc-400">
										Select a shipping method to load Stripe Payment Element.
									</p>
								{:else if gatewayInitializing}
									<p class="text-sm text-zinc-400">Connecting to payment gateway…</p>
								{:else if gatewayError}
									<p class="text-sm text-red-400" role="alert">{gatewayError}</p>
								{:else}
									<p class="text-sm text-zinc-400">
										Card data never touches this server — Saleor Payment Apps handle provider
										secrets.
									</p>
									<div
										class="mt-4 min-h-[3rem]"
										bind:this={paymentElementContainer}
										aria-label="Stripe payment form"
									></div>
								{/if}
								{#if paymentError}
									<p class="mt-3 text-sm text-red-400" role="alert">{paymentError}</p>
								{/if}
							</div>
						</fieldset>

						<button
							type="button"
							disabled={!canPay}
							onclick={handlePay}
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
