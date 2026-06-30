import { getRelatedProducts } from '$lib/data/catalog-helpers';
import { getPartBySlug } from '$lib/server/catalog/parts';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getPartBySlug(params.category, params.slug);
	if (!product) error(404, 'Part not found');

	return {
		product,
		related: getRelatedProducts(product)
	};
};
