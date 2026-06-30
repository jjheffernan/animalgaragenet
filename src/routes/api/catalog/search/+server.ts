import { json } from '@sveltejs/kit';
import { config } from '$lib/config/env';
import { searchCatalog } from '$lib/server/catalog/search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;
	return json(await searchCatalog(q, locale));
};
