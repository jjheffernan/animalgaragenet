import { describe, expect, it } from 'vitest';
import type { Product } from '$lib/types/saleor';
import { load } from '../../src/routes/shop/+page.server';
import type { PageServerLoadEvent } from '../../src/routes/shop/$types';

function shopEvent(category?: string): PageServerLoadEvent {
	const url = new URL(
		category ? `http://localhost/shop?category=${category}` : 'http://localhost/shop'
	);
	return { url } as PageServerLoadEvent;
}

async function loadShop(category?: string) {
	const data = await load(shopEvent(category));
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
		expect(data.categories.map((c) => c.label)).toContain('TEES');
	});

	it('filters products when a valid category query is provided', async () => {
		const data = await loadShop('GIFT CARDS');

		expect(data.category).toEqual({ id: 'gift-cards', slug: 'gift-cards', label: 'GIFT CARDS' });
		expect(data.products.length).toBeGreaterThan(0);
		expect(data.products.every((p: Product) => p.productType === 'GIFT_CARD')).toBe(true);
	});

	it('falls back to ALL for unknown category values', async () => {
		const data = await loadShop('NOT_A_REAL_CATEGORY');

		expect(data.category).toEqual({ id: 'all', slug: 'all', label: 'ALL' });
		expect(data.products.length).toBeGreaterThan(0);
	});
});
