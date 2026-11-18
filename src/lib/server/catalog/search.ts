import { isPartProduct } from '#lib/data/catalog-helpers.ts';
import { searchBuilds } from '#lib/data/mock/builds.ts';
import { searchGuides } from '#lib/data/mock/guides.ts';
import { searchParts } from '#lib/data/mock/parts.ts';
import { searchProducts } from '#lib/data/mock/products.ts';
import { config } from '#lib/config/env.ts';
import type { BuildThread, Guide } from '#lib/types/domain.ts';
import type { Product } from '#lib/types/saleor.ts';
import { resolveChannelForLocale } from '#lib/server/saleor/channels.ts';
import { saleorFetch } from '#lib/server/saleor/client.ts';
import { mapProductListNode, type SaleorProductListNode } from '#lib/server/saleor/mappers.ts';
import { withSaleorCatalog } from '#lib/server/catalog/fallback.ts';
import { PRODUCT_SEARCH_QUERY } from '#lib/server/saleor/queries.ts';

export interface CatalogSearchResults {
	products: Product[];
	parts: Product[];
	builds: BuildThread[];
	guides: Guide[];
}

const EMPTY_RESULTS: CatalogSearchResults = {
	products: [],
	parts: [],
	builds: [],
	guides: []
};

async function searchSaleorProducts(query: string, locale: string): Promise<Product[]> {
	const channel = await resolveChannelForLocale(locale);
	const result = await saleorFetch<{
		products: { edges: { node: SaleorProductListNode }[] };
	}>(PRODUCT_SEARCH_QUERY, { channel, query, first: 24 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor product search failed');
	}

	return result.data.products.edges.map(({ node }) => mapProductListNode(node));
}

/**
 * Merged catalog search — mock default; Saleor merch when env is set (server-side Saleor search filter).
 */
// @saleor-migration: intentional — catalog swap point; see docs/commerce/saleor.md#quick-migration
export async function searchCatalog(
	query: string,
	locale: string = config.defaultLocale
): Promise<CatalogSearchResults> {
	const q = query.trim();
	if (!q) return EMPTY_RESULTS;

	const { products, parts } = await withSaleorCatalog(
		async () => {
			const saleorHits = await searchSaleorProducts(q, locale);
			return {
				products: saleorHits.filter((p) => !isPartProduct(p)),
				parts: saleorHits.filter(isPartProduct)
			};
		},
		() => ({ products: searchProducts(q), parts: searchParts(q) })
	);

	return {
		products,
		parts,
		builds: searchBuilds(q),
		guides: searchGuides(q)
	};
}
