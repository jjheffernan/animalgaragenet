import { json } from '@sveltejs/kit';
import { config } from '$lib/config/env';
import { parseRateLimitedJsonPost } from '$lib/server/api/parse-rate-limited-json';
import { subscribeNewsletter } from '$lib/server/newsletter/repository';
import type { RequestHandler } from './$types';

/**
 * POST /api/newsletter/subscribe — footer / marketing opt-in.
 *
 * @inspiration-scaffold: intentional — add double-opt-in email when ESP wired;
 * see docs/plans/active/inspiration-polish-tracker.md#IP-008
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const parsed = await parseRateLimitedJsonPost(request, getClientAddress, {
		key: 'newsletter',
		limit: 5
	});
	if (!parsed.ok) return parsed.response;

	const { body } = parsed;
	const email = String(body.email ?? '').trim();
	const locale = body.locale ? String(body.locale) : config.defaultLocale;
	const source = body.source ? String(body.source) : 'footer';

	if (!email.includes('@')) {
		return json({ error: 'Valid email required' }, { status: 400 });
	}

	const result = await subscribeNewsletter({ email, locale, source });
	if (!result.ok) {
		return json({ error: 'Unable to subscribe' }, { status: 500 });
	}

	return json({ ok: true });
};
