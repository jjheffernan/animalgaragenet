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

/** Shipping rate from Saleor after address is set. */
export interface ShippingMethodDisplay {
	id: string;
	name: string;
	price: Money;
}

/** Payment gateway exposed on checkout after delivery method is selected. */
export interface PaymentGatewayDisplay {
	id: string;
	name: string;
	currencies: string[];
}

/** Checkout snapshot for the shipping + payment steps. */
export interface CheckoutShippingDisplay {
	id: string;
	subtotal: Money;
	shippingPrice: Money | null;
	total: Money;
	shippingMethods: ShippingMethodDisplay[];
	selectedShippingMethodId: string | null;
	paymentGateways: PaymentGatewayDisplay[];
}

/** Address payload for checkoutShippingAddressUpdate. */
export interface ShippingAddressInput {
	firstName: string;
	lastName: string;
	streetAddress1: string;
	city: string;
	countryArea: string;
	postalCode: string;
	country: string;
}
