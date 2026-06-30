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

function guideCategory(post: GhostPost): string {
	const categoryTag = post.tags.find((tag) => tag.slug !== 'guide');
	return categoryTag?.name ?? post.primary_tag?.name ?? 'General';
}

export function mapGhostPostToGuide(post: GhostPost): Guide {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		excerpt: post.custom_excerpt?.trim() || post.excerpt?.trim() || '',
		content: '',
		html: post.html,
		category: guideCategory(post),
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
