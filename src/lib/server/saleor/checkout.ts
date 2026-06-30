import type { Cookies } from '@sveltejs/kit';
import type { CheckoutDisplay, CheckoutLineDisplay } from '$lib/types/checkout';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import {
	CHECKOUT_CREATE,
	CHECKOUT_GET,
	CHECKOUT_LINES_ADD
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

function mapCheckout(node: SaleorCheckoutNode): CheckoutDisplay {
	return {
		id: node.id,
		lines: node.lines.map(mapCheckoutLine),
		subtotal: {
			amount: node.totalPrice.gross.amount,
			currency: node.totalPrice.gross.currency
		}
	};
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
