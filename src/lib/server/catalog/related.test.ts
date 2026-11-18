import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockBuilds } from '#lib/data/mock/builds.ts';
import { mockParts } from '#lib/data/mock/parts.ts';
import { mockProducts } from '#lib/data/mock/products.ts';
import {
	getBuildLinkedProducts,
	getLinkedBuildForProduct,
	getRelatedCatalogProducts
} from '#lib/server/catalog/related.ts';

vi.mock('#lib/server/saleor/client.ts', () => ({
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

vi.mock('#lib/server/builds/public.ts', () => ({
	listPublicBuilds: vi.fn()
}));

vi.mock('#lib/server/catalog/parts.ts', () => ({
	getPartsByCategory: vi.fn(),
	getPartsProducts: vi.fn()
}));

vi.mock('#lib/server/catalog/products.ts', () => ({
	getShopProducts: vi.fn()
}));

import { isSaleorEnabled } from '#lib/server/saleor/client.ts';
import { listPublicBuilds } from '#lib/server/builds/public.ts';
import { getPartsByCategory, getPartsProducts } from '#lib/server/catalog/parts.ts';
import { getShopProducts } from '#lib/server/catalog/products.ts';

describe('getRelatedCatalogProducts', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('uses mock related products when Saleor is disabled', async () => {
		const merch = mockProducts[0];
		const related = await getRelatedCatalogProducts(merch, 'en-US', 4);

		expect(related).toHaveLength(4);
		expect(related.every((p) => p.id !== merch.id)).toBe(true);
		expect(getShopProducts).not.toHaveBeenCalled();
	});

	it('loads same-category Saleor products when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		const part = mockParts[0];
		const siblings = mockParts.filter(
			(p) => p.category?.slug === part.category?.slug && p.id !== part.id
		);
		vi.mocked(getPartsByCategory).mockResolvedValue([part, ...siblings]);

		const related = await getRelatedCatalogProducts(part, 'en-US', 3);

		expect(related.length).toBeGreaterThan(0);
		expect(related.every((p) => p.id !== part.id)).toBe(true);
		expect(getPartsByCategory).toHaveBeenCalledWith(part.category?.slug, 'en-US');
	});
});

describe('getLinkedBuildForProduct', () => {
	it('finds a build linked to the product id', async () => {
		const build = mockBuilds[0];
		const productId = build.linkedProductIds[0]!;
		vi.mocked(listPublicBuilds).mockResolvedValue(mockBuilds);

		const linked = await getLinkedBuildForProduct(productId);

		expect(linked?.slug).toBe(build.slug);
	});
});

describe('getBuildLinkedProducts', () => {
	beforeEach(() => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	it('resolves mock catalog products for a linked build', async () => {
		const build = mockBuilds[0];
		const products = await getBuildLinkedProducts(build);

		expect(products.length).toBe(build.linkedProductIds.length);
		expect(products.every((p) => build.linkedProductIds.includes(p.id))).toBe(true);
	});

	it('resolves Saleor catalog products by id when configured', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		const build = mockBuilds[0];
		const saleorCatalog = [...mockParts, ...mockProducts];
		vi.mocked(getPartsProducts).mockResolvedValue(mockParts);
		vi.mocked(getShopProducts).mockResolvedValue(mockProducts);

		const products = await getBuildLinkedProducts(build);

		expect(products.length).toBeGreaterThan(0);
		expect(products.every((p) => saleorCatalog.some((c) => c.id === p.id))).toBe(true);
	});
});
