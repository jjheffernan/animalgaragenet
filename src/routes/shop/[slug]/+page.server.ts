import {
	getProductsForBuild,
	getRelatedProducts
} from '$lib/data/catalog-helpers';
import { config } from '$lib/config/env';
import { mockBuilds } from '$lib/data/mock/builds';
import { getShopProductBySlug } from '$lib/server/catalog/products';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const product = await getShopProductBySlug(params.slug, locale);
	if (!product) error(404, 'Product not found');

	const linkedBuild = mockBuilds.find((b) => b.linkedProductIds.includes(product.id));

	return {
		product,
		related: getRelatedProducts(product),
		linkedBuild,
		buildProducts: linkedBuild ? getProductsForBuild(linkedBuild) : []
	};
};
