import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockCollections } from '$lib/data/mock/collections';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

vi.mock('$lib/server/catalog/fallback', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/catalog/fallback')>();
	return { ...actual, guardMockCatalogFallback: vi.fn() };
});

import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { getCollections } from './collections';

describe('getCollections', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock collections when Saleor is disabled', async () => {
		const collections = await getCollections();
		expect(collections[0]?.slug).toBe(mockCollections[0]?.slug);
		expect(saleorFetch).not.toHaveBeenCalled();
	});

	it('populates products[] from COLLECTION_PRODUCTS_QUERY when Saleor is enabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch)
			.mockResolvedValueOnce({
				data: {
					collections: {
						edges: [{ node: { id: 'c1', name: 'Summer Drop', slug: 'summer-drop' } }]
					}
				}
			})
			.mockResolvedValueOnce({
				data: {
					collection: {
						products: {
							edges: [
								{
									node: {
										id: 'prod-1',
										name: 'Garage Tee',
										slug: 'garage-tee',
										description: '',
										thumbnail: { url: 'https://example.com/tee.jpg', alt: 'Tee' },
										pricing: {
											priceRange: { start: { gross: { amount: 29.99, currency: 'USD' } } }
										},
										category: { id: 'cat-1', name: 'Apparel', slug: 'apparel' },
										variants: [
											{
												id: 'var-1',
												name: 'M',
												sku: 'TEE-M',
												pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } }
											}
										],
										isAvailableForPurchase: true,
										metadata: [],
										attributes: []
									}
								}
							]
						}
					}
				}
			});

		const collections = await getCollections('en-US');
		expect(collections).toHaveLength(1);
		expect(collections[0]?.slug).toBe('summer-drop');
		expect(collections[0]?.products).toHaveLength(1);
		expect(collections[0]?.products[0]?.slug).toBe('garage-tee');
		expect(saleorFetch).toHaveBeenCalledTimes(2);
	});
});
