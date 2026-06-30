import { paginateFromUrl } from '$lib/pagination';
import { listGuides } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const allGuides = await listGuides();
	const { items, pagination } = paginateFromUrl(url, allGuides);
	return { guides: items, pagination };
};
