import { error } from '@sveltejs/kit';
import { paginateFromUrl, parseListView } from '#lib/pagination.ts';
import { loadPartsCatalog } from '#lib/server/catalog/parts-filters.ts';
import { getPartCategoryBySlug } from '#lib/server/catalog/parts.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const category = await getPartCategoryBySlug(params.category);
	if (!category) error(404, 'Category not found');

	const {
		products: allProducts,
		filters,
		filterLabel,
		filterOptions,
		filterSource
	} = await loadPartsCatalog({ categorySlug: params.category, url });
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		category,
		products: items,
		pagination,
		filters,
		filterLabel,
		filterOptions,
		filterSource,
		view: parseListView(url)
	};
};
