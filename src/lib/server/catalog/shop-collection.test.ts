import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockCollections } from '$lib/data/mock/collections';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import {
	getShopCollectionOptions,
	getShopProductsByCollection,
	mockShopCollections,
	resolveShopCollection
} from './shop-collection';

describe('shop collection filter', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('mockShopCollections mirrors mock catalog slugs', () => {
		const options = mockShopCollections();
		expect(options[0]?.slug).toBe(mockCollections[0]?.slug);
		expect(options[0]?.source).toBe('mock');
	});

	it('resolveShopCollection matches slug case-insensitively', () => {
		const options = mockShopCollections();
		const match = resolveShopCollection('STAFF-PICKS', options);
		expect(match?.slug).toBe('staff-picks');
	});

	it('getShopCollectionOptions returns mock when Saleor disabled', async () => {
		const options = await getShopCollectionOptions();
		expect(options.length).toBeGreaterThan(0);
		expect(options.every((o) => o.source === 'mock')).toBe(true);
		expect(saleorFetch).not.toHaveBeenCalled();
	});

	it('getShopProductsByCollection returns mock collection products', async () => {
		const slug = mockCollections[0]?.slug ?? 'staff-picks';
		const products = await getShopProductsByCollection(slug);
		expect(products.length).toBeGreaterThan(0);
	});

	it('getShopCollectionOptions uses Saleor collections when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				collections: {
					edges: [{ node: { id: 'c1', name: 'Summer Drop', slug: 'summer-drop' } }]
				}
			}
		});

		const options = await getShopCollectionOptions('en-US');
		expect(options).toEqual([{ slug: 'summer-drop', label: 'Summer Drop', source: 'saleor' }]);
	});

	it('getShopProductsByCollection maps Saleor product nodes', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
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

		const products = await getShopProductsByCollection('summer-drop');
		expect(products).toHaveLength(1);
		expect(products[0]?.slug).toBe('garage-tee');
		expect(products[0]?.pricing.priceRange.start.amount).toBe(29.99);
	});
});
