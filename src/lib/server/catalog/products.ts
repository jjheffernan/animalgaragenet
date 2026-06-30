import { filterShopProducts, getDealProducts as getMockDealProducts } from '$lib/data/catalog-helpers';
import { filterProductsByShopSlug, filterSlugToShopCategory } from '$lib/server/catalog/shop-filters';
import { getGiftCardProducts as getMockGiftCardProducts, getProductBySlug } from '$lib/data/mock/products';
import { config } from '$lib/config/env';
import type { Product } from '$lib/types/saleor';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled, saleorFetch } from '$lib/server/saleor/client';
import {
	mapProduct,
	mapProductListNode,
	type SaleorProductDetailNode,
	type SaleorProductListNode,
	type SaleorTaxedMoney
} from '$lib/server/saleor/mappers';
import { guardMockCatalogFallback } from '$lib/server/catalog/fallback';

/** Extended list query — metadata + full price range for gift cards / deals. */
const PRODUCTS_CATALOG_QUERY = `
  query ProductsCatalog($channel: String!, $first: Int!) {
    products(channel: $channel, first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail { url alt }
          metadata { key value }
          pricing {
            priceRange {
              start { gross { amount currency } }
              stop { gross { amount currency } }
            }
          }
          category { id name slug }
          isAvailableForPurchase
        }
      }
    }
  }
`;

interface SaleorMetadataEntry {
	key: string;
	value: string;
}

interface SaleorProductCatalogNode extends SaleorProductListNode {
	metadata?: SaleorMetadataEntry[] | null;
	pricing?: {
		priceRange?: {
			start?: SaleorTaxedMoney | null;
			stop?: SaleorTaxedMoney | null;
		} | null;
	} | null;
}

function metadataValue(node: SaleorProductCatalogNode, key: string): string | undefined {
	return node.metadata?.find((entry) => entry.key === key)?.value;
}

function enrichProductFromMetadata(node: SaleorProductCatalogNode, product: Product): Product {
	const productType = metadataValue(node, 'productType') as Product['productType'] | undefined;
	const compareAtRaw = metadataValue(node, 'compareAtPrice');
	const tagsRaw = metadataValue(node, 'tags');
	const currency = product.pricing.priceRange.start.currency;

	return {
		...product,
		...(productType ? { productType } : {}),
		...(compareAtRaw
			? { compareAtPrice: { amount: Number.parseFloat(compareAtRaw), currency } }
			: {}),
		...(tagsRaw ? { tags: tagsRaw.split(',').map((tag) => tag.trim()) } : {})
	};
}

function isGiftCardNode(node: SaleorProductCatalogNode): boolean {
	if (metadataValue(node, 'productType') === 'GIFT_CARD') return true;
	if (node.category?.slug === 'gift-cards') return true;
	return node.slug.startsWith('gift-card');
}

function isDealNode(node: SaleorProductCatalogNode): boolean {
	if (metadataValue(node, 'on_sale') === 'true') return true;
	const start = node.pricing?.priceRange?.start?.gross?.amount;
	const stop = node.pricing?.priceRange?.stop?.gross?.amount;
	return start != null && stop != null && start < stop;
}

async function fetchSaleorCatalogNodes(
	locale: string = config.defaultLocale
): Promise<SaleorProductCatalogNode[]> {
	const channel = getChannelForLocale(locale);
	const result = await saleorFetch<{
		products: { edges: { node: SaleorProductCatalogNode }[] };
	}>(PRODUCTS_CATALOG_QUERY, { channel, first: 100 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor products query failed');
	}

	return result.data.products.edges.map(({ node }) => node);
}

function mapCatalogNode(node: SaleorProductCatalogNode): Product {
	return enrichProductFromMetadata(node, mapProductListNode(node));
}

/**
 * Shop merch catalog — single swap point for Saleor.
 *
 * Mock when `PUBLIC_SALEOR_API_URL` is unset; Saleor when set (falls back to mock on error).
 */
export async function getShopProducts(
	filterSlug: string = 'all',
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

			const products = result.data.products.edges.map(({ node }) => mapProductListNode(node));
			return filterProductsByShopSlug(products, filterSlug);
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return filterShopProducts(filterSlugToShopCategory(filterSlug) ?? 'ALL');
}

/**
 * Single shop product by slug — mock default, Saleor when env is set.
 */
export async function getShopProductBySlug(
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

			return mapProduct(result.data.product);
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getProductBySlug(slug) ?? null;
}

/**
 * Gift card products — mock default, Saleor when env is set.
 * Saleor: `productType` metadata, gift-cards category, or gift-card slug prefix.
 */
export async function getGiftCardProducts(
	locale: string = config.defaultLocale
): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const nodes = await fetchSaleorCatalogNodes(locale);
			return nodes
				.filter(isGiftCardNode)
				.map((node) => ({ ...mapCatalogNode(node), productType: 'GIFT_CARD' as const }));
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockGiftCardProducts();
}

/**
 * Deal / on-sale products — mock default, Saleor when env is set.
 * Saleor: `on_sale` metadata or sale pricing (start < stop).
 */
export async function getDealProducts(locale: string = config.defaultLocale): Promise<Product[]> {
	if (isSaleorEnabled()) {
		try {
			const nodes = await fetchSaleorCatalogNodes(locale);
			const products = nodes.filter(isDealNode).map(mapCatalogNode);
			if (products.length > 0) return products;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return getMockDealProducts();
}
