import { describe, expect, it } from 'vitest';
import { getAnalyticsConfig } from '$lib/analytics/config';

describe('getAnalyticsConfig', () => {
	it('reports unconfigured when env is unset', () => {
		const config = getAnalyticsConfig();
		expect(config.configured).toBe(false);
		expect(config.scriptUrl).toBeNull();
	});
});
