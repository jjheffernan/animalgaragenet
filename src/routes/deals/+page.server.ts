import { redirect } from '@sveltejs/kit';
import { mockProducts } from '$lib/data/mock/products';
import { paginateFromUrl } from '$lib/pagination';
import { getDealProducts } from '$lib/server/catalog/products';
import { listActiveDeals } from '$lib/server/deals/repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/auth/sign-in?redirect=/deals');
	}
	const deals = await listActiveDeals();
	const products = await getDealProducts();
	const allProducts = products.length > 0 ? products : mockProducts.slice(0, 4);
	const { items, pagination } = paginateFromUrl(url, allProducts);

	return {
		deals,
		products: items,
		pagination
	};
};
