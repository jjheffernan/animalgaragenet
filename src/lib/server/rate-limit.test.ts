import { afterEach, describe, expect, it } from 'vitest';
import { _resetRateLimitsForTests, checkRateLimit } from './rate-limit';

afterEach(() => {
	_resetRateLimitsForTests();
});

describe('checkRateLimit', () => {
	it('allows requests under the limit', () => {
		const key = 'test-ip';
		const windowMs = 60_000;
		const now = 1_000_000;

		for (let i = 0; i < 10; i++) {
			expect(checkRateLimit(key, 10, windowMs, now).ok).toBe(true);
		}
	});

	it('blocks when limit exceeded in the same window', () => {
		const key = 'test-ip';
		const windowMs = 60_000;
		const now = 1_000_000;

		for (let i = 0; i < 10; i++) {
			checkRateLimit(key, 10, windowMs, now);
		}

		const blocked = checkRateLimit(key, 10, windowMs, now);
		expect(blocked.ok).toBe(false);
		expect(blocked.retryAfterMs).toBe(windowMs);
	});

	it('resets after the window expires', () => {
		const key = 'test-ip';
		const windowMs = 60_000;
		const start = 1_000_000;

		for (let i = 0; i < 10; i++) {
			checkRateLimit(key, 10, windowMs, start);
		}
		expect(checkRateLimit(key, 10, windowMs, start).ok).toBe(false);

		expect(checkRateLimit(key, 10, windowMs, start + windowMs).ok).toBe(true);
	});
});
