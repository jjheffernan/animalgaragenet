import { describe, expect, it, vi } from 'vitest';
import { guardProductionMockFallback } from './mock-fallback-guard';

class TestUnavailableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TestUnavailableError';
	}
}

vi.mock('$lib/server/auth/local-dev', () => ({
	isProductionSiteUrl: vi.fn(() => false)
}));

describe('guardProductionMockFallback', () => {
	it('allows mock fallback off production', () => {
		expect(() =>
			guardProductionMockFallback(TestUnavailableError, {
				missingConfigMessage: 'missing',
				attemptFailedMessage: 'failed'
			})
		).not.toThrow();
	});

	it('throws missing-config message on production', async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(true);

		expect(() =>
			guardProductionMockFallback(TestUnavailableError, {
				missingConfigMessage: 'config required',
				attemptFailedMessage: 'fetch failed'
			})
		).toThrow(TestUnavailableError);
		expect(() =>
			guardProductionMockFallback(TestUnavailableError, {
				missingConfigMessage: 'config required',
				attemptFailedMessage: 'fetch failed'
			})
		).toThrow('config required');
	});

	it('throws upstream error message when attempt failed', async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(true);

		expect(() =>
			guardProductionMockFallback(TestUnavailableError, {
				attemptFailed: true,
				error: new Error('network down'),
				missingConfigMessage: 'config required',
				attemptFailedMessage: 'fetch failed'
			})
		).toThrow('network down');
	});
});
