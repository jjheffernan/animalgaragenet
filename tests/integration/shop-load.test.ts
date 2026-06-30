import { describe, expect, it } from 'vitest';
import { mockCollections } from '$lib/data/mock/collections';
import type { Product } from '$lib/types/saleor';
import type { ShopFilterOption } from '$lib/server/catalog/shop-filters';
import { load } from '../../src/routes/shop/+page.server';
import type { PageServerLoadEvent } from '../../src/routes/shop/$types';

function shopEvent(params?: { category?: string; collection?: string }): PageServerLoadEvent {
	const search = new URLSearchParams();
	if (params?.category) search.set('category', params.category);
	if (params?.collection) search.set('collection', params.collection);
	const query = search.toString();
	const url = new URL(query ? `http://localhost/shop?${query}` : 'http://localhost/shop');
	return { url } as PageServerLoadEvent;
}

async function loadShop(params?: { category?: string; collection?: string }) {
	const data = await load(shopEvent(params));
	if (!data) throw new Error('shop load returned void');
	return data;
}

describe('shop/+page.server load', () => {
	it('returns products for the default ALL category', async () => {
		const data = await loadShop();

		expect(data.category).toEqual({ id: 'all', slug: 'all', label: 'ALL' });
		expect(data.filterSource).toBe('mock');
		expect(data.products.length).toBeGreaterThan(0);
		expect(data.products.length).toBeLessThanOrEqual(data.pagination.perPage);
		expect(data.pagination.perPage).toBe(10);
		expect(data.categories.map((c: ShopFilterOption) => c.label)).toContain('TEES');
	});

	it('filters products when a valid category query is provided', async () => {
		const data = await loadShop({ category: 'GIFT CARDS' });

		expect(data.category).toEqual({ id: 'gift-cards', slug: 'gift-cards', label: 'GIFT CARDS' });
		expect(data.products.length).toBeGreaterThan(0);
		expect(data.products.every((p: Product) => p.productType === 'GIFT_CARD')).toBe(true);
	});

	it('falls back to ALL for unknown category values', async () => {
		const data = await loadShop({ category: 'NOT_A_REAL_CATEGORY' });

		expect(data.category).toEqual({ id: 'all', slug: 'all', label: 'ALL' });
		expect(data.products.length).toBeGreaterThan(0);
	});

	it('filters products when a valid collection query is provided', async () => {
		const slug = mockCollections[0]?.slug ?? 'shop-essentials';
		const data = await loadShop({ collection: slug });

		expect(data.collection).toMatchObject({ slug, source: 'mock' });
		expect(data.products.length).toBeGreaterThan(0);
		expect(data.collections.some((c: { slug: string }) => c.slug === slug)).toBe(true);
	});

	it('applies both category and collection when both query params are set', async () => {
		const slug = mockCollections[0]?.slug ?? 'shop-essentials';
		const collectionOnly = await loadShop({ collection: slug });
		const data = await loadShop({ collection: slug, category: 'accessories' });

		expect(data.collection?.slug).toBe(slug);
		expect(data.category.slug).toBe('accessories');
		expect(data.products.length).toBeGreaterThan(0);
		expect(data.products.length).toBeLessThanOrEqual(collectionOnly.products.length);
	});

	it('parses list view from the URL', async () => {
		const data = await load({
			url: new URL('http://localhost/shop?view=grid-sm&perPage=20')
		} as PageServerLoadEvent);

		if (!data) throw new Error('shop load returned void');
		expect(data.view).toBe('grid-sm');
		expect(data.pagination.perPage).toBe(20);
	});
});
