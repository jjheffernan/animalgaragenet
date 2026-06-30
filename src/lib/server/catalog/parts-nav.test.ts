import { describe, expect, it, vi } from 'vitest';
import { mockBrands } from '$lib/data/mock/brands';
import { mockPartCategories } from '$lib/data/mock/part-categories';
import { mockPopularModels } from '$lib/data/mock/popular-models';
import { getPartsNavData } from './parts-nav';

vi.mock('$lib/server/catalog/parts', () => ({
	getPartCategoriesForNav: vi.fn(async () => mockPartCategories)
}));

describe('getPartsNavData', () => {
	it('assembles categories, brands, and popular models', async () => {
		const data = await getPartsNavData('en-US');

		expect(data.categories).toEqual(mockPartCategories);
		expect(data.brands).toEqual(mockBrands);
		expect(data.popularModels).toEqual(mockPopularModels);
		expect(data.categories.length).toBeGreaterThan(0);
		expect(data.brands.length).toBeGreaterThan(0);
		expect(data.popularModels.length).toBeGreaterThan(0);
	});
});
