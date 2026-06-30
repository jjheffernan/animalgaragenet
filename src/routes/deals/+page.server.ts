import { getActiveDeals } from '$lib/data/mock-deals';
import { getDealProducts } from '$lib/data/catalog-helpers';
import { mockProducts } from '$lib/data/mock-products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const deals = getActiveDeals();
	const products = getDealProducts();
	return {
		deals,
		products: products.length > 0 ? products : mockProducts.slice(0, 4)
	};
};
