import { error } from '@sveltejs/kit';
import { getPartCategoryBySlug } from '$lib/data/mock-part-categories';
import { getPartsByCategory } from '$lib/data/mock-parts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const category = getPartCategoryBySlug(params.category);
	if (!category) error(404, 'Category not found');

	return {
		category,
		products: getPartsByCategory(params.category)
	};
};
