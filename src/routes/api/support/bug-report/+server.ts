import { json } from '@sveltejs/kit';
import { createBugReport } from '$lib/server/support/repository';
import { validateBugReportPayload } from '$lib/server/support/bug-report-validation';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { RequestHandler } from './$types';

/**
 * POST /api/support/bug-report — public bug report form.
 *
 * @inspiration-scaffold: intentional — email staff via BUG_REPORT_WEBHOOK_URL when set;
 * see docs/plans/active/inspiration-polish-tracker.md#IP-031
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const limited = checkRateLimit(`bug-report:${getClientAddress()}`, 5, 60_000);
	if (!limited.ok) {
		return json({ error: 'Too many requests' }, { status: 429 });
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const validated = validateBugReportPayload(body, { sessionEmail: locals.session?.email });
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
