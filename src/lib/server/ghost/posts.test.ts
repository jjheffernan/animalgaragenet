import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ghostPostFixture } from './mappers.test';
import { listBlogPosts, getBlogPost, listGuides, getGuide } from './posts';

vi.mock('./client', () => ({
	isGhostEnabled: vi.fn(),
	ghostFetch: vi.fn()
}));

import { ghostFetch, isGhostEnabled } from './client';

describe('ghost posts client', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('falls back to mock guides when Ghost is disabled', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(false);

		const guides = await listGuides();
		expect(guides.length).toBeGreaterThan(0);
		expect(ghostFetch).not.toHaveBeenCalled();
	});

	it('maps guide posts from Ghost API responses', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({
			posts: [{ ...ghostPostFixture, tags: [{ id: 't0', name: 'Guide', slug: 'guide' }] }]
		});

		const guides = await listGuides();

		expect(ghostFetch).toHaveBeenCalledWith(
			expect.objectContaining({
				path: '/posts/',
				searchParams: expect.objectContaining({ filter: 'tag:guide' })
			})
		);
		expect(guides[0]).toMatchObject({
			slug: ghostPostFixture.slug,
			title: ghostPostFixture.title
		});
	});

	it('returns undefined for blog slugs without the blog tag', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({
			posts: [{ ...ghostPostFixture, tags: [{ id: 't0', name: 'Guide', slug: 'guide' }] }]
		});

		const post = await getBlogPost(ghostPostFixture.slug);
		expect(post).toBeUndefined();
	});

	it('loads a single guide by slug when tagged correctly', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({
			posts: [{ ...ghostPostFixture, tags: [{ id: 't0', name: 'Guide', slug: 'guide' }] }]
		});

		const guide = await getGuide(ghostPostFixture.slug);
		expect(guide).toMatchObject({ slug: ghostPostFixture.slug });
	});

	it('returns empty blog list when Ghost returns no results', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue({ posts: [] });

		const posts = await listBlogPosts();
		expect(posts).toEqual([]);
	});

	it('falls back to mock when Ghost fetch fails off production', async () => {
		vi.mocked(isGhostEnabled).mockReturnValue(true);
		vi.mocked(ghostFetch).mockResolvedValue(null);

		const posts = await listBlogPosts();
		expect(posts.length).toBeGreaterThan(0);
	});
});
