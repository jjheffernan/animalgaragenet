import { error } from '@sveltejs/kit';
import { getBrandBySlug } from '$lib/data/mock-brands';
import { getProductsForBrand } from '$lib/data/catalog-helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const brand = getBrandBySlug(params.slug);
	if (!brand) error(404, 'Brand not found');

	return {
		brand,
		products: getProductsForBrand(brand)
	};
};
