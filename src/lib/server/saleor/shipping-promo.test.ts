import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: {}
}));

import { env } from '$env/dynamic/private';
import {
	getFreeShippingProgress,
	getFreeShippingThresholdForLocale
} from './shipping-promo';

describe('shipping-promo', () => {
	beforeEach(() => {
		vi.mocked(env).SALEOR_FREE_SHIPPING_THRESHOLDS = undefined;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('uses channel defaults for known locales', () => {
		expect(getFreeShippingThresholdForLocale('en-US')).toBe(75);
		expect(getFreeShippingThresholdForLocale('en-GB')).toBe(100);
		expect(getFreeShippingThresholdForLocale('ja-JP')).toBe(10000);
	});

	it('merges SALEOR_FREE_SHIPPING_THRESHOLDS env overrides', () => {
		vi.mocked(env).SALEOR_FREE_SHIPPING_THRESHOLDS = JSON.stringify({ us: 99 });
		expect(getFreeShippingThresholdForLocale('en-US')).toBe(99);
	});

	it('computes remaining subtotal for free shipping', () => {
		const progress = getFreeShippingProgress(50, 'en-US');
		expect(progress).toEqual({
			threshold: 75,
			subtotal: 50,
			remaining: 25,
			qualified: false
		});
	});

	it('marks qualified when subtotal meets threshold', () => {
		const progress = getFreeShippingProgress(80, 'en-US');
		expect(progress.qualified).toBe(true);
		expect(progress.remaining).toBe(0);
	});
});
