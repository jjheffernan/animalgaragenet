import { config } from '$lib/config/env';
import {
	getBuildLinkedProducts,
	getLinkedBuildForProduct,
	getRelatedCatalogProducts
} from '$lib/server/catalog/related';
import { getShopProductBySlug } from '$lib/server/catalog/products';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const product = await getShopProductBySlug(params.slug, locale);
	if (!product) error(404, 'Product not found');

	const linkedBuild = await getLinkedBuildForProduct(product.id);

	return {
		product,
		related: await getRelatedCatalogProducts(product, locale),
		linkedBuild,
		buildProducts: linkedBuild ? await getBuildLinkedProducts(linkedBuild, locale) : []
	};
};
