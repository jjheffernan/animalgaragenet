import { describe, expect, it } from 'vitest';
import type { Testimonial } from '$lib/types/testimonial';
import { testimonialsToUgcItems } from './to-ugc';

const sample: Testimonial = {
	id: 't-1',
	userId: 'u-1',
	displayName: 'Alex R',
	vehicleSummary: 'FK8',
	rating: 5,
	title: 'Great fitment',
	body: 'Wheels look perfect.',
	status: 'approved',
	loyaltyTier: null,
	featured: true,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	approvedAt: '2026-01-02T00:00:00.000Z'
};

describe('testimonialsToUgcItems', () => {
	it('maps display name and title to UGC shape', () => {
		const [item] = testimonialsToUgcItems([sample]);
		expect(item.id).toBe('t-1');
		expect(item.caption).toBe('Great fitment');
		expect(item.handle).toBe('@alexr');
		expect(item.image).toContain('t-1');
	});
});
