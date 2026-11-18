import { error } from '@sveltejs/kit';
import { getBrandBySlug } from '#lib/data/mock/brands.ts';
import { getProductsForBrand } from '#lib/data/catalog-helpers.ts';
import { paginateFromUrl } from '#lib/pagination.ts';
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
