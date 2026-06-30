import { mockGuides } from '$lib/data/mock/guides';
import type { Guide } from '$lib/types/domain';
import { ghostFetch, isGhostEnabled } from './client';
import type { GhostPostsResponse } from './types';

export interface GuideFilterOption {
	id: string;
	slug: string;
	label: string;
}

export interface GuideFilterOptions {
	categories: GuideFilterOption[];
	topics: GuideFilterOption[];
	/** All distinct Ghost tags on guide posts (excludes content-type tags). */
	tags: GuideFilterOption[];
	source: 'ghost' | 'mock';
}

export const ALL_GUIDE_FILTER: GuideFilterOption = {
	id: 'all',
	slug: 'all',
	label: 'ALL'
};

const CONTENT_TYPE_TAG_SLUGS = new Set(['guide', 'blog']);

function slugifyCategory(label: string): string {
	return label.toLowerCase().replace(/\s+/g, '-');
}

function sortOptions(options: GuideFilterOption[]): GuideFilterOption[] {
	return [...options].sort((a, b) => a.label.localeCompare(b.label));
}

function uniqueOptions(map: Map<string, GuideFilterOption>): GuideFilterOption[] {
	return sortOptions([...map.values()]);
}

function mockGuideFilterOptions(): GuideFilterOptions {
	const categoryMap = new Map<string, GuideFilterOption>();

	for (const guide of mockGuides) {
		const slug = slugifyCategory(guide.category);
		if (!categoryMap.has(slug)) {
			categoryMap.set(slug, { id: slug, slug, label: guide.category });
		}
	}

	const categories = [ALL_GUIDE_FILTER, ...uniqueOptions(categoryMap)];
	return { categories, topics: [], tags: uniqueOptions(categoryMap), source: 'mock' };
}

async function fetchGhostGuideFilterOptions(): Promise<GuideFilterOptions | null> {
	const data = await ghostFetch<GhostPostsResponse>({
		path: '/posts/',
		searchParams: {
			filter: 'tag:guide',
			include: 'tags',
			limit: 'all',
			fields: 'id,slug,tags',
			order: 'published_at desc'
		}
	});

	if (!data?.posts?.length) {
		return null;
	}

	const categoryMap = new Map<string, GuideFilterOption>();
	const topicMap = new Map<string, GuideFilterOption>();
	const tagMap = new Map<string, GuideFilterOption>();

	for (const post of data.posts) {
		const contentTags = post.tags.filter((tag) => !CONTENT_TYPE_TAG_SLUGS.has(tag.slug));
		contentTags.forEach((tag, index) => {
			const option = { id: tag.id, slug: tag.slug, label: tag.name };
			tagMap.set(tag.slug, option);
			if (index === 0) {
				categoryMap.set(tag.slug, option);
			} else {
				topicMap.set(tag.slug, option);
			}
		});
	}

	return {
		categories: [ALL_GUIDE_FILTER, ...uniqueOptions(categoryMap)],
		topics: uniqueOptions(topicMap),
		tags: uniqueOptions(tagMap),
		source: 'ghost'
	};
}

/**
 * Guide filter taxonomy — Ghost tags on `guide`-tagged posts when configured, mock categories otherwise.
 */
export async function getGuideFilterOptions(): Promise<GuideFilterOptions> {
	if (isGhostEnabled()) {
		const ghost = await fetchGhostGuideFilterOptions();
		if (ghost && ghost.categories.length > 1) {
			return ghost;
		}
	}

	return mockGuideFilterOptions();
}

/** Match URL `?category=` / `?topic=` against filter options (slug, id, or label). */
export function resolveGuideFilter(
	param: string | null | undefined,
	options: GuideFilterOption[]
): GuideFilterOption {
	if (!param?.trim()) return options[0] ?? ALL_GUIDE_FILTER;

	const normalized = param.trim().toLowerCase();
	const found = options.find(
		(opt) =>
			opt.slug.toLowerCase() === normalized ||
			opt.id.toLowerCase() === normalized ||
			opt.label.toLowerCase() === normalized ||
			opt.label.toLowerCase().replace(/\s+/g, '-') === normalized
	);
	return found ?? options[0] ?? ALL_GUIDE_FILTER;
}

function guideCategorySlug(guide: Guide): string {
	return guide.categorySlug ?? slugifyCategory(guide.category);
}

/** Filter guides by primary category slug. */
export function filterGuidesByCategory(guides: Guide[], filterSlug: string): Guide[] {
	if (filterSlug === 'all') return guides;
	return guides.filter((guide) => guideCategorySlug(guide) === filterSlug);
}

/** Filter guides by secondary topic tag slug. */
export function filterGuidesByTopic(guides: Guide[], filterSlug: string): Guide[] {
	if (filterSlug === 'all') return guides;
	return guides.filter((guide) => guide.topicSlugs?.includes(filterSlug));
}
