import type { Money } from '$lib/types/saleor';

/** Flattened checkout line for read-only cart display. */
export interface CheckoutLineDisplay {
	id: string;
	quantity: number;
	variantId: string;
	variantName: string;
	productId: string;
	productName: string;
	productSlug: string;
	thumbnail: { url: string; alt: string } | null;
	unitPrice: Money;
	lineTotal: Money;
}

/** Checkout snapshot for cart UI — subtotal from Saleor pricing. */
export interface CheckoutDisplay {
	id: string;
	lines: CheckoutLineDisplay[];
	subtotal: Money;
	/** Saleor voucher / promo discount when applied. */
	discount?: Money | null;
	discountName?: string | null;
	voucherCodes?: string[];
}

/** Mock promo applied to localStorage cart when Saleor is off. */
export interface MockPromoState {
	code: string;
	label: string;
	percentOff: number;
}
