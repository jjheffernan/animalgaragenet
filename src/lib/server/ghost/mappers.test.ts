import { describe, expect, it } from 'vitest';
import { mapGhostPostToBlogPost, mapGhostPostToGuide } from './mappers';
import type { GhostPost } from './types';

export const ghostPostFixture: GhostPost = {
	id: 'post-1',
	uuid: 'uuid-1',
	slug: 'how-to-choose-wheels',
	title: 'How to Choose the Right Wheels',
	html: '<p>Offset, diameter, width.</p>',
	excerpt: 'Offset, diameter, width — everything you need.',
	custom_excerpt: 'Custom excerpt override.',
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

describe('mapGhostPostToGuide', () => {
	it('maps Ghost fields to Guide', () => {
		const guide = mapGhostPostToGuide(ghostPostFixture);

		expect(guide).toMatchObject({
			id: 'post-1',
			slug: 'how-to-choose-wheels',
			title: 'How to Choose the Right Wheels',
			excerpt: 'Custom excerpt override.',
			html: '<p>Offset, diameter, width.</p>',
			content: '',
			category: 'Wheels',
			heroImage: 'https://cdn.example.com/wheels.jpg',
			readTimeMinutes: 12
		});
	});

	it('falls back to primary tag when only guide tag is present', () => {
		const guide = mapGhostPostToGuide({
			...ghostPostFixture,
			tags: [{ id: 't0', name: 'Guide', slug: 'guide' }],
			primary_tag: { id: 't2', name: 'Getting Started', slug: 'getting-started' }
		});

		expect(guide.category).toBe('Getting Started');
	});
});

describe('mapGhostPostToBlogPost', () => {
	it('maps Ghost fields to BlogPost', () => {
		const post = mapGhostPostToBlogPost({
			...ghostPostFixture,
			tags: [
				{ id: 't0', name: 'Blog', slug: 'blog' },
				{ id: 't3', name: 'Drops', slug: 'drops' }
			]
		});

		expect(post).toMatchObject({
			id: 'post-1',
			slug: 'how-to-choose-wheels',
			title: 'How to Choose the Right Wheels',
			excerpt: 'Custom excerpt override.',
			html: '<p>Offset, diameter, width.</p>',
			author: 'AG Crew',
			publishedAt: '2026-06-15',
			heroImage: 'https://cdn.example.com/wheels.jpg',
			tags: ['Drops']
		});
	});
});
