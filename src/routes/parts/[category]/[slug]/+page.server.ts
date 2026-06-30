import { config } from '$lib/config/env';
import { getPartBySlug } from '$lib/server/catalog/parts';
import { getRelatedCatalogProducts } from '$lib/server/catalog/related';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const product = await getPartBySlug(params.category, params.slug, locale);
	if (!product) error(404, 'Part not found');

	return {
		product,
		related: await getRelatedCatalogProducts(product, locale)
	};
};
