import { describe, expect, it, beforeEach } from 'vitest';
import { _resetRateLimitsForTests } from '$lib/server/rate-limit';
import {
	BUILD_SUBMIT_HONEYPOT,
	checkBuildSubmitRateLimit,
	isBuildSubmitHoneypotTripped
} from '$lib/server/build-logs/submit-guard';

describe('build submit guard', () => {
	beforeEach(() => {
		_resetRateLimitsForTests();
	});

	it('detects filled honeypot', () => {
		const form = new FormData();
		form.set(BUILD_SUBMIT_HONEYPOT, 'spam');
		expect(isBuildSubmitHoneypotTripped(form)).toBe(true);
	});

	it('allows empty honeypot', () => {
		expect(isBuildSubmitHoneypotTripped(new FormData())).toBe(false);
	});

	it('rate limits repeated submits', () => {
		const key = 'user-1';
		for (let i = 0; i < 10; i++) {
			expect(checkBuildSubmitRateLimit(key)).toBe(true);
		}
		expect(checkBuildSubmitRateLimit(key)).toBe(false);
	});
});
