import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

vi.mock('$lib/server/supabase/admin-users', () => ({
	findUserByEmail: vi.fn(),
	resolveUserIdByEmail: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { resolveUserIdByEmail } from '$lib/server/supabase/admin-users';
import { _resetMockStoreForTests, listOrderSnapshotsForUser } from '$lib/server/orders/snapshots';
import {
	extractSaleorOrderFromPayload,
	isOrderMirrorEvent,
	mapSaleorOrderStatus,
	mirrorSaleorOrderPayload
} from './order-webhook';

describe('mapSaleorOrderStatus', () => {
	it('maps fulfillment states to account statuses', () => {
		expect(mapSaleorOrderStatus('UNFULFILLED')).toBe('processing');
		expect(mapSaleorOrderStatus('FULFILLED', [{ trackingNumber: '1Z999' }])).toBe('shipped');
		expect(mapSaleorOrderStatus('CANCELED')).toBe('cancelled');
	});
});

describe('extractSaleorOrderFromPayload', () => {
	it('parses nested order payload', () => {
		const parsed = extractSaleorOrderFromPayload({
			order: {
				id: 'T3JkZXI6MQ==',
				number: '2001',
				status: 'UNFULFILLED',
				created: '2026-06-28T12:00:00.000Z',
				userEmail: 'driver@example.com',
				total: { gross: { amount: 54.99, currency: 'USD' } },
				lines: [{ productName: 'Hoodie', quantity: 1, unitPrice: { gross: { amount: 54.99 } } }]
			}
		});

		expect(parsed).toMatchObject({
			saleorOrderId: 'T3JkZXI6MQ==',
			orderNumber: 'AG-2001',
			status: 'processing',
			totalCents: 5499,
			currency: 'USD',
			userEmail: 'driver@example.com'
		});
		expect(parsed?.lines).toHaveLength(1);
	});
});

describe('mirrorSaleorOrderPayload', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('skips when no matching Supabase user', async () => {
		vi.mocked(resolveUserIdByEmail).mockResolvedValue(null);

		const result = await mirrorSaleorOrderPayload({
			order: {
				id: 'saleor-ord-1',
				number: '42',
				status: 'UNFULFILLED',
				created: '2026-06-28T12:00:00.000Z',
				userEmail: 'missing@example.com',
				total: { gross: { amount: 10, currency: 'USD' } },
				lines: []
			}
		});

		expect(result).toEqual({ ok: true, skipped: true, reason: 'no_matching_user' });
	});

	it('upserts snapshot for resolved user in mock mode', async () => {
		vi.mocked(resolveUserIdByEmail).mockResolvedValue('user-1');

		const result = await mirrorSaleorOrderPayload({
			order: {
				id: 'saleor-ord-1',
				number: '42',
				status: 'FULFILLED',
				created: '2026-06-28T12:00:00.000Z',
				userEmail: 'driver@example.com',
				total: { gross: { amount: 54.99, currency: 'USD' } },
				fulfillments: [{ trackingNumber: '1Z999' }],
				lines: [{ productName: 'Hoodie', quantity: 1, unitPrice: { gross: { amount: 54.99 } } }]
			}
		});

		expect(result).toEqual({ ok: true, orderNumber: 'AG-42' });

		const orders = await listOrderSnapshotsForUser('user-1');
		expect(orders).toHaveLength(1);
		expect(orders[0]?.status).toBe('shipped');
		expect(orders[0]?.trackingNumber).toBe('1Z999');
	});
});

describe('isOrderMirrorEvent', () => {
	it('recognizes order mirror webhook events', () => {
		expect(isOrderMirrorEvent('ORDER_CREATED')).toBe(true);
		expect(isOrderMirrorEvent('order_fulfilled')).toBe(true);
		expect(isOrderMirrorEvent('PRODUCT_UPDATED')).toBe(false);
	});
});
