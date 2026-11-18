import { mockCollections } from '#lib/data/mock/collections.ts';
import {
	getClearanceProducts as getMockClearanceProducts,
	getStaffPickProducts as getMockStaffPickProducts
} from '#lib/data/mock/products.ts';
import { config } from '#lib/config/env.ts';
import type { Collection, Product } from '#lib/types/saleor.ts';
import { resolveChannelForLocale } from '#lib/server/saleor/channels.ts';
import { saleorFetch } from '#lib/server/saleor/client.ts';
import { withSaleorCatalog } from '#lib/server/catalog/fallback.ts';
import { isProductionSiteUrl } from '#lib/server/auth/local-dev.ts';
import {
	mapCollection,
	mapProductListNode,
	type SaleorCollectionNode,
	type SaleorProductListNode
} from '#lib/server/saleor/mappers.ts';
import {
	COLLECTION_PRODUCTS_QUERY,
	COLLECTIONS_QUERY,
	PRODUCTS_QUERY
} from '#lib/server/saleor/queries.ts';

async function fetchSaleorProductsByTag(
	tag: string,
	locale: string = config.defaultLocale
): Promise<Product[]> {
	const channel = await resolveChannelForLocale(locale);
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
	return withSaleorCatalog(
		async () => {
			const channel = await resolveChannelForLocale(locale);
			const result = await saleorFetch<{
				collections: { edges: { node: SaleorCollectionNode }[] };
			}>(COLLECTIONS_QUERY, { channel, first: 20 });

			if (result.errors?.length || !result.data) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collections query failed');
			}

			return Promise.all(
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
		},
		() => mockCollections
	);
}

/**
 * Staff-pick homepage slice — mock default, Saleor when env is set.
 * Saleor: `tags` metadata includes `staff-pick` (parsed by `mapProductMetadata`).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getStaffPickProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	return withSaleorCatalog(async () => {
		const products = await fetchSaleorProductsByTag('staff-pick', locale);
		if (products.length > 0 || isProductionSiteUrl()) return products;
		return undefined;
	}, getMockStaffPickProducts);
}

/**
 * Clearance homepage slice — mock default, Saleor when env is set.
 * Saleor: `tags` metadata includes `clearance` (parsed by `mapProductMetadata`).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function getClearanceProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	return withSaleorCatalog(async () => {
		const products = await fetchSaleorProductsByTag('clearance', locale);
		if (products.length > 0 || isProductionSiteUrl()) return products;
		return undefined;
	}, getMockClearanceProducts);
}
