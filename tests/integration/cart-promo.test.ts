import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/routes/cart/checkout/promo/+server';
import type { RequestEvent } from '../../src/routes/cart/checkout/promo/$types';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn()
}));

vi.mock('$lib/server/checkout/promo', () => ({
	redeemCode: vi.fn()
}));

import { isSaleorEnabled } from '$lib/server/saleor/client';
import { redeemCode } from '$lib/server/checkout/promo';

function promoEvent(body: unknown): RequestEvent {
	const request = new Request('http://localhost/cart/checkout/promo', {
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
	return {
		request,
		cookies,
		url: new URL(request.url),
		getClientAddress: () => '127.0.0.1'
	} as unknown as RequestEvent;
}

describe('POST /cart/checkout/promo', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock promo when Saleor is disabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
		vi.mocked(redeemCode).mockResolvedValue({
			ok: true,
			message: 'Applied: 10% off your order',
			mockPromo: { code: 'GARAGE10', label: '10% off your order', percentOff: 10 }
		});

		const response = await POST(promoEvent({ code: 'GARAGE10' }));
		const payload = await response.json();

		expect(response.status).toBe(200);
		expect(payload.mockPromo.code).toBe('GARAGE10');
	});

	it('returns 400 for invalid codes', async () => {
		vi.mocked(redeemCode).mockResolvedValue({ ok: false, message: 'Invalid or expired code.' });

		const response = await POST(promoEvent({ code: 'BAD' }));
		expect(response.status).toBe(400);
	});
});
