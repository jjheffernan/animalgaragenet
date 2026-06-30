import { paginateFromUrl, parseListView } from '$lib/pagination';
import { loadPartsCatalog } from '$lib/server/catalog/parts-filters';
import { getPartCategoriesForNav } from '$lib/server/catalog/parts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { products: allProducts, filters, filterLabel, filterOptions, filterSource } =
		await loadPartsCatalog({ url });
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		categories: await getPartCategoriesForNav(),
		products: items,
		pagination,
		filters,
		filterLabel,
		filterOptions,
		filterSource,
		view: parseListView(url)
	};
};
