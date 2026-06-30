import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

vi.mock('$lib/server/testimonials/repository', () => ({
	listFeaturedTestimonials: vi.fn(),
	listApprovedTestimonials: vi.fn()
}));

import { mockUGC } from '$lib/data/mock/ugc';
import { createAdminClient } from '$lib/server/supabase/admin';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '$lib/server/testimonials/repository';
import { _loadMediaUgcItems } from '../../src/routes/media/+page.server';

describe('/media UGC wall source', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		vi.mocked(listFeaturedTestimonials).mockResolvedValue([]);
		vi.mocked(listApprovedTestimonials).mockResolvedValue([]);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock UGC when Supabase is unset', async () => {
		const items = await _loadMediaUgcItems();
		expect(items).toEqual(mockUGC);
	});

	it('prefers featured approved testimonials when Supabase is configured', async () => {
		vi.mocked(createAdminClient).mockReturnValue({} as never);
		vi.mocked(listFeaturedTestimonials).mockResolvedValue([
			{
				id: 't-1',
				userId: 'u-1',
				displayName: 'Jordan',
				vehicleSummary: 'E46 M3',
				rating: 5,
				title: 'Solid crew',
				body: 'Great support on my build.',
				status: 'approved',
				loyaltyTier: 'Pit Crew',
				featured: true,
				createdAt: '2026-06-30T12:00:00.000Z',
				updatedAt: '2026-06-30T12:00:00.000Z',
				approvedAt: '2026-06-30T12:00:00.000Z'
			}
		]);

		const items = await _loadMediaUgcItems();
		expect(listFeaturedTestimonials).toHaveBeenCalled();
		expect(listApprovedTestimonials).not.toHaveBeenCalled();
		expect(items.length).toBe(1);
		expect(items[0]?.caption).toBe('Solid crew');
		expect(items).not.toEqual(mockUGC);
	});

	it('falls back to approved testimonials when none are featured', async () => {
		vi.mocked(createAdminClient).mockReturnValue({} as never);
		vi.mocked(listFeaturedTestimonials).mockResolvedValue([]);
		vi.mocked(listApprovedTestimonials).mockResolvedValue([
			{
				id: 't-2',
				userId: 'u-2',
				displayName: 'Alex',
				vehicleSummary: null,
				rating: 5,
				title: 'Great shop',
				body: 'Love the crew.',
				status: 'approved',
				loyaltyTier: null,
				featured: false,
				createdAt: '2026-06-30T12:00:00.000Z',
				updatedAt: '2026-06-30T12:00:00.000Z',
				approvedAt: '2026-06-30T12:00:00.000Z'
			}
		]);

		const items = await _loadMediaUgcItems();
		expect(listApprovedTestimonials).toHaveBeenCalled();
		expect(items[0]?.caption).toBe('Great shop');
	});
});
