import { config } from '$lib/config/env';
import type { Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import { getShopProducts } from '$lib/server/catalog/products';
import { mockCollections } from '$lib/data/mock/collections';

// @inspiration-scaffold: intentional — ?collection= PLP filter; see docs/plans/active/inspiration-polish-tracker.md#IP-005
// Saleor: uncomment COLLECTION_PRODUCTS_QUERY block in collections.ts and filter by collection slug here.
const COLLECTION_PRODUCTS_QUERY = `
	query CollectionProducts($slug: String!, $channel: String!, $first: Int!) {
		collection(slug: $slug, channel: $channel) {
			products(first: $first) {
				edges {
					node {
						id
						name
						slug
					}
				}
			}
		}
	}
`;

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
			// @inspiration-scaffold: map Saleor collections query when product edges wired
			const channel = getChannelForLocale(locale);
			void channel;
			void COLLECTION_PRODUCTS_QUERY;
			return mockShopCollections();
		} catch (err) {
			guardMockCatalogFallback(err, isProductionSiteUrl());
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
				collection: { products: { edges: { node: { id: string } }[] } } | null;
			}>(COLLECTION_PRODUCTS_QUERY, { slug: collectionSlug, channel, first: 100 });

			if (result.errors?.length || !result.data?.collection) {
				throw new Error(result.errors?.[0]?.message ?? 'Saleor collection products failed');
			}

			// @inspiration-scaffold: map full product nodes via mapProductListNode when wired
			const ids = result.data.collection.products.edges.map((e) => e.node.id);
			const all = await getShopProducts('all', locale);
			return all.filter((p) => ids.includes(p.id));
		} catch (err) {
			guardMockCatalogFallback(err, isProductionSiteUrl());
		}
	}

	const collection = mockCollections.find((c) => c.slug === collectionSlug);
	return collection?.products ?? [];
}
