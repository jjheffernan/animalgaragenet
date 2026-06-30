import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckoutDisplay, CheckoutLineDisplay } from '$lib/types/checkout';
import {
	CHECKOUT_ADD_PROMO_CODE,
	CHECKOUT_CREATE,
	CHECKOUT_LINES_ADD,
	CHECKOUT_REMOVE_PROMO_CODE
} from '$lib/server/saleor/checkout-queries';
import { addCheckoutLine, applyPromoCode } from '$lib/server/saleor/checkout';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => true),
	saleorFetch: vi.fn()
}));

import { saleorFetch } from '$lib/server/saleor/client';

const CHECKOUT_LINE_KEYS: (keyof CheckoutLineDisplay)[] = [
	'id',
	'quantity',
	'variantId',
	'variantName',
	'productId',
	'productName',
	'productSlug',
	'thumbnail',
	'unitPrice',
	'lineTotal'
];

const CHECKOUT_DISPLAY_KEYS: (keyof CheckoutDisplay)[] = [
	'id',
	'lines',
	'subtotal',
	'discount',
	'discountName',
	'voucherCodes'
];

function assertGraphqlContract(
	query: string,
	opts: { operation: string; rootField: string; variables: string[]; selectionFields: string[] }
): void {
	expect(typeof query).toBe('string');
	expect(query.trim().length).toBeGreaterThan(0);
	expect(query).toContain(opts.operation);
	for (const variable of opts.variables) {
		expect(query).toContain(variable);
	}
	expect(query).toContain(opts.rootField);
	for (const field of opts.selectionFields) {
		expect(query).toContain(field);
	}
	expect(query).toContain('errors');
}

const saleorCheckoutNode = {
	id: 'checkout-1',
	lines: [
		{
			id: 'line-1',
			quantity: 2,
			variant: {
				id: 'variant-1',
				name: 'Medium',
				pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } },
				product: {
					id: 'product-1',
					name: 'Garage Flag Tee',
					slug: 'garage-flag-tee',
					thumbnail: { url: 'https://cdn.example.com/tee.jpg', alt: 'Tee' }
				}
			},
			totalPrice: { gross: { amount: 59.98, currency: 'USD' } }
		}
	],
	totalPrice: { gross: { amount: 59.98, currency: 'USD' } }
};

const saleorCheckoutWithPromo = {
	...saleorCheckoutNode,
	discount: { amount: 5.99, currency: 'USD' },
	discountName: 'GARAGE10'
};

function assertCheckoutDisplayShape(checkout: CheckoutDisplay): void {
	for (const key of CHECKOUT_DISPLAY_KEYS) {
		expect(checkout).toHaveProperty(key);
	}
	expect(checkout.lines).toHaveLength(1);
	for (const key of CHECKOUT_LINE_KEYS) {
		expect(checkout.lines[0]).toHaveProperty(key);
	}
	expect(checkout.subtotal).toMatchObject({
		amount: expect.any(Number),
		currency: expect.any(String)
	});
	expect(checkout.lines[0]?.unitPrice).toMatchObject({
		amount: expect.any(Number),
		currency: expect.any(String)
	});
	expect(checkout.lines[0]?.lineTotal).toMatchObject({
		amount: expect.any(Number),
		currency: expect.any(String)
	});
}

describe('saleor-checkout GraphQL contracts', () => {
	it('CHECKOUT_CREATE is a valid mutation with required fields', () => {
		assertGraphqlContract(CHECKOUT_CREATE, {
			operation: 'mutation CheckoutCreate',
			rootField: 'checkoutCreate',
			variables: ['$input: CheckoutCreateInput!'],
			selectionFields: ['id', 'lines', 'totalPrice', 'variant', 'product', 'thumbnail']
		});
	});

	it('CHECKOUT_LINES_ADD is a valid mutation with required fields', () => {
		assertGraphqlContract(CHECKOUT_LINES_ADD, {
			operation: 'mutation CheckoutLinesAdd',
			rootField: 'checkoutLinesAdd',
			variables: ['$id: ID!', '$lines: [CheckoutLineInput!]!'],
			selectionFields: ['id', 'lines', 'quantity', 'totalPrice']
		});
	});

	it('CHECKOUT_ADD_PROMO_CODE is a valid mutation with discount fields', () => {
		assertGraphqlContract(CHECKOUT_ADD_PROMO_CODE, {
			operation: 'mutation CheckoutAddPromoCode',
			rootField: 'checkoutAddPromoCode',
			variables: ['$id: ID!', '$promoCode: String!'],
			selectionFields: ['discount', 'discountName', 'totalPrice']
		});
	});

	it('CHECKOUT_REMOVE_PROMO_CODE is a valid mutation with discount fields', () => {
		assertGraphqlContract(CHECKOUT_REMOVE_PROMO_CODE, {
			operation: 'mutation CheckoutRemovePromoCode',
			rootField: 'checkoutRemovePromoCode',
			variables: ['$id: ID!', '$promoCode: String!'],
			selectionFields: ['discount', 'discountName']
		});
	});
});

describe('mapCheckout output contract', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('addCheckoutLine returns CheckoutDisplay shape', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutLinesAdd: { checkout: saleorCheckoutNode, errors: [] } }
		});

		const checkout = await addCheckoutLine('checkout-1', 'variant-1', 2);
		expect(checkout).not.toBeNull();
		assertCheckoutDisplayShape(checkout!);
		expect(checkout).toMatchObject({
			id: 'checkout-1',
			discount: null,
			discountName: null,
			voucherCodes: []
		});
	});

	it('applyPromoCode maps discount fields into CheckoutDisplay', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutAddPromoCode: { checkout: saleorCheckoutWithPromo, errors: [] } }
		});

		const result = await applyPromoCode('checkout-1', 'garage10');
		expect('checkout' in result).toBe(true);
		if (!('checkout' in result)) return;

		assertCheckoutDisplayShape(result.checkout);
		expect(result.checkout.discount).toEqual({ amount: 5.99, currency: 'USD' });
		expect(result.checkout.discountName).toBe('GARAGE10');
		expect(result.checkout.voucherCodes).toEqual(['GARAGE10']);
	});
});
