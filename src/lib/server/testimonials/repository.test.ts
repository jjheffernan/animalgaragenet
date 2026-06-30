import { afterEach, describe, expect, it } from 'vitest';
import {
	_resetMockStoreForTests,
	createTestimonial,
	listApprovedTestimonials,
	listPendingTestimonials,
	listTestimonialsForUser,
	moderateTestimonial
} from './repository';

describe('testimonials repository (mock fallback)', () => {
	afterEach(() => {
		_resetMockStoreForTests();
	});

	it('creates pending testimonial for user', async () => {
		const t = await createTestimonial('user-1', {
			displayName: 'Jordan',
			vehicleSummary: 'E46 M3',
			rating: 5,
			title: 'Solid crew',
			body: 'Great support on my build and fast shipping on every order I placed this season.',
			loyaltyTier: 'Pit Crew'
		});

		expect(t.status).toBe('pending');
		expect(t.userId).toBe('user-1');

		const mine = await listTestimonialsForUser('user-1');
		expect(mine).toHaveLength(1);
	});

	it('lists pending and approved after moderation', async () => {
		const t = await createTestimonial('user-2', {
			displayName: 'Sam',
			vehicleSummary: null,
			rating: 4,
			title: 'Worth it',
			body: 'Joined Garage Squad for the perks and stayed for the community build threads.',
			loyaltyTier: null
		});

		expect(await listPendingTestimonials()).toHaveLength(1);
		expect(await listApprovedTestimonials()).toHaveLength(0);

		await moderateTestimonial(t.id, 'approved', { featured: true });

		expect(await listPendingTestimonials()).toHaveLength(0);
		const approved = await listApprovedTestimonials();
		expect(approved).toHaveLength(1);
		expect(approved[0]?.featured).toBe(true);
	});
});
