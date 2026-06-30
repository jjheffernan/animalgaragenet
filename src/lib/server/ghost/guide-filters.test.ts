import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockGuides } from '$lib/data/mock/guides';
import {
	ALL_GUIDE_FILTER,
	filterGuidesByCategory,
	filterGuidesByTopic,
	getGuideFilterOptions,
	resolveGuideFilter,
	type GuideFilterOption
} from '$lib/server/ghost/guide-filters';

vi.mock('./client', () => ({
	isGhostEnabled: vi.fn(() => false),
	ghostFetch: vi.fn()
}));

import { ghostFetch, isGhostEnabled } from './client';

describe('getGuideFilterOptions', () => {
	beforeEach(() => {
		vi.mocked(isGhostEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock categories when Ghost is disabled', async () => {
		const options = await getGuideFilterOptions();
		const mockCategories = [...new Set(mockGuides.map((guide) => guide.category))].sort();

		expect(options.source).toBe('mock');
		expect(options.categories[0]).toEqual(ALL_GUIDE_FILTER);
		expect(options.topics).toEqual([]);
		expect(options.categories.map((cat) => cat.label).slice(1)).toEqual(mockCategories);
		expect(ghostFetch).not.toHaveBeenCalled();
	});

	it('returns Ghost tags from guide posts when configured', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({
			posts: [
				{
					id: 'p1',
					slug: 'wheels-guide',
					tags: [
						{ id: 't0', name: 'Guide', slug: 'guide' },
						{ id: 't1', name: 'Wheels', slug: 'wheels' },
						{ id: 't2', name: 'Fitment', slug: 'fitment' }
					]
				},
				{
					id: 'p2',
					slug: 'tires-guide',
					tags: [
						{ id: 't0', name: 'Guide', slug: 'guide' },
						{ id: 't3', name: 'Tires', slug: 'tires' }
					]
				}
			]
		});

		const options = await getGuideFilterOptions();

		expect(options.source).toBe('ghost');
		expect(options.categories).toEqual([
			ALL_GUIDE_FILTER,
			{ id: 't3', slug: 'tires', label: 'Tires' },
			{ id: 't1', slug: 'wheels', label: 'Wheels' }
		]);
		expect(options.topics).toEqual([{ id: 't2', slug: 'fitment', label: 'Fitment' }]);
		expect(options.tags).toEqual([
			{ id: 't2', slug: 'fitment', label: 'Fitment' },
			{ id: 't3', slug: 'tires', label: 'Tires' },
			{ id: 't1', slug: 'wheels', label: 'Wheels' }
		]);
		expect(ghostFetch).toHaveBeenCalledWith(
			expect.objectContaining({
				path: '/posts/',
				searchParams: expect.objectContaining({ filter: 'tag:guide', include: 'tags' })
			})
		);
	});

	it('falls back to mock when Ghost returns no posts', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({ posts: [] });

		const options = await getGuideFilterOptions();

		expect(options.source).toBe('mock');
		expect(options.categories[0].slug).toBe('all');
	});
});

describe('resolveGuideFilter', () => {
	const options: GuideFilterOption[] = [
		ALL_GUIDE_FILTER,
		{ id: 'wheels', slug: 'wheels', label: 'Wheels' },
		{ id: 'getting-started', slug: 'getting-started', label: 'Getting Started' }
	];

	it('defaults to first option when param is missing', () => {
		expect(resolveGuideFilter(null, options)).toEqual(ALL_GUIDE_FILTER);
	});

	it('matches slug case-insensitively', () => {
		expect(resolveGuideFilter('WHEELS', options).slug).toBe('wheels');
	});

	it('matches label and slugified label', () => {
		expect(resolveGuideFilter('Getting Started', options).slug).toBe('getting-started');
	});

	it('falls back to ALL for unknown values', () => {
		expect(resolveGuideFilter('unknown', options)).toEqual(ALL_GUIDE_FILTER);
	});
});

describe('filterGuidesByCategory', () => {
	it('filters mock guides by category slug', () => {
		const filtered = filterGuidesByCategory(mockGuides, 'wheels');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].slug).toBe('how-to-choose-wheels');
	});

	it('returns all guides for the ALL slug', () => {
		expect(filterGuidesByCategory(mockGuides, 'all')).toHaveLength(mockGuides.length);
	});
});

describe('filterGuidesByTopic', () => {
	it('filters guides that include the topic slug', () => {
		const guides = [
			{ ...mockGuides[0], topicSlugs: ['fitment'] },
			{ ...mockGuides[1], topicSlugs: ['compound'] }
		];
		const filtered = filterGuidesByTopic(guides, 'fitment');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].slug).toBe('how-to-choose-wheels');
	});
});
