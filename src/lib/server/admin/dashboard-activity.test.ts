import { describe, expect, it } from 'vitest';
import { getDashboardActivity } from './dashboard-activity';

describe('getDashboardActivity', () => {
	it('returns an array of activity items with required fields', async () => {
		const activity = await getDashboardActivity();

		expect(Array.isArray(activity)).toBe(true);
		for (const item of activity) {
			expect(typeof item.at).toBe('string');
			expect(['build', 'bug', 'youtube']).toContain(item.type);
			expect(typeof item.summary).toBe('string');
			expect(item.summary.length).toBeGreaterThan(0);
			expect(typeof item.href).toBe('string');
			expect(item.href.startsWith('/admin/')).toBe(true);
		}
	});
});
