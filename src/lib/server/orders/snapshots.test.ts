import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests,
	listOrderSnapshotsForUser,
	upsertOrderSnapshot
} from './snapshots';

describe('order snapshots repository', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('listOrderSnapshotsForUser returns empty when no snapshots', async () => {
		const orders = await listOrderSnapshotsForUser('user-1');
		expect(orders).toEqual([]);
	});

	it('upsertOrderSnapshot stores and lists by user in mock mode', async () => {
		const saved = await upsertOrderSnapshot({
			userId: 'user-1',
			saleorOrderId: 'saleor-ord-1',
			orderNumber: 'AG-2001',
			status: 'processing',
			totalCents: 5499,
			currency: 'USD',
			trackingNumber: null,
			lines: [{ productName: 'Hoodie', quantity: 1, unitPrice: 54.99 }],
			orderedAt: '2026-06-28T12:00:00.000Z'
		});
		expect(saved?.orderNumber).toBe('AG-2001');

		const orders = await listOrderSnapshotsForUser('user-1');
		expect(orders).toHaveLength(1);
		expect(orders[0]?.saleorOrderId).toBe('saleor-ord-1');
	});

	it('upsertOrderSnapshot dedupes by saleorOrderId in mock mode', async () => {
		await upsertOrderSnapshot({
			userId: 'user-1',
			saleorOrderId: 'saleor-ord-1',
			orderNumber: 'AG-2001',
			status: 'processing',
			totalCents: 5499,
			currency: 'USD',
			trackingNumber: null,
			lines: [],
			orderedAt: '2026-06-28T12:00:00.000Z'
		});
		const updated = await upsertOrderSnapshot({
			userId: 'user-1',
			saleorOrderId: 'saleor-ord-1',
			orderNumber: 'AG-2001',
			status: 'shipped',
			totalCents: 5499,
			currency: 'USD',
			trackingNumber: '1Z999',
			lines: [],
			orderedAt: '2026-06-28T12:00:00.000Z'
		});
		expect(updated?.status).toBe('shipped');
		expect(updated?.trackingNumber).toBe('1Z999');

		const orders = await listOrderSnapshotsForUser('user-1');
		expect(orders).toHaveLength(1);
	});
});
