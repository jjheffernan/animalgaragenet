import type { Stripe, StripeElements } from '@stripe/stripe-js';

export interface StripeElementsHandle {
	stripe: Stripe;
	elements: StripeElements;
	destroy: () => void;
}

/** Lazy-load Stripe.js — only imported when Saleor returns a publishable key. */
export async function loadStripePublishable(publishableKey: string): Promise<Stripe | null> {
	const { loadStripe } = await import('@stripe/stripe-js');
	return loadStripe(publishableKey);
}

/** Mount Stripe Payment Element in the given container. */
export async function mountPaymentElement(
	container: HTMLElement,
	publishableKey: string
): Promise<StripeElementsHandle | null> {
	const stripe = await loadStripePublishable(publishableKey);
	if (!stripe) return null;

	const elements = stripe.elements();
	const paymentElement = elements.create('payment');
	paymentElement.mount(container);

	return {
		stripe,
		elements,
		destroy: () => {
			paymentElement.destroy();
		}
	};
}

/** Read Stripe publishable key from Saleor gateway initialize payload. */
export function readStripePublishableKey(
	gateway: Record<string, unknown> | null | undefined
): string | null {
	const key = gateway?.stripePublishableKey;
	return typeof key === 'string' && key.length > 0 ? key : null;
}

/** Read client secret from transactionInitialize response data. */
export function readStripeClientSecret(data: unknown): string | null {
	if (!data || typeof data !== 'object') return null;
	const secret = (data as { stripeClientSecret?: unknown }).stripeClientSecret;
	return typeof secret === 'string' && secret.length > 0 ? secret : null;
}
