import { error } from '@sveltejs/kit';
import { getProductBySlug } from '$lib/data/mock-products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const product = getProductBySlug(params.slug);

	if (!product) {
		error(404, 'Product not found');
	}

	// Future: saleorFetch(PRODUCT_BY_SLUG_QUERY, { slug: params.slug, channel })
	return { product };
};
