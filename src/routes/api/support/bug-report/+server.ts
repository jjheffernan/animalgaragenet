import { json } from '@sveltejs/kit';
import { parseRateLimitedJsonPost } from '$lib/server/api/parse-rate-limited-json';
import { createBugReport } from '$lib/server/support/repository';
import { validateBugReportPayload } from '$lib/server/support/bug-report-validation';
import type { RequestHandler } from './$types';

/**
 * POST /api/support/bug-report — public bug report form.
 *
 * @inspiration-scaffold: intentional — email staff via BUG_REPORT_WEBHOOK_URL when set;
 * see docs/plans/active/inspiration-polish-tracker.md#IP-031
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const parsed = await parseRateLimitedJsonPost(request, getClientAddress, {
		key: 'bug-report',
		limit: 5
	});
	if (!parsed.ok) return parsed.response;

	const validated = validateBugReportPayload(parsed.body, { sessionEmail: locals.session?.email });
	if (!validated.ok) {
		return json({ error: validated.error }, { status: 400 });
	}

	const report = await createBugReport({
		...validated.data,
		userId: locals.session?.id ?? null
	});

	if (!report) {
		return json({ error: 'Unable to submit bug report' }, { status: 500 });
	}

	return json({ ok: true, id: report.id });
};
