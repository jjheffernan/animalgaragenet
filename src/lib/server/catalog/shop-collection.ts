import { config } from '$lib/config/env';
import type { Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { mockCollections } from '$lib/data/mock/collections';
import {
	mapProductListNode,
	type SaleorCollectionNode,
	type SaleorProductListNode
} from '$lib/server/saleor/mappers';
import { COLLECTIONS_QUERY, COLLECTION_PRODUCTS_QUERY } from '$lib/server/saleor/queries';

export interface ShopCollectionFilter {
	slug: string;
	label: string;
	source: 'saleor' | 'mock';
}

export function resolveShopCollection(
	param: string | null,
	collections: ShopCollectionFilter[]
): ShopCollectionFilter | null {
	if (!param || param === 'all') return null;
	const normalized = param.toLowerCase();
	return collections.find((c) => c.slug === normalized) ?? null;
}

export function mockShopCollections(): ShopCollectionFilter[] {
	return mockCollections.map((c) => ({
		slug: c.slug,
		label: c.name,
		source: 'mock' as const
	}));
}

export async function getShopCollectionOptions(
	locale: string = config.defaultLocale
): Promise<ShopCollectionFilter[]> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{
				collections: { edges: { node: SaleorCollectionNode }[] };
			}>(COLLECTIONS_QUERY, { channel, first: 20 });

			if (result.errors?.length || !result.data) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collections query failed');
			}

			return result.data.collections.edges.map(({ node }) => ({
				slug: node.slug,
				label: node.name,
				source: 'saleor' as const
			}));
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}
	return mockShopCollections();
}

export async function getShopProductsByCollection(
	collectionSlug: string,
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const channel = getChannelForLocale(locale);
			const result = await saleorFetch<{
				collection: { products: { edges: { node: SaleorProductListNode }[] } } | null;
			}>(COLLECTION_PRODUCTS_QUERY, { slug: collectionSlug, channel, first: 100 });

			if (result.errors?.length || !result.data?.collection) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collection products failed');
			}

			return result.data.collection.products.edges.map(({ node }) => mapProductListNode(node));
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	const collection = mockCollections.find((c) => c.slug === collectionSlug);
	return collection?.products ?? [];
}
