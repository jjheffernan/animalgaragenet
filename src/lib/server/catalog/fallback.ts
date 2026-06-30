import { isProductionSiteUrl } from '$lib/server/auth/local-dev';

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
export function guardMockCatalogFallback(opts: {
	saleorAttemptFailed?: boolean;
	error?: unknown;
} = {}): void {
	if (!isProductionSiteUrl()) return;

	if (opts.saleorAttemptFailed) {
		const message =
			opts.error instanceof Error
				? opts.error.message
				: 'Saleor catalog query failed; mock fallback disabled in production';
		throw new CatalogUnavailableError(message);
	}

	throw new CatalogUnavailableError(
		'PUBLIC_SALEOR_API_URL must be configured for production catalog'
	);
}
