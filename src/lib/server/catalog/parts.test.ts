import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mockPartCategories } from '$lib/data/mock/part-categories';
import { getPartCategoriesForNav, getPartCategoryBySlug } from '$lib/server/catalog/parts';
import { mapPartCategory } from '$lib/server/saleor/mappers';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';

describe('getPartCategoriesForNav', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock taxonomy when Saleor is disabled', async () => {
		const categories = await getPartCategoriesForNav();
		expect(categories).toEqual(mockPartCategories);
		expect(saleorFetch).not.toHaveBeenCalled();
	});

	it('returns Saleor categories when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				categories: {
					edges: [
						{
							node: {
								id: 'cat-1',
								name: 'Wheels',
								slug: 'wheels',
								children: {
									edges: [{ node: { id: 'child-1', name: 'Forged', slug: 'forged' } }]
								}
							}
						}
					]
				}
			}
		});

		const categories = await getPartCategoriesForNav();
		expect(categories).toEqual([
			mapPartCategory({
				id: 'cat-1',
				name: 'Wheels',
				slug: 'wheels',
				children: {
					edges: [{ node: { id: 'child-1', name: 'Forged', slug: 'forged' } }]
				}
			})
		]);
	});

	it('falls back to mock when Saleor errors', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockRejectedValue(new Error('network'));

		const categories = await getPartCategoriesForNav();
		expect(categories).toEqual(mockPartCategories);
	});
});

describe('getPartCategoryBySlug', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	it('resolves top-level and child slugs from nav taxonomy', async () => {
		const wheels = await getPartCategoryBySlug('wheels');
		expect(wheels?.name).toBe('Wheels');

		const coilovers = await getPartCategoryBySlug('coilovers');
		expect(coilovers?.name).toBe('Coilovers');
	});
});
