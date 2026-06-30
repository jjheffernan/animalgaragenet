const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
	ok: boolean;
	retryAfterMs?: number;
}

/** Simple in-memory rate limiter for serverless/dev; resets per window. */
export function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number,
	now = Date.now()
): RateLimitResult {
	const entry = buckets.get(key);
	if (!entry || now >= entry.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { ok: true };
	}
	if (entry.count >= limit) {
		return { ok: false, retryAfterMs: Math.max(0, entry.resetAt - now) };
	}
	entry.count += 1;
	return { ok: true };
}

/** @internal test helper */
export function _resetRateLimitsForTests(): void {
	buckets.clear();
}
