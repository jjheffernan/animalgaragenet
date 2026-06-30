import { error } from '@sveltejs/kit';
import { getBrandBySlug } from '$lib/data/mock/brands';
import { getProductsForBrand } from '$lib/data/catalog-helpers';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const brand = getBrandBySlug(params.slug);
	if (!brand) error(404, 'Brand not found');

	const allProducts = getProductsForBrand(brand);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		brand,
		products: items,
		pagination
	};
};
