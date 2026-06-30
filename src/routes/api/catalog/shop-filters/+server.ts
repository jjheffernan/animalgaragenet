import { json } from '@sveltejs/kit';
import { config } from '$lib/config/env';
import { getShopFilterOptions } from '$lib/server/catalog/shop-filters';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const options = await getShopFilterOptions(locale);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return json(options);
};
