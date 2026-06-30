import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests,
	upsertOrderSnapshot
} from '$lib/server/orders/snapshots';
import { load } from '../../src/routes/account/orders/+page.server';
import type { PageServerLoadEvent } from '../../src/routes/account/orders/$types';

function ordersEvent(session: { id: string } | null): PageServerLoadEvent {
	return { locals: { session } } as PageServerLoadEvent;
}

async function loadOrders(session: { id: string } | null) {
	const data = await load(ordersEvent(session));
	if (!data) throw new Error('orders load returned void');
	return data;
}

describe('account/orders load', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty orders when signed out', async () => {
		const data = await loadOrders(null);
		expect(data.orders).toEqual([]);
		expect(data.liveOrders).toBe(false);
	});

	it('returns empty orders for signed-in user with no snapshots', async () => {
		const data = await loadOrders({ id: 'user-1' });
		expect(data.orders).toEqual([]);
		expect(data.liveOrders).toBe(true);
	});

	it('returns synced order snapshots for signed-in user', async () => {
		await upsertOrderSnapshot({
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

		const data = await loadOrders({ id: 'user-1' });
		expect(data.orders).toHaveLength(1);
		expect(data.orders[0]?.orderNumber).toBe('AG-2001');
	});
});
