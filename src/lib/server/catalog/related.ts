import {
	getCatalogProductById,
	getProductsForBuild as getMockProductsForBuild,
	getRelatedProducts as getMockRelatedProducts,
	isPartProduct
} from '$lib/data/catalog-helpers';
import { config } from '$lib/config/env';
import type { BuildThread } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { listPublicBuilds } from '$lib/server/builds/public';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { getPartsByCategory, getPartsProducts } from '$lib/server/catalog/parts';
import { getShopProducts } from '$lib/server/catalog/products';
import { isSaleorEnabled } from '$lib/server/saleor/client';

async function findCatalogProductById(
	id: string,
	locale: string = config.defaultLocale
): Promise<Product | undefined> {
	if (isSaleorEnabled()) {
		const [parts, shop] = await Promise.all([
			getPartsProducts(locale),
			getShopProducts('all', locale)
		]);
		return [...parts, ...shop].find((p) => p.id === id);
	}
	return getCatalogProductById(id);
}

/**
 * Related products for detail pages — same Saleor category when configured,
 * mock catalog helpers otherwise.
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getRelatedCatalogProducts(
	product: Product,
	locale: string = config.defaultLocale,
	count = 4
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const categorySlug = product.category?.slug;
			const pool = isPartProduct(product)
				? categorySlug
					? await getPartsByCategory(categorySlug, locale)
					: await getPartsProducts(locale)
				: await getShopProducts('all', locale);

			const related = pool
				.filter((p) => p.id !== product.id)
				.filter((p) => !categorySlug || p.category?.slug === categorySlug)
				.slice(0, count);

			if (related.length > 0) return related;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockRelatedProducts(product, count);
}

/** Linked build for a product — CMS/public builds when configured, mock fallback. */
export async function getLinkedBuildForProduct(productId: string): Promise<BuildThread | null> {
	const builds = await listPublicBuilds();
	return builds.find((b) => b.linkedProductIds.includes(productId)) ?? null;
}

/** Products linked to a build thread — resolves Saleor IDs when configured. */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getBuildLinkedProducts(
	build: BuildThread,
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const products = await Promise.all(
				build.linkedProductIds.map((id) => findCatalogProductById(id, locale))
			);
			const resolved = products.filter((p): p is Product => p !== undefined);
			if (resolved.length > 0) return resolved;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockProductsForBuild(build);
}
