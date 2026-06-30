import { json } from '@sveltejs/kit';
import { getGuideFilterOptions } from '$lib/server/ghost/guide-filters';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ setHeaders }) => {
	const options = await getGuideFilterOptions();

	setHeaders({ 'cache-control': 'public, max-age=300' });
	return json(options);
};
