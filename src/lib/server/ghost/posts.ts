import { getBlogPostBySlug, mockBlogPosts } from '$lib/data/mock/blog';
import { getGuideBySlug, mockGuides } from '$lib/data/mock/guides';
import type { BlogPost, Guide } from '$lib/types/domain';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import { ghostFetch, isGhostEnabled } from './client';
import { guardMockGhostFallback } from './fallback';
import { mapGhostPostToBlogPost, mapGhostPostToGuide } from './mappers';
import type { GhostContentTag, GhostPostResponse, GhostPostsResponse } from './types';

// @inspiration-scaffold: intentional — see docs/plans/active/inspiration-polish-tracker.md#IP-015

const GHOST_INCLUDES = 'tags,authors';

function allowMockGhostFallback(): boolean {
	return !isGhostEnabled() || !isProductionSiteUrl();
}

function resolveGhostList<T>(result: T[] | null, mock: T[]): T[] {
	if (result !== null) {
		return result;
	}
	guardMockGhostFallback({ ghostAttemptFailed: true });
	return mock;
}

function resolveGhostSlug<T>(result: T | null, mockLookup: () => T | undefined): T | undefined {
	if (result) {
		return result;
	}
	if (!allowMockGhostFallback()) {
		return undefined;
	}
	return mockLookup();
}

async function fetchPostsByTag(tag: GhostContentTag): Promise<Guide[] | BlogPost[] | null> {
	const data = await ghostFetch<GhostPostsResponse>({
		path: '/posts/',
		searchParams: {
			filter: `tag:${tag}`,
			include: GHOST_INCLUDES,
			limit: 'all',
			order: 'published_at desc'
		}
	});

	if (!data?.posts?.length) {
		return data ? [] : null;
	}

	return tag === 'guide'
		? data.posts.map(mapGhostPostToGuide)
		: data.posts.map(mapGhostPostToBlogPost);
}

async function fetchPostBySlug<T extends Guide | BlogPost>(
	tag: GhostContentTag,
	slug: string,
	mapper: (post: GhostPostsResponse['posts'][number]) => T
): Promise<T | null> {
	const data = await ghostFetch<GhostPostResponse>({
		path: `/posts/slug/${encodeURIComponent(slug)}/`,
		searchParams: { include: GHOST_INCLUDES }
	});

	if (!data) {
		return null;
	}

	const post = data.posts?.[0];
	if (!post) {
		return null;
	}

	const hasTag = post.tags.some((t) => t.slug === tag);
	if (!hasTag) {
		return null;
	}

	return mapper(post);
}

export async function listGuides(): Promise<Guide[]> {
	if (!isGhostEnabled()) {
		return mockGuides;
	}

	const guides = await fetchPostsByTag('guide');
	return resolveGhostList(guides as Guide[] | null, mockGuides) as Guide[];
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
	if (!isGhostEnabled()) {
		return getGuideBySlug(slug);
	}

	const guide = await fetchPostBySlug('guide', slug, mapGhostPostToGuide);
	return resolveGhostSlug(guide, () => getGuideBySlug(slug));
}

export async function listBlogPosts(): Promise<BlogPost[]> {
	if (!isGhostEnabled()) {
		return mockBlogPosts;
	}

	const posts = await fetchPostsByTag('blog');
	return resolveGhostList(posts as BlogPost[] | null, mockBlogPosts) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
	if (!isGhostEnabled()) {
		return getBlogPostBySlug(slug);
	}

	const post = await fetchPostBySlug('blog', slug, mapGhostPostToBlogPost);
	return resolveGhostSlug(post, () => getBlogPostBySlug(slug));
}
