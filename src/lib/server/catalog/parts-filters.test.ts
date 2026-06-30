import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockBrands } from '$lib/data/mock/brands';
import { mockParts } from '$lib/data/mock/parts';
import { PARTS_BUILD_TYPES } from '$lib/data/parts-filters';
import {
	applyPartsFilters,
	derivePartsFacetsFromProducts,
	getPartsFilterOptions,
	loadPartsCatalog
} from '$lib/server/catalog/parts-filters';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

vi.mock('$lib/server/catalog/parts', () => ({
	getPartsByCategory: vi.fn(),
	getPartsProducts: vi.fn()
}));

import { isSaleorEnabled } from '$lib/server/saleor/client';
import { getPartsByCategory, getPartsProducts } from '$lib/server/catalog/parts';

describe('derivePartsFacetsFromProducts', () => {
	it('collects brand and build facets from product attributes', () => {
		const facets = derivePartsFacetsFromProducts(mockParts.slice(0, 12));

		expect(facets).toHaveLength(2);
		expect(facets[0]?.key).toBe('brand');
		expect(facets[0]?.options.length).toBeGreaterThan(0);
		expect(facets[1]?.key).toBe('build');
	});
});

describe('getPartsFilterOptions', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock facets when Saleor is disabled', async () => {
		const options = await getPartsFilterOptions();

		expect(options.source).toBe('mock');
		expect(options.facets[0]?.options).toHaveLength(mockBrands.length);
		expect(options.facets[1]?.options).toHaveLength(PARTS_BUILD_TYPES.length);
		expect(getPartsProducts).not.toHaveBeenCalled();
	});

	it('derives facets from Saleor category products when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(getPartsByCategory).mockResolvedValue(mockParts.slice(0, 8));

		const options = await getPartsFilterOptions('coilovers');

		expect(options.source).toBe('saleor');
		expect(getPartsByCategory).toHaveBeenCalledWith('coilovers', 'en-US');
		expect(options.facets[0]?.options.length).toBeGreaterThan(0);
	});
});

describe('applyPartsFilters', () => {
	it('filters by YMM fitment on mapped products', () => {
		const filtered = applyPartsFilters(mockParts, { make: 'Honda', model: 'Civic' });

		expect(filtered.length).toBeGreaterThan(0);
		expect(
			filtered.every((p) => p.fitment?.some((f) => f.make === 'Honda' && f.model === 'Civic'))
		).toBe(true);
	});
});

describe('loadPartsCatalog', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
		vi.mocked(getPartsByCategory).mockResolvedValue(
			mockParts.filter((p) => p.category?.slug === 'coilovers')
		);
		vi.mocked(getPartsProducts).mockResolvedValue(mockParts);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('applies year/make/model query params to category products', async () => {
		const url = new URL('http://localhost/parts/coilovers?year=2018&make=Honda&model=Civic');
		const result = await loadPartsCatalog({ categorySlug: 'coilovers', url });

		expect(result.filterLabel).toContain('2018 Honda Civic');
		expect(result.products.length).toBeGreaterThan(0);
		expect(
			result.products.every((p) =>
				p.fitment?.some((f) => f.year === 2018 && f.make === 'Honda' && f.model === 'Civic')
			)
		).toBe(true);
	});

	it('returns facet options alongside filtered products', async () => {
		const url = new URL('http://localhost/parts/coilovers');
		const result = await loadPartsCatalog({ categorySlug: 'coilovers', url });

		expect(result.filterOptions.facets).toHaveLength(2);
		expect(result.filterSource).toBe('mock');
	});
});
