import { json } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/server/rate-limit';

export type RateLimitedJsonResult =
	{ ok: true; body: Record<string, unknown> } | { ok: false; response: Response };

/** Shared rate-limit + JSON parse for public POST API routes. */
export async function parseRateLimitedJsonPost(
	request: Request,
	getClientAddress: () => string,
	opts: { key: string; limit: number; windowMs?: number }
): Promise<RateLimitedJsonResult> {
	const limited = checkRateLimit(
		`${opts.key}:${getClientAddress()}`,
		opts.limit,
		opts.windowMs ?? 60_000
	);
	if (!limited.ok) {
		return { ok: false, response: json({ error: 'Too many requests' }, { status: 429 }) };
	}

	try {
		const body = (await request.json()) as Record<string, unknown>;
		return { ok: true, body };
	} catch {
		return { ok: false, response: json({ error: 'Invalid JSON' }, { status: 400 }) };
	}
}
