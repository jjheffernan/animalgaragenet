import { describe, expect, it } from 'vitest';
import type { BlogPost, Guide } from '$lib/types/domain';
import { mapGhostPostToBlogPost, mapGhostPostToGuide } from '$lib/server/ghost/mappers';
import type { GhostPost } from '$lib/server/ghost/types';

const ghostPostFixture: GhostPost = {
	id: 'post-1',
	uuid: 'uuid-1',
	slug: 'how-to-choose-wheels',
	title: 'How to Choose the Right Wheels',
	html: '<p>Offset, diameter, width.</p>',
	excerpt: 'Offset, diameter, width — everything you need.',
	custom_excerpt: 'Custom excerpt override.',
	meta_title: null,
	meta_description: null,
	feature_image: 'https://cdn.example.com/wheels.jpg',
	reading_time: 12,
	published_at: '2026-06-15T10:00:00.000Z',
	primary_tag: { id: 't1', name: 'Wheels', slug: 'wheels' },
	tags: [
		{ id: 't0', name: 'Guide', slug: 'guide' },
		{ id: 't1', name: 'Wheels', slug: 'wheels' }
	],
	authors: [{ id: 'a1', name: 'AG Crew', slug: 'ag-crew' }]
};

const GUIDE_KEYS: (keyof Guide)[] = [
	'id',
	'slug',
	'title',
	'excerpt',
	'content',
	'html',
	'category',
	'heroImage',
	'readTimeMinutes'
];

const GUIDE_OPTIONAL_KEYS: (keyof Guide)[] = ['metaTitle', 'metaDescription'];

const BLOG_POST_KEYS: (keyof BlogPost)[] = [
	'id',
	'slug',
	'title',
	'excerpt',
	'content',
	'html',
	'author',
	'publishedAt',
	'heroImage',
	'tags'
];

const BLOG_POST_OPTIONAL_KEYS: (keyof BlogPost)[] = ['metaTitle', 'metaDescription'];

function assertDomainShape<T extends object>(value: T, keys: (keyof T)[]): void {
	for (const key of keys) {
		expect(key in value).toBe(true);
	}
}

describe('ghost-cms mapper contracts', () => {
	it('mapGhostPostToGuide maps GhostPost response to Guide domain shape', () => {
		const guide = mapGhostPostToGuide(ghostPostFixture);

		assertDomainShape(guide as unknown as Record<string, unknown>, GUIDE_KEYS);
		expect(typeof guide.id).toBe('string');
		expect(typeof guide.slug).toBe('string');
		expect(typeof guide.category).toBe('string');
		expect(typeof guide.readTimeMinutes).toBe('number');
		expect(guide.content).toBe('');
	});

	it('mapGhostPostToGuide maps optional Ghost SEO fields', () => {
		const guide = mapGhostPostToGuide({
			...ghostPostFixture,
			meta_title: 'SEO Wheel Guide',
			meta_description: 'Pick the right offset and width.'
		});

		for (const key of GUIDE_OPTIONAL_KEYS) {
			expect(key in guide).toBe(true);
		}
		expect(guide.metaTitle).toBe('SEO Wheel Guide');
		expect(guide.metaDescription).toBe('Pick the right offset and width.');
	});

	it('mapGhostPostToBlogPost maps GhostPost response to BlogPost domain shape', () => {
		const post = mapGhostPostToBlogPost({
			...ghostPostFixture,
			tags: [
				{ id: 't0', name: 'Blog', slug: 'blog' },
				{ id: 't3', name: 'Drops', slug: 'drops' }
			]
		} satisfies GhostPost);

		assertDomainShape(post as unknown as Record<string, unknown>, BLOG_POST_KEYS);
		expect(Array.isArray(post.tags)).toBe(true);
		expect(post.tags.every((tag) => typeof tag === 'string')).toBe(true);
		expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('mapGhostPostToBlogPost maps optional Ghost SEO fields', () => {
		const post = mapGhostPostToBlogPost({
			...ghostPostFixture,
			meta_title: 'Blog SEO Title',
			meta_description: 'Blog SEO description.',
			tags: [
				{ id: 't0', name: 'Blog', slug: 'blog' },
				{ id: 't3', name: 'Drops', slug: 'drops' }
			]
		} satisfies GhostPost);

		for (const key of BLOG_POST_OPTIONAL_KEYS) {
			expect(key in post).toBe(true);
		}
		expect(post.metaTitle).toBe('Blog SEO Title');
		expect(post.metaDescription).toBe('Blog SEO description.');
	});
});
