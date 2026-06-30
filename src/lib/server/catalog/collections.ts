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
import { COLLECTIONS_QUERY, PRODUCTS_QUERY } from '$lib/server/saleor/queries';

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

/**
 * Collections catalog — mock default, Saleor when env is set.
 *
 * Saleor `COLLECTIONS_QUERY` returns collection metadata only (no product edges yet);
 * `products` on each collection is empty until collection product queries are added.
 */
export async function getCollections(
	locale: string = config.defaultLocale
): Promise<Collection[]> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{
				collections: { edges: { node: SaleorCollectionNode }[] };
			}>(COLLECTIONS_QUERY, { channel, first: 20 });

			if (result.errors?.length || !result.data) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collections query failed');
			}

			return result.data.collections.edges.map(({ node }) => mapCollection(node));
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
