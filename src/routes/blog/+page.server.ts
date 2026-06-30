import { paginateFromUrl } from '$lib/pagination';
import { setGhostListCacheHeaders } from '$lib/server/ghost/cache-headers';
import { listBlogPosts } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setGhostListCacheHeaders(setHeaders);
	const allPosts = await listBlogPosts();
	const { items, pagination } = paginateFromUrl(url, allPosts);
	return { posts: items, pagination };
};
