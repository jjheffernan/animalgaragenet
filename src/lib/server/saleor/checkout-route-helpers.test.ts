import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn()
}));

import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	requireSaleorEnabled,
	requireSaleorPaymentEnabled,
	saleorDisabledResponse
} from './checkout-route-helpers';

describe('checkout route helpers', () => {
	it('saleorDisabledResponse returns structured 503 payload', async () => {
		const response = saleorDisabledResponse();
		expect(response.status).toBe(503);
		const body = await response.json();
		expect(body.code).toBe('SALEOR_DISABLED');
		expect(body.hint).toContain('PUBLIC_SALEOR_API_URL');
	});

	it('requireSaleorEnabled blocks when Saleor is off', () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
		const blocked = requireSaleorEnabled();
		expect(blocked?.status).toBe(503);
	});

	it('requireSaleorPaymentEnabled returns 501 when Saleor is off', () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
		const blocked = requireSaleorPaymentEnabled();
		expect(blocked?.status).toBe(501);
	});

	it('requireSaleorPaymentEnabled allows when Saleor is on', () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		expect(requireSaleorPaymentEnabled()).toBeNull();
	});
});
