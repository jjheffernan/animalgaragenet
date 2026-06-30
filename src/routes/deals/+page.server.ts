import { redirect } from '@sveltejs/kit';
import { getActiveDeals } from '$lib/data/mock/deals';
import { mockProducts } from '$lib/data/mock/products';
import { paginateFromUrl } from '$lib/pagination';
import { getDealProducts } from '$lib/server/catalog/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/auth/sign-in?redirect=/deals');
	}
	const deals = getActiveDeals();
	const products = await getDealProducts();
	const allProducts = products.length > 0 ? products : mockProducts.slice(0, 4);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		deals,
		products: items,
		pagination
	};
};
