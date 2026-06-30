import { describe, expect, it, vi } from 'vitest';
import {
	extractStockWebhookFromPayload,
	isStockRestockEvent,
	processStockRestockPayload
} from '$lib/server/saleor/stock-webhook';

vi.mock('$lib/server/restock/repository', () => ({
	listPendingRestockAlerts: vi.fn(),
	markRestockAlertsNotified: vi.fn()
}));

import {
	listPendingRestockAlerts,
	markRestockAlertsNotified
} from '$lib/server/restock/repository';

describe('stock webhook parsing', () => {
	it('recognizes stock restock events', () => {
		expect(isStockRestockEvent('PRODUCT_VARIANT_BACK_IN_STOCK')).toBe(true);
		expect(isStockRestockEvent('product_variant_stock_updated')).toBe(true);
		expect(isStockRestockEvent('ORDER_CREATED')).toBe(false);
	});

	it('extracts product id and quantity from variant payload', () => {
		const parsed = extractStockWebhookFromPayload({
			productVariant: {
				id: 'variant-1',
				quantity: 5,
				product: { id: 'prod-1', slug: 'garage-tee', name: 'Garage Tee' }
			}
		});

		expect(parsed).toEqual({
			productId: 'prod-1',
			productSlug: 'garage-tee',
			productName: 'Garage Tee',
			variantId: 'variant-1',
			quantity: 5
		});
	});

	it('returns null for unrecognized payload', () => {
		expect(extractStockWebhookFromPayload({ foo: 'bar' })).toBeNull();
	});
});

describe('processStockRestockPayload', () => {
	it('skips when quantity is zero', async () => {
		const result = await processStockRestockPayload({
			productVariant: {
				id: 'v1',
				quantity: 0,
				product: { id: 'prod-1' }
			}
		});

		expect(result).toEqual({ ok: true, skipped: true, reason: 'not_in_stock' });
	});

	it('notifies pending alerts and marks them notified', async () => {
		vi.mocked(listPendingRestockAlerts).mockResolvedValue([
			{
				id: 'alert-1',
				email: 'fan@example.com',
				productId: 'prod-1',
				productSlug: 'garage-tee',
				productName: 'Garage Tee',
				variantId: null,
				userId: null,
				createdAt: '2026-06-30T00:00:00.000Z',
				notifiedAt: null
			}
		]);
		vi.mocked(markRestockAlertsNotified).mockResolvedValue(true);

		const result = await processStockRestockPayload({
			productVariant: {
				id: 'v1',
				quantity: 3,
				product: { id: 'prod-1', slug: 'garage-tee', name: 'Garage Tee' }
			}
		});

		expect(result).toEqual({ ok: true, notified: 1, productId: 'prod-1' });
		expect(markRestockAlertsNotified).toHaveBeenCalledWith(['alert-1']);
	});
});
