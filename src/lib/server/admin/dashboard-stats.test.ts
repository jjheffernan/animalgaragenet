import { describe, expect, it } from 'vitest';
import { getDashboardStats } from './dashboard-stats';

describe('getDashboardStats', () => {
	it('returns numeric KPI fields and a revenue placeholder', async () => {
		const stats = await getDashboardStats();

		expect(typeof stats.orders).toBe('number');
		expect(typeof stats.users).toBe('number');
		expect(typeof stats.openBugs).toBe('number');
		expect(stats.revenueLabel).toBe('—');
		expect(stats.orders).toBeGreaterThanOrEqual(0);
		expect(stats.users).toBeGreaterThanOrEqual(0);
		expect(stats.openBugs).toBeGreaterThanOrEqual(0);
	});
});
