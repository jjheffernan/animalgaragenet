import { config } from '$lib/config/env';
import { paginateFromUrl, parseListView } from '$lib/pagination';
import { getShopProducts } from '$lib/server/catalog/products';
import { getShopFilterOptions, resolveShopFilter } from '$lib/server/catalog/shop-filters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const filterOptions = await getShopFilterOptions(locale);
	const category = resolveShopFilter(url.searchParams.get('category'), filterOptions.categories);
	const allProducts = await getShopProducts(category.slug, locale);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		products: items,
		pagination,
		category,
		categories: filterOptions.categories,
		filterSource: filterOptions.source,
		view: parseListView(url)
	};
};
