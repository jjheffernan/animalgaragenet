import { paginateFromUrl, parseListView } from '#lib/pagination.ts';
import { loadPartsCatalog } from '#lib/server/catalog/parts-filters.ts';
import { getPartCategoriesForNav } from '#lib/server/catalog/parts.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const {
		products: allProducts,
		filters,
		filterLabel,
		filterOptions,
		filterSource
	} = await loadPartsCatalog({ url });
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
