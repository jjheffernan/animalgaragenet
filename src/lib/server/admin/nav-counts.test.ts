import { describe, expect, it } from 'vitest';
import { getAdminNavCounts } from './nav-counts';

describe('getAdminNavCounts', () => {
	it('returns non-negative pending counts', async () => {
		const counts = await getAdminNavCounts();

		expect(counts.builds).toBeGreaterThanOrEqual(0);
		expect(counts.testimonials).toBeGreaterThanOrEqual(0);
	});
});
