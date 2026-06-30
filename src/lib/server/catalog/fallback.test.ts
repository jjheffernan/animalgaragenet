import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogUnavailableError, guardMockCatalogFallback, withSaleorCatalog } from './fallback';

vi.mock('$lib/server/auth/local-dev', () => ({
	isProductionSiteUrl: vi.fn(() => false)
}));

vi.mock('$lib/server/saleor/client', () => ({
	isSaleorEnabled: vi.fn(() => false)
}));

import { isSaleorEnabled } from '$lib/server/saleor/client';

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

describe('withSaleorCatalog', () => {
	beforeEach(async () => {
		const { isProductionSiteUrl } = await import('$lib/server/auth/local-dev');
		vi.mocked(isProductionSiteUrl).mockReturnValue(false);
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('returns mock when Saleor is disabled', async () => {
		const saleorFn = vi.fn(async () => 'saleor' as const);
		const mockFn = vi.fn(() => 'mock' as const);

		await expect(withSaleorCatalog(saleorFn, mockFn)).resolves.toBe('mock');
		expect(saleorFn).not.toHaveBeenCalled();
	});

	it('returns Saleor result when enabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		const mockFn = vi.fn(() => 'mock' as const);

		await expect(withSaleorCatalog(async () => 'saleor' as const, mockFn)).resolves.toBe('saleor');
		expect(mockFn).not.toHaveBeenCalled();
	});

	it('falls back to mock when Saleor fn returns undefined', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		const mockFn = vi.fn(() => 'mock' as const);

		await expect(withSaleorCatalog(async () => undefined, mockFn)).resolves.toBe('mock');
	});

	it('falls back to mock when Saleor fn throws', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		const mockFn = vi.fn(() => 'mock' as const);

		await expect(
			withSaleorCatalog(async () => {
				throw new Error('network');
			}, mockFn)
		).resolves.toBe('mock');
	});
});
