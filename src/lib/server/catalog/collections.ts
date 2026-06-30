import { mockCollections } from '$lib/data/mock/collections';
import {
	getClearanceProducts as getMockClearanceProducts,
	getStaffPickProducts as getMockStaffPickProducts
} from '$lib/data/mock/products';
import { config } from '$lib/config/env';
import type { Collection, Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import {
	mapCollection,
	mapProductListNode,
	type SaleorCollectionNode,
	type SaleorProductListNode
} from '$lib/server/saleor/mappers';
import {
	COLLECTION_PRODUCTS_QUERY,
	COLLECTIONS_QUERY,
	PRODUCTS_QUERY
} from '$lib/server/saleor/queries';

async function fetchSaleorProductsByTag(
	tag: string,
	locale: string = config.defaultLocale
): Promise<Product[]> {
	const channel = getChannelForLocale(locale);
	const result = await saleorFetch<{
		products: { edges: { node: SaleorProductListNode }[] };
	}>(PRODUCTS_QUERY, { channel, first: 100 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor products query failed');
	}

	return result.data.products.edges
		.map(({ node }) => mapProductListNode(node))
		.filter((product) => product.tags?.includes(tag));
}

/** Collections catalog — mock default, Saleor when env is set. */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getCollections(locale: string = config.defaultLocale): Promise<Collection[]> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{
				collections: { edges: { node: SaleorCollectionNode }[] };
			}>(COLLECTIONS_QUERY, { channel, first: 20 });

			if (result.errors?.length || !result.data) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collections query failed');
			}

			const collections = await Promise.all(
				result.data.collections.edges.map(async ({ node }) => {
					const base = mapCollection(node);
					const productsResult = await saleorFetch<{
						collection: { products: { edges: { node: SaleorProductListNode }[] } } | null;
					}>(COLLECTION_PRODUCTS_QUERY, { slug: node.slug, channel, first: 12 });

					const products =
						productsResult.data?.collection?.products.edges.map(({ node: productNode }) =>
							mapProductListNode(productNode)
						) ?? [];

					return { ...base, products };
				})
			);

			return collections;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return mockCollections;
}

/**
 * Staff-pick homepage slice — mock default, Saleor when env is set.
 * Saleor: `tags` metadata includes `staff-pick` (parsed by `mapProductMetadata`).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getStaffPickProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const products = await fetchSaleorProductsByTag('staff-pick', locale);
			if (products.length > 0 || isProductionSiteUrl()) return products;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockStaffPickProducts();
}

/**
 * Clearance homepage slice — mock default, Saleor when env is set.
 * Saleor: `tags` metadata includes `clearance` (parsed by `mapProductMetadata`).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getClearanceProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const products = await fetchSaleorProductsByTag('clearance', locale);
			if (products.length > 0 || isProductionSiteUrl()) return products;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockClearanceProducts();
}
