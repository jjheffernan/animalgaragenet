import {
	filterPartsProducts,
	formatPartsFilterLabel,
	PARTS_BUILD_TYPES,
	parsePartsFilters,
	type PartsFilterState
} from '$lib/data/parts-filters';
import { mockBrands } from '$lib/data/mock/brands';
import { config } from '$lib/config/env';
import type { Product } from '$lib/types/saleor';
import { withSaleorCatalog } from '$lib/server/catalog/fallback';
import { getPartsByCategory, getPartsProducts } from '$lib/server/catalog/parts';

export type { PartsFilterState };
export { parsePartsFilters, formatPartsFilterLabel };

export interface PartsFacetOption {
	id: string;
	slug: string;
	label: string;
}

export interface PartsFacetGroup {
	key: 'brand' | 'build';
	label: string;
	options: PartsFacetOption[];
}

export interface PartsFilterOptions {
	facets: PartsFacetGroup[];
	source: 'saleor' | 'mock';
}

export interface PartsCatalogLoadResult {
	products: Product[];
	filters: PartsFilterState;
	filterLabel: string | null;
	filterOptions: PartsFilterOptions;
	filterSource: PartsFilterOptions['source'];
}

function mockPartsFilterOptions(): PartsFilterOptions {
	return {
		facets: [
			{
				key: 'brand',
				label: 'Brand',
				options: mockBrands.map((b) => ({ id: b.id, slug: b.slug, label: b.name }))
			},
			{
				key: 'build',
				label: 'Build Type',
				options: PARTS_BUILD_TYPES.map((b) => ({ id: b.slug, slug: b.slug, label: b.label }))
			}
		],
		source: 'mock'
	};
}

/** Derive facet options from mapped Saleor/mock product attributes. */
export function derivePartsFacetsFromProducts(products: Product[]): PartsFacetGroup[] {
	const brandMap = new Map<string, PartsFacetOption>();
	const buildTags = new Set<string>();

	for (const product of products) {
		if (product.brand) {
			brandMap.set(product.brand.slug, {
				id: product.brand.id,
				slug: product.brand.slug,
				label: product.brand.name
			});
		}
		for (const tag of product.tags ?? []) {
			if (tag.startsWith('build-')) buildTags.add(tag);
		}
	}

	const buildOptions = PARTS_BUILD_TYPES.filter((b) => buildTags.has(b.tag)).map((b) => ({
		id: b.slug,
		slug: b.slug,
		label: b.label
	}));

	return [
		{
			key: 'brand',
			label: 'Brand',
			options: [...brandMap.values()].sort((a, b) => a.label.localeCompare(b.label))
		},
		{
			key: 'build',
			label: 'Build Type',
			options: buildOptions
		}
	];
}

/**
 * Parts facet taxonomy — derived from Saleor product attributes when configured,
 * mock brands/build types otherwise.
 */
// @saleor-migration: intentional — filter swap point; see docs/commerce/saleor.md#quick-migration
export async function getPartsFilterOptions(
	categorySlug?: string,
	locale: string = config.defaultLocale
): Promise<PartsFilterOptions> {
	return withSaleorCatalog(
		async () => {
			const products = categorySlug
				? await getPartsByCategory(categorySlug, locale)
				: await getPartsProducts(locale);
			if (products.length > 0) {
				return { facets: derivePartsFacetsFromProducts(products), source: 'saleor' as const };
			}
			return undefined;
		},
		mockPartsFilterOptions
	);
}

/** Apply URL-synced facet state (YMM, brand, build) to a parts product list. */
export function applyPartsFilters(products: Product[], filters: PartsFilterState): Product[] {
	return filterPartsProducts(products, filters);
}

/**
 * Load parts catalog with URL-synced filters — Saleor fitment/YMM when env set,
 * mock path unchanged.
 */
// @saleor-migration: intentional — filter wiring; see docs/commerce/saleor.md#quick-migration
export async function loadPartsCatalog(options: {
	categorySlug?: string;
	url: URL;
	locale?: string;
}): Promise<PartsCatalogLoadResult> {
	const locale = options.locale ?? config.defaultLocale;
	const filters = parsePartsFilters(options.url);
	const filterLabel = formatPartsFilterLabel(filters);

	const rawProducts = options.categorySlug
		? await getPartsByCategory(options.categorySlug, locale)
		: await getPartsProducts(locale);

	const products = applyPartsFilters(rawProducts, filters);
	const filterOptions = await getPartsFilterOptions(options.categorySlug, locale);

	return {
		products,
		filters,
		filterLabel,
		filterOptions,
		filterSource: filterOptions.source
	};
}
