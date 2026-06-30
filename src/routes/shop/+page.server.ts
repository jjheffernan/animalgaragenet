import { SHOP_CATEGORIES, filterShopProducts, type ShopCategory } from '$lib/data/catalog-helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('category')?.toUpperCase() ?? 'ALL';
	const category = (SHOP_CATEGORIES.includes(raw as ShopCategory) ? raw : 'ALL') as ShopCategory;
	return {
		products: filterShopProducts(category),
		category,
		categories: SHOP_CATEGORIES
	};
};
