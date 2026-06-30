import { guardProductionMockFallback } from '$lib/server/mock-fallback-guard';

export class GhostContentUnavailableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'GhostContentUnavailableError';
	}
}

/**
 * Mock Ghost fallback is allowed in local dev only.
 * When `GHOST_*` is set on production `PUBLIC_SITE_URL`, Ghost must respond.
 */
// @inspiration-scaffold: intentional — production gate; see docs/plans/AUDIT-REMEDIATION.md AUD-P1-009
export function guardMockGhostFallback(
	opts: {
		ghostAttemptFailed?: boolean;
		error?: unknown;
	} = {}
): void {
	guardProductionMockFallback(GhostContentUnavailableError, {
		attemptFailed: opts.ghostAttemptFailed,
		error: opts.error,
		missingConfigMessage:
			'Ghost content required in production when GHOST_URL and GHOST_CONTENT_API_KEY are set',
		attemptFailedMessage: 'Ghost Content API failed; mock fallback disabled in production'
	});
}
