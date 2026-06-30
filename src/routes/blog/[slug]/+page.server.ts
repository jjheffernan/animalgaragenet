import { error } from '@sveltejs/kit';
import { getBlogPostBySlug } from '$lib/data/mock-blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const post = getBlogPostBySlug(params.slug);
	if (!post) error(404, 'Post not found');
	return { post };
};
