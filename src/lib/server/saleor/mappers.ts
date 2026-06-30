import type { PartCategory } from '$lib/types/domain';
import type { Collection, Money, Product, ProductMedia } from '$lib/types/saleor';
import {
	mapProductMetadata,
	type SaleorAttribute,
	type SaleorMetadataEntry
} from '$lib/server/saleor/metadata';

/** Saleor GraphQL money wrapper (`gross` / `net`). */
export interface SaleorTaxedMoney {
	gross: Money;
	net?: Money;
}

export interface SaleorImage {
	url: string;
	alt?: string | null;
}

export interface SaleorCategoryNode {
	id: string;
	name: string;
	slug: string;
}

/** Top-level category node with optional child edges from CATEGORIES_QUERY. */
export interface SaleorCategoryTreeNode extends SaleorCategoryNode {
	children?: { edges: { node: SaleorCategoryNode }[] } | null;
}

/** Shape returned by PRODUCTS_QUERY list nodes. */
export interface SaleorProductListNode {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	thumbnail?: SaleorImage | null;
	pricing?: {
		priceRange?: {
			start?: SaleorTaxedMoney | null;
			stop?: SaleorTaxedMoney | null;
		} | null;
	} | null;
	category?: SaleorCategoryNode | null;
	isAvailableForPurchase?: boolean | null;
	metadata?: SaleorMetadataEntry[] | null;
	attributes?: SaleorAttribute[] | null;
	variants?: Array<{
		id: string;
		name: string;
		sku?: string | null;
		pricing?: { price?: SaleorTaxedMoney | null } | null;
	}> | null;
}

/** Shape returned by PRODUCT_BY_SLUG_QUERY. */
export interface SaleorProductDetailNode extends SaleorProductListNode {
	media?: Array<SaleorImage & { id: string; type?: string | null }> | null;
}

export interface SaleorCollectionNode {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	backgroundImage?: SaleorImage | null;
}

function mapMoney(field?: SaleorTaxedMoney | null): Money {
	return {
		amount: field?.gross?.amount ?? 0,
		currency: field?.gross?.currency ?? 'USD'
	};
}

function mapMedia(
	item: SaleorImage & { id?: string; type?: string | null },
	fallbackId: string,
	fallbackAlt: string
): ProductMedia {
	return {
		id: item.id ?? fallbackId,
		url: item.url,
		alt: item.alt ?? fallbackAlt,
		type: item.type === 'VIDEO' ? 'VIDEO' : 'IMAGE'
	};
}

function mapPriceRange(node: SaleorProductListNode): Product['pricing'] {
	const start = mapMoney(node.pricing?.priceRange?.start);
	const stopField = node.pricing?.priceRange?.stop;
	const stop = stopField ? mapMoney(stopField) : start;
	return { priceRange: { start, stop } };
}

/** Map a Saleor list/detail product node to the internal `Product` type. */
// @saleor-migration: intentional — mapper hook; see docs/commerce/saleor.md#quick-migration
export function mapProduct(node: SaleorProductDetailNode): Product {
	const variants =
		node.variants?.map((v) => ({
			id: v.id,
			name: v.name,
			sku: v.sku ?? '',
			pricing: { price: mapMoney(v.pricing?.price) }
		})) ?? [];

	const media =
		node.media?.map((m, i) => mapMedia(m, `${node.id}-m${i}`, node.name)) ??
		(node.thumbnail ? [mapMedia(node.thumbnail, `${node.id}-thumb`, node.name)] : []);

	const pricing = mapPriceRange(node);
	const meta = mapProductMetadata(
		node.metadata,
		node.attributes,
		pricing.priceRange.start.currency
	);

	return {
		id: node.id,
		name: node.name,
		slug: node.slug,
		description: node.description ?? '',
		thumbnail: node.thumbnail ? mapMedia(node.thumbnail, `${node.id}-thumb`, node.name) : null,
		media,
		pricing,
		variants,
		category: node.category ?? null,
		isAvailableForPurchase: node.isAvailableForPurchase ?? true,
		...meta
	};
}

/** Alias for list queries — same mapper, narrower input type. */
export function mapProductListNode(node: SaleorProductListNode): Product {
	return mapProduct(node);
}

export function mapPartCategory(node: SaleorCategoryTreeNode): PartCategory {
	const children = node.children?.edges.map(({ node: child }) => ({
		id: child.id,
		name: child.name,
		slug: child.slug
	}));

	return {
		id: node.id,
		name: node.name,
		slug: node.slug,
		...(children?.length ? { children } : {})
	};
}

export function mapCollection(node: SaleorCollectionNode, products: Product[] = []): Collection {
	return {
		id: node.id,
		name: node.name,
		slug: node.slug,
		description: node.description ?? '',
		backgroundImage: node.backgroundImage
			? { url: node.backgroundImage.url, alt: node.backgroundImage.alt ?? node.name }
			: null,
		products
	};
}
