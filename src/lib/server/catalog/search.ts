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
import { PRODUCTS_QUERY } from '$lib/server/saleor/queries';

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

function filterProductsByQuery(products: Product[], query: string): Product[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return products.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.description.toLowerCase().includes(q) ||
			p.category?.name.toLowerCase().includes(q) ||
			p.brand?.name.toLowerCase().includes(q)
	);
}

async function searchSaleorProducts(query: string, locale: string): Promise<Product[]> {
	const channel = getChannelForLocale(locale);
	const result = await saleorFetch<{
		products: { edges: { node: SaleorProductListNode }[] };
	}>(PRODUCTS_QUERY, { channel, first: 100 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor products query failed');
	}

	const products = result.data.products.edges.map(({ node }) => mapProductListNode(node));
	return filterProductsByQuery(products, query);
}

/**
 * Merged catalog search — mock default; Saleor merch when env is set (v1: client-side filter on fetched list).
 */
export async function searchCatalog(
	query: string,
	locale: string = config.defaultLocale
): Promise<CatalogSearchResults> {
	const q = query.trim();
	if (!q) return EMPTY_RESULTS;

	let products: Product[];
	if (isSaleorEnabled()) {
		try {
			products = await searchSaleorProducts(q, locale);
		} catch {
			products = searchProducts(q);
		}
	} else {
		products = searchProducts(q);
	}

	return {
		products,
		parts: searchParts(q),
		builds: searchBuilds(q),
		guides: searchGuides(q)
	};
}
