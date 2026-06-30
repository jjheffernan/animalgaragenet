import { describe, expect, it } from 'vitest';
import {
	buildPaginationUrl,
	DEFAULT_PER_PAGE,
	paginateArray,
	paginateFromUrl,
	parseListView,
	parsePagination,
	paginationRange
} from './pagination';

describe('pagination', () => {
	it('defaults to page 1 and 10 per page', () => {
		const url = new URL('https://example.com/shop');
		expect(parsePagination(url)).toEqual({ page: 1, perPage: 10, offset: 0 });
	});

	it('parses page and perPage from URL', () => {
		const url = new URL('https://example.com/shop?page=3&perPage=20');
		expect(parsePagination(url)).toEqual({ page: 3, perPage: 20, offset: 40 });
	});

	it('clamps invalid perPage to default', () => {
		const url = new URL('https://example.com/shop?perPage=99');
		expect(parsePagination(url).perPage).toBe(DEFAULT_PER_PAGE);
	});

	it('paginates arrays and clamps page to last page', () => {
		const items = Array.from({ length: 25 }, (_, i) => i);
		const result = paginateArray(items, 99, 10);

		expect(result.items).toHaveLength(5);
		expect(result.pagination).toEqual({
			page: 3,
			perPage: 10,
			total: 25,
			totalPages: 3
		});
	});

	it('paginates from URL search params', () => {
		const url = new URL('https://example.com/builds?page=2&perPage=10');
		const { items, pagination } = paginateFromUrl(
			url,
			Array.from({ length: 12 }, (_, i) => i)
		);

		expect(items).toEqual([10, 11]);
		expect(pagination.page).toBe(2);
	});

	it('builds pagination URLs while preserving filters', () => {
		const params = new URLSearchParams('category=TEES&page=2');
		expect(buildPaginationUrl('/shop', params, { page: 3 })).toBe('/shop?category=TEES&page=3');
		expect(buildPaginationUrl('/shop', params, { perPage: 20 })).toBe('/shop?category=TEES&perPage=20');
	});

	it('preserves view param and omits default view', () => {
		const params = new URLSearchParams('view=list&page=2');
		expect(buildPaginationUrl('/shop', params, { page: 3 })).toBe('/shop?view=list&page=3');
		expect(buildPaginationUrl('/shop', params, { view: 'grid-lg' })).toBe('/shop?page=2');
		expect(buildPaginationUrl('/shop', new URLSearchParams(), { view: 'grid-sm' })).toBe(
			'/shop?view=grid-sm'
		);
	});

	it('parses list view from URL with default fallback', () => {
		expect(parseListView(new URL('https://example.com/shop'))).toBe('grid-lg');
		expect(parseListView(new URL('https://example.com/shop?view=list'))).toBe('list');
		expect(parseListView(new URL('https://example.com/shop?view=invalid'))).toBe('grid-lg');
	});

	it('returns human-readable ranges', () => {
		expect(paginationRange({ page: 2, perPage: 10, total: 25, totalPages: 3 })).toEqual({
			start: 11,
			end: 20
		});
		expect(paginationRange({ page: 1, perPage: 10, total: 0, totalPages: 1 })).toEqual({
			start: 0,
			end: 0
		});
	});
});
