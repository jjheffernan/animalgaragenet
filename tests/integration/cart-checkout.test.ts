import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/routes/cart/checkout/+server';
import type { RequestEvent } from '../../src/routes/cart/checkout/$types';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn()
}));

vi.mock('$lib/server/saleor/checkout', () => ({
	getCheckoutId: vi.fn(),
	setCheckoutId: vi.fn(),
	createCheckout: vi.fn(),
	addCheckoutLine: vi.fn()
}));

vi.mock('$lib/server/saleor/channels', () => ({
	getChannelForLocale: vi.fn(() => 'us')
}));

import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	addCheckoutLine,
	createCheckout,
	getCheckoutId,
	setCheckoutId
} from '$lib/server/saleor/checkout';

function checkoutEvent(body: unknown, locale = 'en-US'): RequestEvent {
	const request = new Request(`http://localhost/cart/checkout?locale=${locale}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const cookies = {
		get: vi.fn(),
		set: vi.fn(),
		delete: vi.fn(),
		getAll: vi.fn(() => []),
		serialize: vi.fn()
	};
	return { request, cookies, url: new URL(request.url) } as unknown as RequestEvent;
}

describe('POST /cart/checkout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns 503 when Saleor is not configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);

		const response = await POST(checkoutEvent({ variantId: 'variant-1' }));
		expect(response.status).toBe(503);
	});

	it('returns 400 when variantId is missing', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);

		const response = await POST(checkoutEvent({ quantity: 2 }));
		expect(response.status).toBe(400);
	});

	it('creates checkout and adds a line on success', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(getCheckoutId).mockReturnValue(undefined);
		vi.mocked(createCheckout).mockResolvedValue('checkout-new');
		vi.mocked(addCheckoutLine).mockResolvedValue({
			id: 'checkout-new',
			lines: [],
			subtotal: { amount: 29.99, currency: 'USD' }
		});

		const response = await POST(checkoutEvent({ variantId: 'variant-1', quantity: 2 }));
		const payload = await response.json();

		expect(response.status).toBe(200);
		expect(createCheckout).toHaveBeenCalledWith('us');
		expect(addCheckoutLine).toHaveBeenCalledWith('checkout-new', 'variant-1', 2);
		expect(setCheckoutId).toHaveBeenCalled();
		expect(payload.checkout.id).toBe('checkout-new');
	});

	it('reuses existing checkout cookie when present', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(getCheckoutId).mockReturnValue('checkout-existing');
		vi.mocked(addCheckoutLine).mockResolvedValue({
			id: 'checkout-existing',
			lines: [],
			subtotal: { amount: 19.99, currency: 'USD' }
		});

		await POST(checkoutEvent({ variantId: 'variant-2' }));

		expect(createCheckout).not.toHaveBeenCalled();
		expect(addCheckoutLine).toHaveBeenCalledWith('checkout-existing', 'variant-2', 1);
	});

	it('returns 502 when checkout creation fails', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(getCheckoutId).mockReturnValue(undefined);
		vi.mocked(createCheckout).mockResolvedValue(null);

		const response = await POST(checkoutEvent({ variantId: 'variant-1' }));
		expect(response.status).toBe(502);
	});
});
