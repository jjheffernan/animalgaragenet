import { describe, expect, it } from 'vitest';
import { testimonialsToUgcItems } from '$lib/server/testimonials/to-ugc';
import type { Testimonial } from '$lib/types/testimonial';

function testimonialFixture(overrides: Partial<Testimonial> = {}): Testimonial {
	return {
		id: 't-1',
		userId: 'u-1',
		displayName: 'Jordan K',
		vehicleSummary: 'E46 M3',
		rating: 5,
		title: 'Solid crew',
		body: 'Great support on my build.',
		status: 'approved',
		loyaltyTier: 'Pit Crew',
		featured: true,
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		approvedAt: '2026-01-02T00:00:00.000Z',
		...overrides
	};
}

describe('testimonialsToUgcItems', () => {
	it('maps testimonials to UGCItem shape for UGCWall', () => {
		const items = testimonialsToUgcItems([testimonialFixture()]);

		expect(items).toHaveLength(1);
		expect(items[0]).toEqual({
			id: 't-1',
			image: 'https://picsum.photos/seed/ag-t-t-1/400/400',
			caption: 'Solid crew',
			handle: '@jordank'
		});
	});

	it('falls back to body excerpt when title is empty', () => {
		const items = testimonialsToUgcItems([testimonialFixture({ title: '' })]);

		expect(items[0]?.caption).toBe('Great support on my build.');
	});
});
