import type { Cookies } from '@sveltejs/kit';
import type {
	CheckoutDisplay,
	CheckoutLineDisplay,
	CheckoutShippingDisplay,
	ShippingAddressInput,
	ShippingMethodDisplay
} from '$lib/types/checkout';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import {
	CHECKOUT_ADD_PROMO_CODE,
	CHECKOUT_COMPLETE,
	CHECKOUT_CREATE,
	CHECKOUT_DELIVERY_METHOD_UPDATE,
	CHECKOUT_GET,
	CHECKOUT_GET_SHIPPING,
	CHECKOUT_LINES_ADD,
	CHECKOUT_LINES_DELETE,
	CHECKOUT_LINES_UPDATE,
	CHECKOUT_REMOVE_PROMO_CODE,
	CHECKOUT_SHIPPING_ADDRESS_UPDATE,
	PAYMENT_GATEWAY_INITIALIZE,
	TRANSACTION_INITIALIZE,
	TRANSACTION_PROCESS
} from '$lib/server/saleor/checkout-queries';
import { config } from '$lib/config/env';

export const CHECKOUT_COOKIE = 'ag-checkout-id';
export const TRANSACTION_COOKIE = 'ag-transaction-id';

/** Default Saleor Stripe Payment App manifest id. */
export const DEFAULT_PAYMENT_GATEWAY_ID = 'saleor.app.payment.stripe';

/** Structured error code when Saleor channel has no Payment App enabled. */
export const PAYMENT_GATEWAY_UNAVAILABLE_CODE = 'PAYMENT_GATEWAY_UNAVAILABLE';

/**
 * Ops hint for checkout UI and payment proxy responses.
 * Storefront does not need Stripe keys — Payment App config lives in Saleor Dashboard.
 */
export const PAYMENT_APP_OPS_HINT =
	'Install a Payment App in Saleor Dashboard → Apps, then enable it for your channel. No Stripe keys belong in storefront .env.';

export interface PaymentGatewayUnavailablePayload {
	error: string;
	code: typeof PAYMENT_GATEWAY_UNAVAILABLE_CODE;
	hint: string;
}

export function paymentGatewayUnavailablePayload(
	error = 'Payment gateway not available on this channel. Install a Payment App in Saleor.'
): PaymentGatewayUnavailablePayload {
	return {
		error,
		code: PAYMENT_GATEWAY_UNAVAILABLE_CODE,
		hint: PAYMENT_APP_OPS_HINT
	};
}

export function isPaymentGatewayUnavailableCode(
	code: string | undefined
): code is typeof PAYMENT_GATEWAY_UNAVAILABLE_CODE {
	return code === PAYMENT_GATEWAY_UNAVAILABLE_CODE;
}

interface SaleorMoneyGross {
	gross: { amount: number; currency: string };
}

interface SaleorCheckoutLineNode {
	id: string;
	quantity: number;
	variant: {
		id: string;
		name: string;
		pricing: { price: SaleorMoneyGross };
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail: { url: string; alt: string } | null;
		};
	};
	totalPrice: SaleorMoneyGross;
}

interface SaleorCheckoutNode {
	id: string;
	lines: SaleorCheckoutLineNode[];
	totalPrice: SaleorMoneyGross;
	discount?: { amount: number; currency: string } | null;
	discountName?: string | null;
}

interface SaleorShippingMethod {
	id: string;
	name: string;
	price: { amount: number; currency: string };
}

interface SaleorPaymentGateway {
	id: string;
	name: string;
	currencies: string[];
}

interface SaleorCheckoutShippingNode extends SaleorCheckoutNode {
	shippingPrice?: SaleorMoneyGross | null;
	deliveryMethod?: { id: string; name: string } | null;
	availableShippingMethods?: SaleorShippingMethod[];
	availablePaymentGateways?: SaleorPaymentGateway[];
}

function mapShippingMethod(method: SaleorShippingMethod): ShippingMethodDisplay {
	return {
		id: method.id,
		name: method.name,
		price: { amount: method.price.amount, currency: method.price.currency }
	};
}

function mapCheckoutShipping(node: SaleorCheckoutShippingNode): CheckoutShippingDisplay {
	const shippingMethods = (node.availableShippingMethods ?? []).map(mapShippingMethod);
	const total = node.totalPrice.gross;
	const shipping = node.shippingPrice?.gross;
	const subtotalAmount = shipping ? total.amount - shipping.amount : total.amount;

	return {
		id: node.id,
		subtotal: { amount: subtotalAmount, currency: total.currency },
		shippingPrice: shipping
			? { amount: shipping.amount, currency: shipping.currency }
			: null,
		total: { amount: total.amount, currency: total.currency },
		shippingMethods,
		selectedShippingMethodId: node.deliveryMethod?.id ?? null,
		paymentGateways: (node.availablePaymentGateways ?? []).map((g) => ({
			id: g.id,
			name: g.name,
			currencies: g.currencies
		}))
	};
}

