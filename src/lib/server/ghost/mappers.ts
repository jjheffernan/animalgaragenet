import type { BlogPost, Guide } from '$lib/types/domain';
import type { GhostContentTag, GhostPost } from './types';

const heroFallback = (seed: string) => `https://picsum.photos/seed/${seed}/1200/600`;

function formatPublishedDate(iso: string | null): string {
	if (!iso) return '';
	return iso.slice(0, 10);
}

function contentTags(post: GhostPost, contentTag: GhostContentTag): string[] {
	return post.tags.filter((tag) => tag.slug !== contentTag).map((tag) => tag.name);
}

function guideCategoryTags(post: GhostPost) {
	return post.tags.filter((tag) => tag.slug !== 'guide');
}

function guideCategory(post: GhostPost): string {
	const categoryTag = guideCategoryTags(post)[0];
	return categoryTag?.name ?? post.primary_tag?.name ?? 'General';
}

export function mapGhostPostToGuide(post: GhostPost): Guide {
	const nonGuideTags = guideCategoryTags(post);
	const categoryTag = nonGuideTags[0];
	const topicTags = nonGuideTags.slice(1);

	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		excerpt: post.custom_excerpt?.trim() || post.excerpt?.trim() || '',
		content: '',
		html: post.html,
		category: guideCategory(post),
		categorySlug: categoryTag?.slug,
		topicSlugs: topicTags.map((tag) => tag.slug),
		heroImage: post.feature_image ?? heroFallback(`agguide-${post.slug}`),
		readTimeMinutes: post.reading_time || 1
	};
}

export function mapGhostPostToBlogPost(post: GhostPost): BlogPost {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		excerpt: post.custom_excerpt?.trim() || post.excerpt?.trim() || '',
		content: '',
		html: post.html,
		author: post.authors[0]?.name ?? 'Animal Garage',
		publishedAt: formatPublishedDate(post.published_at),
		heroImage: post.feature_image ?? heroFallback(`agblog-${post.slug}`),
		tags: contentTags(post, 'blog')
	};
}
