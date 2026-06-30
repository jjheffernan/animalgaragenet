import {
	SHOP_CATEGORIES,
	filterProductsByShopCategory,
	getShopCategoryGroup,
	type ShopCategory
} from '$lib/data/catalog-helpers';
import { config } from '$lib/config/env';
import type { Product } from '$lib/types/saleor';
import { saleorFetch } from '$lib/server/saleor/client';
import { withSaleorCatalog } from '$lib/server/catalog/fallback';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import { CATEGORIES_QUERY } from '$lib/server/saleor/queries';
import type { SaleorCategoryTreeNode } from '$lib/server/saleor/mappers';
import type { ShopFilterOption } from '$lib/data/shop-filters';

export type { ShopFilterGroup, ShopFilterOption } from '$lib/data/shop-filters';
export { groupShopFilterOptions } from '$lib/data/shop-filters';

export interface ShopFilterOptions {
	categories: ShopFilterOption[];
	source: 'saleor' | 'mock';
}

export const ALL_SHOP_FILTER: ShopFilterOption = {
	id: 'all',
	slug: 'all',
	label: 'ALL'
};

function mockShopFilterOptions(): ShopFilterOptions {
	return {
		categories: SHOP_CATEGORIES.map((cat) => {
			const slug = cat === 'ALL' ? 'all' : cat.toLowerCase().replace(/\s+/g, '-');
			const group = getShopCategoryGroup(cat);
			return { id: slug, slug, label: cat, ...(group ? { group } : {}) };
		}),
		source: 'mock'
	};
}

function mapSaleorCategoryToFilter(
	node: { id: string; name: string; slug: string },
	group?: string
): ShopFilterOption {
	return { id: node.id, slug: node.slug, label: node.name, ...(group ? { group } : {}) };
}

function flattenSaleorCategoryTree(nodes: SaleorCategoryTreeNode[]): ShopFilterOption[] {
	const options: ShopFilterOption[] = [];

	for (const node of nodes) {
		const children = node.children?.edges ?? [];
		if (children.length > 0) {
			for (const { node: child } of children) {
				options.push(mapSaleorCategoryToFilter(child, node.name));
			}
		} else {
			options.push(mapSaleorCategoryToFilter(node));
		}
	}

	return options;
}

async function fetchSaleorShopFilterOptions(_locale: string): Promise<ShopFilterOption[]> {
	const result = await saleorFetch<{
		categories: { edges: { node: SaleorCategoryTreeNode }[] };
	}>(CATEGORIES_QUERY, { first: 50, level: 0 });

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? 'Saleor categories query failed');
	}

	const nodes = result.data.categories.edges.map(({ node }) => node);
	const categories = flattenSaleorCategoryTree(nodes);
	return [ALL_SHOP_FILTER, ...categories];
}

/**
 * Shop filter taxonomy — Saleor category tree when configured, mock `SHOP_CATEGORIES` otherwise.
 */
// @saleor-migration: intentional — filter swap point; see docs/commerce/saleor.md#quick-migration
export async function getShopFilterOptions(
	locale: string = config.defaultLocale
): Promise<ShopFilterOptions> {
	return withSaleorCatalog(async () => {
		const categories = await fetchSaleorShopFilterOptions(locale);
		if (categories.length > 1 || isProductionSiteUrl()) {
			return { categories, source: 'saleor' as const };
		}
		return undefined;
	}, mockShopFilterOptions);
}

/** Match URL `?category=` against filter options (slug, id, or label — case-insensitive). */
export function resolveShopFilter(
	param: string | null | undefined,
	options: ShopFilterOption[]
): ShopFilterOption {
	if (!param?.trim()) return options[0] ?? ALL_SHOP_FILTER;

	const normalized = param.trim().toLowerCase();
	const found = options.find(
		(opt) =>
			opt.slug.toLowerCase() === normalized ||
			opt.id.toLowerCase() === normalized ||
			opt.label.toLowerCase() === normalized ||
			opt.label.toLowerCase().replace(/\s+/g, '-') === normalized
	);
	return found ?? options[0] ?? ALL_SHOP_FILTER;
}

/** Map filter slug to legacy `ShopCategory` when applicable (mock taxonomy). */
export function filterSlugToShopCategory(slug: string): ShopCategory | undefined {
	if (slug === 'all') return 'ALL';
	const legacy = slug.toUpperCase().replace(/-/g, ' ');
	if (SHOP_CATEGORIES.includes(legacy as ShopCategory)) return legacy as ShopCategory;
	return undefined;
}

/** Filter products by shop filter slug — legacy heuristics or Saleor category/tag match. */
// @saleor-migration: intentional — filter wiring; see docs/commerce/saleor.md#quick-migration
export function filterProductsByShopSlug(
	products: Product[],
	filterSlug: string,
	giftCardProducts?: Product[]
): Product[] {
	const legacy = filterSlugToShopCategory(filterSlug);
	if (legacy) return filterProductsByShopCategory(products, legacy, giftCardProducts);
	if (filterSlug === 'all') return products;

	const byCategory = products.filter((p) => p.category?.slug === filterSlug);
	if (byCategory.length > 0) return byCategory;

	return products.filter((p) => p.tags?.includes(filterSlug));
}
