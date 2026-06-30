import { isPartProduct } from '$lib/data/catalog-helpers';
import { searchBuilds } from '$lib/data/mock/builds';
import { searchGuides } from '$lib/data/mock/guides';
import { searchParts } from '$lib/data/mock/parts';
import { searchProducts } from '$lib/data/mock/products';
import { config } from '$lib/config/env';
import type { BuildThread, Guide } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { mapProductListNode, type SaleorProductListNode } from '$lib/server/saleor/mappers';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { PRODUCT_SEARCH_QUERY } from '$lib/server/saleor/queries';

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
	const channel = getChannelForLocale(locale);
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

	let products: Product[];
	let parts: Product[];
	if (isSaleorEnabled()) {
		try {
			const saleorHits = await searchSaleorProducts(q, locale);
			products = saleorHits.filter((p) => !isPartProduct(p));
			parts = saleorHits.filter(isPartProduct);
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
			products = searchProducts(q);
			parts = searchParts(q);
		}
	} else {
		guardMockCatalogFallback();
		products = searchProducts(q);
		parts = searchParts(q);
	}

	return {
		products,
		parts,
		builds: searchBuilds(q),
		guides: searchGuides(q)
	};
}