function mapCheckoutLine(line: SaleorCheckoutLineNode): CheckoutLineDisplay {
	return {
		id: line.id,
		quantity: line.quantity,
		variantId: line.variant.id,
		variantName: line.variant.name,
		productId: line.variant.product.id,
		productName: line.variant.product.name,
		productSlug: line.variant.product.slug,
		thumbnail: line.variant.product.thumbnail,
		unitPrice: {
			amount: line.variant.pricing.price.gross.amount,
			currency: line.variant.pricing.price.gross.currency
		},
		lineTotal: {
			amount: line.totalPrice.gross.amount,
			currency: line.totalPrice.gross.currency
		}
	};
}

function mapCheckout(node: SaleorCheckoutNode, voucherCodes: string[] = []): CheckoutDisplay {
	return {
		id: node.id,
		lines: node.lines.map(mapCheckoutLine),
		subtotal: {
			amount: node.totalPrice.gross.amount,
			currency: node.totalPrice.gross.currency
		},
		discount: node.discount
			? { amount: node.discount.amount, currency: node.discount.currency }
			: null,
		discountName: node.discountName ?? null,
		voucherCodes
	};
}

function saleorErrorsMessage(errors: Array<{ message: string }> | undefined): string | null {
	if (!errors?.length) return null;
	return errors.map((e) => e.message).join('; ');
}

export function getCheckoutId(cookies: Cookies): string | undefined {
	return cookies.get(CHECKOUT_COOKIE);
}

export function setCheckoutId(cookies: Cookies, id: string): void {
	cookies.set(CHECKOUT_COOKIE, id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearCheckoutId(cookies: Cookies): void {
	cookies.delete(CHECKOUT_COOKIE, { path: '/' });
}

export function getTransactionId(cookies: Cookies): string | undefined {
	return cookies.get(TRANSACTION_COOKIE);
}

export function setTransactionId(cookies: Cookies, id: string): void {
	cookies.set(TRANSACTION_COOKIE, id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24
	});
}

export function clearTransactionId(cookies: Cookies): void {
	cookies.delete(TRANSACTION_COOKIE, { path: '/' });
}

export function isPaymentAppConfigured(shipping: CheckoutShippingDisplay | null): boolean {
	return Boolean(shipping?.paymentGateways.length);
}

/** Map Stripe redirect query params for transactionProcess. */
export function stripeReturnDataFromUrl(
	searchParams: URLSearchParams
): Record<string, unknown> | undefined {
	const paymentIntent = searchParams.get('payment_intent');
	if (!paymentIntent) return undefined;

	const data: Record<string, unknown> = { paymentIntentId: paymentIntent };
	const clientSecret = searchParams.get('payment_intent_client_secret');
	if (clientSecret) data.paymentIntentClientSecret = clientSecret;
	const redirectStatus = searchParams.get('redirect_status');
	if (redirectStatus) data.redirectStatus = redirectStatus;
	return data;
}

/** Create an empty Saleor checkout. Returns checkout ID, or null when Saleor is disabled. */
export async function createCheckout(channel?: string): Promise<string | null> {
	if (!isSaleorEnabled()) return null;

	const resolvedChannel = channel ?? getChannelForLocale(config.defaultLocale);
	const result = await saleorFetch<{
		checkoutCreate: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_CREATE, { input: { channel: resolvedChannel, lines: [] } });

	if (result.errors?.length || result.data?.checkoutCreate.errors?.length) {
		return null;
	}

	return result.data?.checkoutCreate.checkout?.id ?? null;
}

/** Add a line to checkout. Returns updated checkout snapshot, or null when Saleor is disabled. */
export async function addCheckoutLine(
	checkoutId: string,
	variantId: string,
	quantity: number
): Promise<CheckoutDisplay | null> {
	if (!isSaleorEnabled()) return null;

	const result = await saleorFetch<{
		checkoutLinesAdd: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_LINES_ADD, {
		id: checkoutId,
		lines: [{ variantId, quantity }]
	});

	if (result.errors?.length || result.data?.checkoutLinesAdd.errors?.length) {
		return null;
	}

	const checkout = result.data?.checkoutLinesAdd.checkout;
	return checkout ? mapCheckout(checkout) : null;
}

/** Update line quantity on checkout. */
export async function updateCheckoutLine(
	checkoutId: string,
	lineId: string,
	quantity: number
): Promise<CheckoutDisplay | null> {
	if (!isSaleorEnabled()) return null;

	const result = await saleorFetch<{
		checkoutLinesUpdate: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_LINES_UPDATE, {
		id: checkoutId,
		lines: [{ lineId, quantity }]
	});

	if (result.errors?.length || result.data?.checkoutLinesUpdate.errors?.length) {
		return null;
	}

	const checkout = result.data?.checkoutLinesUpdate.checkout;
	return checkout ? mapCheckout(checkout) : null;
}

/** Remove a line from checkout. */
export async function deleteCheckoutLine(
	checkoutId: string,
	lineId: string
): Promise<CheckoutDisplay | null> {
	if (!isSaleorEnabled()) return null;

	const result = await saleorFetch<{
		checkoutLinesDelete: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_LINES_DELETE, {
		id: checkoutId,
		linesIds: [lineId]
	});

	if (result.errors?.length || result.data?.checkoutLinesDelete.errors?.length) {
		return null;
	}

	const checkout = result.data?.checkoutLinesDelete.checkout;
	return checkout ? mapCheckout(checkout) : null;
}

export type SaleorMutationResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** Update shipping address and return available methods. */
export async function updateShippingAddress(
	checkoutId: string,
	address: ShippingAddressInput
): Promise<SaleorMutationResult<CheckoutShippingDisplay>> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		checkoutShippingAddressUpdate: {
			checkout: SaleorCheckoutShippingNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_SHIPPING_ADDRESS_UPDATE, { id: checkoutId, shippingAddress: address });

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.checkoutShippingAddressUpdate.errors);
	if (message) return { ok: false, error: message };

	const checkout = result.data?.checkoutShippingAddressUpdate.checkout;
	if (!checkout) return { ok: false, error: 'Could not update shipping address.' };

	return { ok: true, data: mapCheckoutShipping(checkout) };
}

