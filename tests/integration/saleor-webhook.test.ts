import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: {} as Record<string, string | undefined>
}));

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

vi.mock('$lib/server/supabase/admin-users', () => ({
	findUserByEmail: vi.fn(),
	resolveUserIdByEmail: vi.fn()
}));

import { env } from '$env/dynamic/private';
import { createAdminClient } from '$lib/server/supabase/admin';
import { resolveUserIdByEmail } from '$lib/server/supabase/admin-users';
import { _resetMockStoreForTests, listOrderSnapshotsForUser } from '$lib/server/orders/snapshots';
import {
	_resetMockStoreForTests as resetRestock,
	createRestockAlert,
	listPendingRestockAlerts
} from '$lib/server/restock/repository';
import { POST } from '../../src/routes/api/webhooks/saleor/+server';

function sign(body: string, secret: string): string {
	return createHmac('sha256', secret).update(body, 'utf8').digest('hex');
}

function webhookEvent(
	body: Record<string, unknown>,
	options?: { event?: string; signature?: string; secret?: string }
) {
	const raw = JSON.stringify(body);
	const secret = options?.secret ?? 'saleor-test-secret';
	const headers: Record<string, string> = {
		'content-type': 'application/json',
		'saleor-event': options?.event ?? 'ORDER_CREATED'
	};
	if (options?.signature !== '') {
		headers['saleor-signature'] = options?.signature ?? sign(raw, secret);
	}

	return {
		request: new Request('http://localhost/api/webhooks/saleor', {
			method: 'POST',
			headers,
			body: raw
		})
	};
}

describe('POST /api/webhooks/saleor', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
		resetRestock();
		env.SALEOR_WEBHOOK_SECRET = 'saleor-test-secret';
	});

	afterEach(() => {
		vi.clearAllMocks();
		delete env.SALEOR_WEBHOOK_SECRET;
	});

	it('mirrors ORDER_CREATED when signature is valid', async () => {
		vi.mocked(resolveUserIdByEmail).mockResolvedValue('user-1');

		const payload = {
			order: {
				id: 'saleor-ord-99',
				number: '99',
				status: 'UNFULFILLED',
				created: '2026-06-28T12:00:00.000Z',
				userEmail: 'driver@example.com',
				total: { gross: { amount: 25, currency: 'USD' } },
				lines: [{ productName: 'Sticker', quantity: 2, unitPrice: { gross: { amount: 12.5 } } }]
			}
		};

		const response = await POST(webhookEvent(payload) as Parameters<typeof POST>[0]);
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result).toEqual({ ok: true, orderNumber: 'AG-99' });

		const orders = await listOrderSnapshotsForUser('user-1');
		expect(orders).toHaveLength(1);
	});

	it('rejects missing signature when secret is configured', async () => {
		const response = await POST(
			webhookEvent({ order: { id: 'x' } }, { signature: '' }) as Parameters<typeof POST>[0]
		);
		expect(response.status).toBe(401);
	});

	it('notifies restock alerts on PRODUCT_VARIANT_BACK_IN_STOCK', async () => {
		await createRestockAlert({
			email: 'fan@example.com',
			productId: 'prod-42',
			productSlug: 'garage-tee'
		});

		const payload = {
			productVariant: {
				id: 'variant-42',
				quantity: 2,
				product: { id: 'prod-42', slug: 'garage-tee', name: 'Garage Tee' }
			}
		};

		const response = await POST(
			webhookEvent(payload, { event: 'PRODUCT_VARIANT_BACK_IN_STOCK' }) as Parameters<
				typeof POST
			>[0]
		);
		const result = await response.json();

		expect(response.status).toBe(200);
		expect(result).toEqual({ ok: true, notified: 1, productId: 'prod-42' });

		const pending = await listPendingRestockAlerts('prod-42');
		expect(pending).toHaveLength(0);
	});

	it('ignores non-order events', async () => {
		const response = await POST(
			webhookEvent({ product: { id: 'p1' } }, { event: 'PRODUCT_UPDATED' }) as Parameters<
				typeof POST
			>[0]
		);
		const result = await response.json();
		expect(response.status).toBe(200);
		expect(result).toEqual({ ok: true, ignored: 'PRODUCT_UPDATED' });
	});
});
