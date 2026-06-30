import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

vi.mock('$lib/server/catalog/fallback', () => ({
	guardMockCatalogFallback: vi.fn()
}));

import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { searchCatalog } from '$lib/server/catalog/search';

describe('searchCatalog', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty results for blank query', async () => {
		const results = await searchCatalog('   ');
		expect(results).toEqual({ products: [], parts: [], builds: [], guides: [] });
	});

	it('searches merged mock catalog server-side', async () => {
		const results = await searchCatalog('civic');
		expect(results.products.length + results.parts.length + results.builds.length).toBeGreaterThan(
			0
		);
	});

	it('uses Saleor PRODUCT_SEARCH_QUERY when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				products: {
					edges: [
						{
							node: {
								id: 'prod-1',
								name: 'Civic Intake',
								slug: 'civic-intake',
								description: 'Cold air for FK8',
								thumbnail: { url: 'https://example.com/intake.jpg', alt: 'Intake' },
								pricing: {
									priceRange: { start: { gross: { amount: 399, currency: 'USD' } } }
								},
								category: { id: 'cat-1', name: 'Intake', slug: 'intake' },
								variants: [
									{
										id: 'var-1',
										name: 'Default',
										sku: 'INTAKE-1',
										pricing: { price: { gross: { amount: 399, currency: 'USD' } } }
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
		});

		const results = await searchCatalog('civic');
		expect(results.products).toHaveLength(1);
		expect(results.products[0]?.slug).toBe('civic-intake');
		expect(saleorFetch).toHaveBeenCalledWith(
			expect.stringContaining('ProductSearch'),
			expect.objectContaining({ query: 'civic', first: 24 })
		);
	});
});