/** Select delivery method and return updated totals + payment gateways. */
export async function updateDeliveryMethod(
	checkoutId: string,
	deliveryMethodId: string
): Promise<SaleorMutationResult<CheckoutShippingDisplay>> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		checkoutDeliveryMethodUpdate: {
			checkout: SaleorCheckoutShippingNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_DELIVERY_METHOD_UPDATE, { id: checkoutId, deliveryMethodId });

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.checkoutDeliveryMethodUpdate.errors);
	if (message) return { ok: false, error: message };

	const checkout = result.data?.checkoutDeliveryMethodUpdate.checkout;
	if (!checkout) return { ok: false, error: 'Could not update delivery method.' };

	return { ok: true, data: mapCheckoutShipping(checkout) };
}

/** Read checkout shipping + payment readiness for checkout page. */
export async function getCheckoutShipping(
	checkoutId: string
): Promise<{ checkout: CheckoutDisplay; shipping: CheckoutShippingDisplay } | null> {
	if (!isSaleorEnabled()) return null;

	const result = await saleorFetch<{ checkout: SaleorCheckoutShippingNode | null }>(
		CHECKOUT_GET_SHIPPING,
		{ id: checkoutId }
	);

	if (result.errors?.length || !result.data?.checkout) return null;

	const node = result.data.checkout;
	return {
		checkout: mapCheckout(node),
		shipping: mapCheckoutShipping(node)
	};
}

export async function initializePaymentGateway(
	checkoutId: string,
	gatewayId: string,
	amount?: number
): Promise<SaleorMutationResult<Record<string, unknown>>> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		paymentGatewayInitialize: {
			gatewayConfigs: Array<{
				id: string;
				data: Record<string, unknown> | null;
				errors: Array<{ message: string }>;
			}>;
			errors: Array<{ message: string }>;
		};
	}>(PAYMENT_GATEWAY_INITIALIZE, {
		id: checkoutId,
		amount,
		paymentGateways: [{ id: gatewayId }]
	});

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.paymentGatewayInitialize.errors);
	if (message) return { ok: false, error: message };

	const configData = result.data?.paymentGatewayInitialize.gatewayConfigs.find(
		(g) => g.id === gatewayId
	)?.data;
	if (!configData) {
		return {
			ok: false,
			error: 'Payment gateway not available on this channel. Install a Payment App in Saleor.'
		};
	}

	return { ok: true, data: configData };
}

export async function initializeTransaction(
	checkoutId: string,
	gatewayId: string,
	amount: number,
	gatewayData?: Record<string, unknown>,
	idempotencyKey?: string
): Promise<
	SaleorMutationResult<{ transactionId: string; data: unknown; eventType: string | null }>
> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		transactionInitialize: {
			transaction: { id: string } | null;
			transactionEvent: { type: string } | null;
			data: unknown;
			errors: Array<{ message: string }>;
		};
	}>(TRANSACTION_INITIALIZE, {
		id: checkoutId,
		amount,
		paymentGateway: { id: gatewayId, data: gatewayData ?? {} },
		idempotencyKey
	});

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.transactionInitialize.errors);
	if (message) return { ok: false, error: message };

	const tx = result.data?.transactionInitialize.transaction;
	if (!tx) return { ok: false, error: 'Could not initialize payment transaction.' };

	return {
		ok: true,
		data: {
			transactionId: tx.id,
			data: result.data?.transactionInitialize.data,
			eventType: result.data?.transactionInitialize.transactionEvent?.type ?? null
		}
	};
}

export async function processTransaction(
	transactionId: string,
	data?: Record<string, unknown>
): Promise<SaleorMutationResult<{ eventType: string | null; data: unknown }>> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		transactionProcess: {
			transactionEvent: { type: string } | null;
			data: unknown;
			errors: Array<{ message: string }>;
		};
	}>(TRANSACTION_PROCESS, { id: transactionId, data: data ?? {} });

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.transactionProcess.errors);
	if (message) return { ok: false, error: message };

	return {
		ok: true,
		data: {
			eventType: result.data?.transactionProcess.transactionEvent?.type ?? null,
			data: result.data?.transactionProcess.data
		}
	};
}

export async function completeCheckout(
	checkoutId: string
): Promise<SaleorMutationResult<{ orderId: string }>> {
	if (!isSaleorEnabled()) return { ok: false, error: 'Saleor not configured' };

	const result = await saleorFetch<{
		checkoutComplete: {
			order: { id: string } | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_COMPLETE, { id: checkoutId });

	const message =
		saleorErrorsMessage(result.errors) ?? saleorErrorsMessage(result.data?.checkoutComplete.errors);
	if (message) return { ok: false, error: message };

	const orderId = result.data?.checkoutComplete.order?.id;
	if (!orderId) return { ok: false, error: 'Could not complete checkout.' };

	return { ok: true, data: { orderId } };
}

/** Read checkout lines for read-only cart display. */
export async function getCheckoutLines(checkoutId: string): Promise<CheckoutDisplay | null> {
	if (!isSaleorEnabled()) return null;

	const result = await saleorFetch<{ checkout: SaleorCheckoutNode | null }>(CHECKOUT_GET, {
		id: checkoutId
	});

	if (result.errors?.length || !result.data?.checkout) {
		return null;
	}

	return mapCheckout(result.data.checkout);
}

/** Ensure a Saleor checkout exists for promo / redeem flows. */
export async function ensureCheckout(
	cookies: Cookies,
	channel?: string
): Promise<{ checkoutId: string } | { error: string }> {
	let checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		checkoutId = (await createCheckout(channel)) ?? undefined;
		if (!checkoutId) return { error: 'Could not start checkout.' };
		setCheckoutId(cookies, checkoutId);
	}
	return { checkoutId };
}

/** Apply a Saleor voucher or gift card code to the active checkout. */
export async function applyPromoCode(
	checkoutId: string,
	promoCode: string,
	existingCodes: string[] = []
): Promise<{ checkout: CheckoutDisplay } | { error: string }> {
	if (!isSaleorEnabled()) return { error: 'Saleor not configured' };

	const result = await saleorFetch<{
		checkoutAddPromoCode: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_ADD_PROMO_CODE, { id: checkoutId, promoCode });

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.checkoutAddPromoCode.errors);
	if (message) return { error: message };

	const checkout = result.data?.checkoutAddPromoCode.checkout;
	if (!checkout) return { error: 'Invalid or expired code.' };

	const codes = [...new Set([...existingCodes, promoCode.trim().toUpperCase()])];
	return { checkout: mapCheckout(checkout, codes) };
}

/** Remove a promo code from checkout. */
export async function removePromoCode(
	checkoutId: string,
	promoCode: string,
	existingCodes: string[] = []
): Promise<{ checkout: CheckoutDisplay } | { error: string }> {
	if (!isSaleorEnabled()) return { error: 'Saleor not configured' };

	const result = await saleorFetch<{
		checkoutRemovePromoCode: {
			checkout: SaleorCheckoutNode | null;
			errors: Array<{ message: string }>;
		};
	}>(CHECKOUT_REMOVE_PROMO_CODE, { id: checkoutId, promoCode });

	const message =
		saleorErrorsMessage(result.errors) ??
		saleorErrorsMessage(result.data?.checkoutRemovePromoCode.errors);
	if (message) return { error: message };

	const checkout = result.data?.checkoutRemovePromoCode.checkout;
	if (!checkout) return { error: 'Could not remove code.' };

	const normalized = promoCode.trim().toUpperCase();
	const codes = existingCodes.filter((c) => c !== normalized);
	return { checkout: mapCheckout(checkout, codes) };
}
