import {
	getProductsForBuild,
	getRelatedProducts
} from '$lib/data/catalog-helpers';
import { getBuildBySlug, mockBuilds } from '$lib/data/mock-builds';
import { getProductBySlug } from '$lib/data/mock-products';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const product = getProductBySlug(params.slug);
	if (!product) error(404, 'Product not found');

	const linkedBuild = mockBuilds.find((b) => b.linkedProductIds.includes(product.id));

	return {
		product,
		related: getRelatedProducts(product),
		linkedBuild,
		buildProducts: linkedBuild ? getProductsForBuild(linkedBuild) : []
	};
};
