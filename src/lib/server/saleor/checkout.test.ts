import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	CHECKOUT_COOKIE,
	addCheckoutLine,
	clearCheckoutId,
	createCheckout,
	getCheckoutId,
	getCheckoutLines,
	setCheckoutId
} from './checkout';

vi.mock('./client', () => ({
	isSaleorEnabled: vi.fn(() => true),
	saleorFetch: vi.fn()
}));

vi.mock('./channels', () => ({
	getChannelForLocale: vi.fn(() => 'us')
}));

import { isSaleorEnabled, saleorFetch } from './client';

const saleorCheckoutFixture = {
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

function mockCookies() {
	const store = new Map<string, string>();
	return {
		get: (name: string) => store.get(name),
		set: (name: string, value: string) => {
			store.set(name, value);
		},
		delete: (name: string) => {
			store.delete(name);
		}
	};
}

describe('checkout cookie helpers', () => {
	it('stores and clears checkout id in cookies', () => {
		const cookies = mockCookies();

		expect(getCheckoutId(cookies as never)).toBeUndefined();

		setCheckoutId(cookies as never, 'checkout-abc');
		expect(getCheckoutId(cookies as never)).toBe('checkout-abc');
		expect(cookies.get(CHECKOUT_COOKIE)).toBe('checkout-abc');

		clearCheckoutId(cookies as never);
		expect(getCheckoutId(cookies as never)).toBeUndefined();
	});
});

describe('createCheckout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns null when Saleor is disabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);

		expect(await createCheckout()).toBeNull();
		expect(saleorFetch).not.toHaveBeenCalled();
	});

	it('returns checkout id from Saleor response', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutCreate: { checkout: saleorCheckoutFixture, errors: [] } }
		});

		expect(await createCheckout('us')).toBe('checkout-1');
	});

	it('returns null when Saleor reports errors', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutCreate: { checkout: null, errors: [{ message: 'Channel not found' }] } }
		});

		expect(await createCheckout()).toBeNull();
	});
});

describe('addCheckoutLine', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('maps Saleor checkout lines to display shape', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutLinesAdd: { checkout: saleorCheckoutFixture, errors: [] } }
		});

		const checkout = await addCheckoutLine('checkout-1', 'variant-1', 2);

		expect(checkout).toMatchObject({
			id: 'checkout-1',
			subtotal: { amount: 59.98, currency: 'USD' },
			lines: [
				{
					variantId: 'variant-1',
					productSlug: 'garage-flag-tee',
					quantity: 2,
					lineTotal: { amount: 59.98, currency: 'USD' }
				}
			]
		});
	});

	it('returns null when line add fails', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			errors: [{ message: 'Network error' }]
		});

		expect(await addCheckoutLine('checkout-1', 'variant-1', 1)).toBeNull();
	});
});

describe('getCheckoutLines', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns mapped checkout for valid id', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkout: saleorCheckoutFixture }
		});

		const checkout = await getCheckoutLines('checkout-1');
		expect(checkout?.lines).toHaveLength(1);
	});

	it('returns null when checkout is missing', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkout: null }
		});

		expect(await getCheckoutLines('missing')).toBeNull();
	});
});
