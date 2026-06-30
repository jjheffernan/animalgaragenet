import { config } from '$lib/config/env';
import { paginateFromUrl, parseListView } from '$lib/pagination';
import { getShopProducts } from '$lib/server/catalog/products';
import {
	filterProductsByShopSlug,
	getShopFilterOptions,
	resolveShopFilter
} from '$lib/server/catalog/shop-filters';
import {
	getShopCollectionOptions,
	getShopProductsByCollection,
	resolveShopCollection,
	type ShopCollectionFilter
} from '$lib/server/catalog/shop-collection';
import type { Product } from '$lib/types/saleor';
import type { PageServerLoad } from './$types';

async function getFilteredShopProducts(
	categorySlug: string,
	collection: ShopCollectionFilter | null,
	locale: string
): Promise<Product[]> {
	if (collection) {
		const collectionProducts = await getShopProductsByCollection(collection.slug, locale);
		if (categorySlug === 'all') return collectionProducts;
		return filterProductsByShopSlug(collectionProducts, categorySlug);
	}
	return getShopProducts(categorySlug, locale);
}

export const load: PageServerLoad = async ({ url }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const filterOptions = await getShopFilterOptions(locale);
	const collectionOptions = await getShopCollectionOptions(locale);
	const category = resolveShopFilter(url.searchParams.get('category'), filterOptions.categories);
	const collection = resolveShopCollection(url.searchParams.get('collection'), collectionOptions);

	const allProducts = await getFilteredShopProducts(category.slug, collection, locale);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		products: items,
		pagination,
		category,
		categories: filterOptions.categories,
		filterSource: filterOptions.source,
		collection,
		collections: collectionOptions,
		view: parseListView(url)
	};
};
