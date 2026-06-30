import { describe, expect, it } from 'vitest';
import { getDashboardStats } from './dashboard-stats';

describe('getDashboardStats', () => {
	it('returns numeric KPI fields from order mirror or mock fallback', async () => {
		const stats = await getDashboardStats();

		expect(typeof stats.orders).toBe('number');
		expect(typeof stats.users).toBe('number');
		expect(typeof stats.openBugs).toBe('number');
		expect(typeof stats.revenueLabel).toBe('string');
		expect(stats.orders).toBeGreaterThanOrEqual(0);
		expect(stats.users).toBeGreaterThanOrEqual(0);
		expect(stats.openBugs).toBeGreaterThanOrEqual(0);
		expect(['mirror', 'mock', 'empty']).toContain(stats.commerceSource);
	});
});
