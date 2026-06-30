import { mockProducts } from '$lib/data/mock-products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Future: replace with saleorFetch(PRODUCTS_QUERY, { channel, first: 24 })
	return { products: mockProducts };
};
