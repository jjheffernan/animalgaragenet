import { guardProductionMockFallback } from '$lib/server/mock-fallback-guard';
import { isSaleorEnabled } from '$lib/server/saleor/client';

export class CatalogUnavailableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CatalogUnavailableError';
	}
}

/**
 * Mock catalog fallback is allowed in local dev only.
 * On production `PUBLIC_SITE_URL`, Saleor must be configured and healthy.
 */
// @saleor-migration: intentional — production gate for mock fallback; see docs/commerce/saleor.md#quick-migration
export function guardMockCatalogFallback(
	opts: {
		saleorAttemptFailed?: boolean;
		error?: unknown;
	} = {}
): void {
	guardProductionMockFallback(CatalogUnavailableError, {
		attemptFailed: opts.saleorAttemptFailed,
		error: opts.error,
		missingConfigMessage: 'PUBLIC_SALEOR_API_URL must be configured for production catalog',
		attemptFailedMessage: 'Saleor catalog query failed; mock fallback disabled in production'
	});
}

/** Saleor fetch when enabled; mock after guard. Return `undefined` from saleorFn to reject weak results. */
export async function withSaleorCatalog<T>(
	saleorFn: () => Promise<T | undefined>,
	mockFn: () => T
): Promise<T> {
	if (isSaleorEnabled()) {
		try {
			const result = await saleorFn();
			if (result !== undefined) return result;
		} catch (err) {
			guardMockCatalogFallback({ saleorAttemptFailed: true, error: err });
		}
	}

	guardMockCatalogFallback();
	return mockFn();
}
