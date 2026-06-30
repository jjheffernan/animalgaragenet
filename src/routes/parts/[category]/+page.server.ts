import { error } from '@sveltejs/kit';
import {
	filterPartsProducts,
	formatPartsFilterLabel,
	parsePartsFilters
} from '$lib/data/parts-filters';
import { paginateFromUrl, parseListView } from '$lib/pagination';
import { getPartCategoryBySlug, getPartsByCategory } from '$lib/server/catalog/parts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const category = await getPartCategoryBySlug(params.category);
	if (!category) error(404, 'Category not found');

	const filters = parsePartsFilters(url);
	const filterLabel = formatPartsFilterLabel(filters);
	const allProducts = filterPartsProducts(await getPartsByCategory(params.category), filters);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		category,
		products: items,
		pagination,
		filters,
		filterLabel,
		view: parseListView(url)
	};
};
