import { paginateFromUrl } from '$lib/pagination';
import { listPublicBuilds } from '$lib/server/builds/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const builds = await listPublicBuilds();
	const { items, pagination } = paginateFromUrl(url, builds);
	return { builds: items, pagination };
};
