import { error } from '@sveltejs/kit';
import { setGhostDetailCacheHeaders } from '$lib/server/ghost/cache-headers';
import { getBlogPost } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setGhostDetailCacheHeaders(setHeaders);
	const post = await getBlogPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { post };
};
