import { json } from '@sveltejs/kit';
import { config } from '$lib/config/env';
import { getPartsFilterOptions } from '$lib/server/catalog/parts-filters';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	const category = url.searchParams.get('category') ?? undefined;
	const options = await getPartsFilterOptions(category, locale);

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return json(options);
};
