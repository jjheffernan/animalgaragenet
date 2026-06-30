import { describe, expect, it } from 'vitest';
import {
	filterShopProducts,
	getCatalogKind,
	getProductPath,
	getRelatedProducts
} from './catalog-helpers';
import { mockParts } from './mock/parts';
import { mockProducts } from './mock/products';

describe('getCatalogKind', () => {
	it('classifies parts vs merch from productType', () => {
		expect(getCatalogKind(mockParts[0])).toBe('PARTS');
		expect(getCatalogKind(mockProducts[0])).toBe('MERCH');
	});
});

describe('getProductPath', () => {
	it('routes parts to /parts/[category]/[slug]', () => {
		const part = mockParts[0];
		expect(getProductPath(part)).toBe(`/parts/${part.category?.slug}/${part.slug}`);
	});

	it('routes merch to /shop/[slug]', () => {
		const merch = mockProducts[0];
		expect(getProductPath(merch)).toBe(`/shop/${merch.slug}`);
	});

	it('falls back to parts category when missing', () => {
		const part = { ...mockParts[0], category: undefined };
		expect(getProductPath(part)).toBe(`/parts/parts/${part.slug}`);
	});
});

describe('filterShopProducts', () => {
	it('returns merch and gift cards for ALL, never parts', () => {
		const all = filterShopProducts('ALL');
		const giftCards = filterShopProducts('GIFT CARDS');

		expect(all.length).toBeGreaterThan(giftCards.length);
		expect(all.some((p) => p.productType === 'GIFT_CARD')).toBe(true);
		expect(all.every((p) => p.productType !== 'PART')).toBe(true);
	});

	it('filters TEES by name or apparel category', () => {
		const tees = filterShopProducts('TEES');
		expect(tees.length).toBeGreaterThan(0);
		expect(
			tees.every((p) => p.name.toLowerCase().includes('tee') || p.category?.slug === 'apparel')
		).toBe(true);
	});

	it('ignores invalid categories at the loader level but ALL is the default bucket', () => {
		expect(filterShopProducts('ALL').length).toBeGreaterThan(filterShopProducts('JACKETS').length);
	});
});

describe('getRelatedProducts', () => {
	it('excludes self and stays within merch catalog', () => {
		const merch = mockProducts[0];
		const related = getRelatedProducts(merch, 4);

		expect(related).toHaveLength(4);
		expect(related.every((p) => p.id !== merch.id)).toBe(true);
		expect(related.every((p) => getCatalogKind(p) === 'MERCH')).toBe(true);
	});

	it('returns parts-only related items for part products', () => {
		const part = mockParts[0];
		const related = getRelatedProducts(part, 3);

		expect(related.length).toBeGreaterThan(0);
		expect(related.every((p) => getCatalogKind(p) === 'PARTS')).toBe(true);
	});
});

describe('mock catalog size', () => {
	it('includes enough merch and parts for pagination testing', () => {
		expect(mockProducts.length).toBeGreaterThanOrEqual(50);
		expect(mockParts.length).toBeGreaterThanOrEqual(40);
		expect(filterShopProducts('TEES').length).toBeGreaterThanOrEqual(20);
		expect(mockParts.filter((p) => p.category?.slug === 'coilovers').length).toBeGreaterThanOrEqual(
			20
		);
	});
});
