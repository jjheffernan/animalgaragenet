import { afterEach, describe, expect, it, vi } from 'vitest';
import { setAnalyticsEnabled, setAnalyticsSink, trackPageView } from '$lib/analytics';

describe('analytics', () => {
	afterEach(() => {
		setAnalyticsEnabled(false);
		setAnalyticsSink(null);
		vi.restoreAllMocks();
	});

	it('no-ops when consent is off', () => {
		const sink = vi.fn();
		setAnalyticsSink(sink);
		trackPageView('/shop');
		expect(sink).not.toHaveBeenCalled();
	});

	it('fires sink when consent is on', () => {
		const sink = vi.fn();
		setAnalyticsSink(sink);
		setAnalyticsEnabled(true);
		trackPageView('/shop');
		expect(sink).toHaveBeenCalledWith('/shop');
	});
});
