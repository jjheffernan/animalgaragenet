import { isProductionSiteUrl } from '$lib/server/auth/local-dev';

export interface ProductionMockFallbackOptions {
	attemptFailed?: boolean;
	error?: unknown;
	missingConfigMessage: string;
	attemptFailedMessage: string;
}

/** Block silent mock fallback on production `PUBLIC_SITE_URL`. */
export function guardProductionMockFallback(
	ErrorClass: new (message: string) => Error,
	opts: ProductionMockFallbackOptions
): void {
	if (!isProductionSiteUrl()) return;

	if (opts.attemptFailed) {
		const message = opts.error instanceof Error ? opts.error.message : opts.attemptFailedMessage;
		throw new ErrorClass(message);
	}

	throw new ErrorClass(opts.missingConfigMessage);
}
