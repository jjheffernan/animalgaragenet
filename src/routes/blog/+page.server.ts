import { mockBlogPosts } from '$lib/data/mock-blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ posts: mockBlogPosts });
