import { isPartProduct } from '$lib/data/catalog-helpers';
import {
	getPartBySlug as mockGetPartBySlug,
	getPartsByCategory as mockGetPartsByCategory,
	mockParts
} from '$lib/data/mock/parts';
import {
	getPartCategoryBySlug as mockGetPartCategoryBySlug,
	mockPartCategories
} from '$lib/data/mock/part-categories';
import { config } from '$lib/config/env';
import type { PartCategory } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import {
	mapPartCategory,
	mapProduct,
	mapProductListNode,
	type SaleorCategoryTreeNode,
	type SaleorProductDetailNode,
	type SaleorProductListNode
} from '$lib/server/saleor/mappers';
import {
	CATEGORIES_QUERY,
	PRODUCT_BY_SLUG_QUERY,
	PRODUCTS_QUERY
} from '$lib/server/saleor/queries';

function findPartCategoryInTree(
	categories: PartCategory[],
	slug: string
): PartCategory | undefined {
	for (const cat of categories) {
		if (cat.slug === slug) return cat;
		const child = cat.children?.find((c) => c.slug === slug);
		if (child) return child;
	}
	return undefined;
}

async function fetchSaleorPartCategories(): Promise<PartCategory[]> {
	const result = await saleorFetch<{
		categories: { edges: { node: SaleorCategoryTreeNode }[] };
	}>(CATEGORIES_QUERY, { first: 50, level: 0 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor categories query failed');
	}

	return result.data.categories.edges.map(({ node }) => mapPartCategory(node));
}

/**
 * Curated parts navigation taxonomy — Saleor category tree when configured, mock fallback otherwise.
 */
export async function getPartCategoriesForNav(
	locale: string = config.defaultLocale
): Promise<PartCategory[]> {
	if (isSaleorEnabled()) {
		try {
			const categories = await fetchSaleorPartCategories();
			if (categories.length > 0 || isProductionSiteUrl()) return categories;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return mockPartCategories;
}

export async function getPartCategoryBySlug(
	slug: string,
	locale: string = config.defaultLocale
): Promise<PartCategory | undefined> {
	const categories = await getPartCategoriesForNav(locale);
	const fromNav = findPartCategoryInTree(categories, slug);
	if (fromNav) return fromNav;

	if (!isSaleorEnabled()) {
		return mockGetPartCategoryBySlug(slug);
	}

	return undefined;
}

/**
 * Parts catalog — single swap point for Saleor.
 *
 * Mock when `PUBLIC_SALEOR_API_URL` is unset; Saleor when set (falls back to mock on error).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getPartsProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{
				products: { edges: { node: SaleorProductListNode }[] };
			}>(PRODUCTS_QUERY, { channel, first: 100 });

			if (result.errors?.length || !result.data) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor products query failed');
			}

			return result.data.products.edges
				.map(({ node }) => mapProductListNode(node))
				.filter(isPartProduct);
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	// @saleor-migration: intentional — mock fallback; see docs/commerce/saleor.md#quick-migration
	guardMockCatalogFallback();
	return mockParts;
}

// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getPartsByCategory(
	categorySlug: string,
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		const parts = await getPartsProducts(locale);
		return parts.filter((p) => p.category?.slug === categorySlug);
	}

	return mockGetPartsByCategory(categorySlug);
}

// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getPartBySlug(
	categorySlug: string,
	slug: string,
	locale: string = config.defaultLocale
): Promise<Product | null> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{ product: SaleorProductDetailNode | null }>(
				PRODUCT_BY_SLUG_QUERY,
				{ slug, channel }
			);

			if (result.errors?.length || !result.data?.product) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor product query failed');
			}

			const product = mapProduct(result.data.product);
			if (!isPartProduct(product)) return null;
			if (product.category?.slug !== categorySlug) return null;
			return product;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	const product = mockGetPartBySlug(slug);
	if (!product) return null;
	if (product.category?.slug !== categorySlug) return null;
	return product;
}
