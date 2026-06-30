import { SHOP_CATEGORIES, type ShopCategory } from '$lib/data/catalog-helpers';
import { config } from '$lib/config/env';
import { paginateFromUrl, parseListView } from '$lib/pagination';
import { getShopProducts } from '$lib/server/catalog/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('category')?.toUpperCase() ?? 'ALL';
	const category = (SHOP_CATEGORIES.includes(raw as ShopCategory) ? raw : 'ALL') as ShopCategory;
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const allProducts = await getShopProducts(category, locale);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		products: items,
		pagination,
		category,
		categories: SHOP_CATEGORIES,
		view: parseListView(url)
	};
};
