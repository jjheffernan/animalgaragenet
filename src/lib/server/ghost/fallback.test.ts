import { describe, expect, it, vi } from 'vitest';
import { GhostContentUnavailableError, guardMockGhostFallback } from './fallback';

vi.mock('$lib/server/auth/local-dev', () => ({
	isProductionSiteUrl: vi.fn(() => false)
}));

describe('guardMockGhostFallback', () => {
	it('allows mock fallback off production', () => {
		expect(() => guardMockGhostFallback()).not.toThrow();
		expect(() => guardMockGhostFallback({ ghostAttemptFailed: true })).not.toThrow();
	});
});

describe('guardMockGhostFallback on production', () => {
	it('throws when Ghost fetch failed', async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(true);

		expect(() => guardMockGhostFallback({ ghostAttemptFailed: true })).toThrow(
			GhostContentUnavailableError
		);
		expect(() =>
			guardMockGhostFallback({ ghostAttemptFailed: true, error: new Error('ghost down') })
		).toThrow('ghost down');
	});
});
