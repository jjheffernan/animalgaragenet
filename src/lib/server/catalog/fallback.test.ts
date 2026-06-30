import { describe, expect, it, vi } from 'vitest';
import { CatalogUnavailableError, guardMockCatalogFallback } from './fallback';

vi.mock('$lib/server/auth/local-dev', () => ({
	isProductionSiteUrl: vi.fn(() => false)
}));

describe('guardMockCatalogFallback', () => {
	it('allows mock fallback off production', () => {
		expect(() => guardMockCatalogFallback()).not.toThrow();
		expect(() => guardMockCatalogFallback({ saleorAttemptFailed: true })).not.toThrow();
	});
});

describe('guardMockCatalogFallback on production', () => {
	it('throws when Saleor is not configured', async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(true);

		expect(() => guardMockCatalogFallback()).toThrow(CatalogUnavailableError);
		expect(() => guardMockCatalogFallback()).toThrow(/PUBLIC_SALEOR_API_URL/);
	});

	it('throws Saleor error message when query failed', async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(true);

		expect(() =>
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: new Error('network down') })
		).toThrow('network down');
	});
});
