import type { Cookies } from '@sveltejs/kit';
import type { CheckoutDisplay, CheckoutLineDisplay } from '$lib/types/checkout';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import {
	CHECKOUT_ADD_PROMO_CODE,
	CHECKOUT_CREATE,
	CHECKOUT_GET,
	CHECKOUT_LINES_ADD,
	CHECKOUT_LINES_DELETE,
	CHECKOUT_LINES_UPDATE,
	CHECKOUT_REMOVE_PROMO_CODE
} from '$lib/server/saleor/checkout-queries';
import { config } from '$lib/config/env';

export const CHECKOUT_COOKIE = 'ag-checkout-id';

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

// @saleor-migration: intentional — uncomment for payment redirect; see docs/commerce/saleor.md#quick-migration
// export async function completeCheckout(checkoutId: string): Promise<{ orderId: string } | null> {
// 	if (!isSaleorEnabled()) return null;
// 	const result = await saleorFetch<{ checkoutComplete: { order: { id: string } | null; errors: Array<{ message: string }> } }>(
// 		CHECKOUT_COMPLETE,
// 		{ id: checkoutId }
// 	);
// 	if (result.errors?.length || result.data?.checkoutComplete.errors?.length) return null;
// 	const orderId = result.data?.checkoutComplete.order?.id;
// 	return orderId ? { orderId } : null;
// }

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
