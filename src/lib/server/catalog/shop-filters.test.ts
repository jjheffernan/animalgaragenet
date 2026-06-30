import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SHOP_CATEGORIES, getShopCategoryGroup } from '$lib/data/catalog-helpers';
import {
	ALL_SHOP_FILTER,
	filterProductsByShopSlug,
	filterSlugToShopCategory,
	getShopFilterOptions,
	groupShopFilterOptions,
	resolveShopFilter,
	type ShopFilterOption
} from '$lib/server/catalog/shop-filters';

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';

describe('getShopFilterOptions', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock categories when Saleor is disabled', async () => {
		const options = await getShopFilterOptions();

		expect(options.source).toBe('mock');
		expect(options.categories).toHaveLength(SHOP_CATEGORIES.length);
		expect(options.categories[0]).toEqual({ id: 'all', slug: 'all', label: 'ALL' });
		expect(options.categories[1]).toEqual({
			id: 'tees',
			slug: 'tees',
			label: 'TEES',
			group: 'Apparel'
		});
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
								name: 'Apparel',
								slug: 'apparel',
								children: {
									edges: [
										{ node: { id: 'cat-1a', name: 'Tees', slug: 'tees' } },
										{ node: { id: 'cat-1b', name: 'Hoodies', slug: 'hoodies' } }
									]
								}
							}
						},
						{
							node: { id: 'cat-2', name: 'Headwear', slug: 'headwear', children: null }
						}
					]
				}
			}
		});

		const options = await getShopFilterOptions('en-US');

		expect(options.source).toBe('saleor');
		expect(options.categories).toEqual([
			ALL_SHOP_FILTER,
			{ id: 'cat-1a', slug: 'tees', label: 'Tees', group: 'Apparel' },
			{ id: 'cat-1b', slug: 'hoodies', label: 'Hoodies', group: 'Apparel' },
			{ id: 'cat-2', slug: 'headwear', label: 'Headwear' }
		]);
		expect(saleorFetch).toHaveBeenCalledOnce();
	});

	it('falls back to mock when Saleor errors', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockRejectedValue(new Error('network'));

		const options = await getShopFilterOptions();

		expect(options.source).toBe('mock');
		expect(options.categories[0].slug).toBe('all');
	});
});

describe('resolveShopFilter', () => {
	const options: ShopFilterOption[] = [
		ALL_SHOP_FILTER,
		{ id: 'tees', slug: 'tees', label: 'TEES' },
		{ id: 'gift-cards', slug: 'gift-cards', label: 'GIFT CARDS' }
	];

	it('defaults to first option when param is missing', () => {
		expect(resolveShopFilter(null, options)).toEqual(ALL_SHOP_FILTER);
	});

	it('matches slug case-insensitively', () => {
		expect(resolveShopFilter('TEES', options).slug).toBe('tees');
	});

	it('matches label and legacy uppercase values', () => {
		expect(resolveShopFilter('GIFT CARDS', options).slug).toBe('gift-cards');
	});

	it('falls back to ALL for unknown values', () => {
		expect(resolveShopFilter('unknown', options)).toEqual(ALL_SHOP_FILTER);
	});
});

describe('filterSlugToShopCategory', () => {
	it('maps slugs to legacy shop categories', () => {
		expect(filterSlugToShopCategory('all')).toBe('ALL');
		expect(filterSlugToShopCategory('tees')).toBe('TEES');
		expect(filterSlugToShopCategory('gift-cards')).toBe('GIFT CARDS');
	});

	it('returns undefined for Saleor-only slugs', () => {
		expect(filterSlugToShopCategory('apparel')).toBeUndefined();
	});
});

describe('filterProductsByShopSlug', () => {
	const products = [
		{
			id: '1',
			name: 'AG Tee',
			slug: 'ag-tee',
			category: { id: 'c1', name: 'Apparel', slug: 'apparel' },
			tags: ['staff-pick']
		},
		{
			id: '2',
			name: 'Cap',
			slug: 'cap',
			category: { id: 'c2', name: 'Headwear', slug: 'headwear' }
		}
	] as Parameters<typeof filterProductsByShopSlug>[0];

	it('filters by Saleor category slug', () => {
		const filtered = filterProductsByShopSlug(products, 'headwear');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].slug).toBe('cap');
	});

	it('filters by metadata tag when no category match', () => {
		const filtered = filterProductsByShopSlug(products, 'staff-pick');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].slug).toBe('ag-tee');
	});
});

describe('getShopCategoryGroup', () => {
	it('maps mock labels to parent groups', () => {
		expect(getShopCategoryGroup('ALL')).toBeUndefined();
		expect(getShopCategoryGroup('TEES')).toBe('Apparel');
		expect(getShopCategoryGroup('tees')).toBe('Apparel');
		expect(getShopCategoryGroup('ACCESSORIES')).toBe('Lifestyle');
		expect(getShopCategoryGroup('GIFT CARDS')).toBe('Gift Cards');
	});
});

describe('groupShopFilterOptions', () => {
	it('groups options by parent label with ALL ungrouped first', () => {
		const options: ShopFilterOption[] = [
			ALL_SHOP_FILTER,
			{ id: 'tees', slug: 'tees', label: 'TEES', group: 'Apparel' },
			{ id: 'hoodies', slug: 'hoodies', label: 'HOODIES', group: 'Apparel' },
			{ id: 'home', slug: 'home', label: 'HOME', group: 'Lifestyle' },
			{ id: 'gift-cards', slug: 'gift-cards', label: 'GIFT CARDS', group: 'Gift Cards' }
		];

		expect(groupShopFilterOptions(options)).toEqual([
			{ label: '', options: [ALL_SHOP_FILTER] },
			{
				label: 'Apparel',
				options: [
					{ id: 'tees', slug: 'tees', label: 'TEES', group: 'Apparel' },
					{ id: 'hoodies', slug: 'hoodies', label: 'HOODIES', group: 'Apparel' }
				]
			},
			{
				label: 'Lifestyle',
				options: [{ id: 'home', slug: 'home', label: 'HOME', group: 'Lifestyle' }]
			},
			{
				label: 'Gift Cards',
				options: [
					{ id: 'gift-cards', slug: 'gift-cards', label: 'GIFT CARDS', group: 'Gift Cards' }
				]
			}
		]);
	});

	it('preserves insertion order for new groups', () => {
		const options: ShopFilterOption[] = [
			{ id: 'a', slug: 'a', label: 'A', group: 'Beta' },
			{ id: 'b', slug: 'b', label: 'B', group: 'Alpha' }
		];

		const groups = groupShopFilterOptions(options);
		expect(groups.map((g) => g.label)).toEqual(['Beta', 'Alpha']);
	});
});
