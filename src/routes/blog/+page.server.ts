import { paginateFromUrl } from '$lib/pagination';
import { listBlogPosts } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const allPosts = await listBlogPosts();
	const { items, pagination } = paginateFromUrl(url, allPosts);
	return { posts: items, pagination };
};
