import {
	filterPartsProducts,
	formatPartsFilterLabel,
	parsePartsFilters
} from '$lib/data/parts-filters';
import { paginateFromUrl, parseListView } from '$lib/pagination';
import { getPartCategoriesForNav, getPartsProducts } from '$lib/server/catalog/parts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filters = parsePartsFilters(url);
	const filterLabel = formatPartsFilterLabel(filters);
	const allProducts = filterPartsProducts(await getPartsProducts(), filters);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		categories: await getPartCategoriesForNav(),
		products: items,
		pagination,
		filters,
		filterLabel,
		view: parseListView(url)
	};
};
