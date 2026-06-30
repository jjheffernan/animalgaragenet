import { mockBuilds } from '$lib/data/mock/builds';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { items, pagination } = paginateFromUrl(url, mockBuilds);
	return { builds: items, pagination };
};
