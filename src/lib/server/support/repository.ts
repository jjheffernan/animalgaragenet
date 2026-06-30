import { env } from '$env/dynamic/private';
import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';
import type { BugReport, BugReportInput } from '$lib/types/bug-report';

const mockStore: BugReport[] = [];

function rowToBugReport(row: Record<string, unknown>): BugReport {
	return {
		id: String(row.id),
		email: row.email ? String(row.email) : null,
		userId: row.user_id ? String(row.user_id) : null,
		category: row.category as BugReport['category'],
		description: String(row.description),
		steps: String(row.steps),
		pageUrl: row.page_url ? String(row.page_url) : null,
		status: row.status as BugReport['status'],
		createdAt: String(row.created_at)
	};
}

// @inspiration-scaffold: intentional — POST to support email webhook when BUG_REPORT_WEBHOOK_URL set;
// see docs/plans/active/inspiration-polish-tracker.md#IP-031
async function notifyBugReportWebhook(report: BugReport): Promise<void> {
	const webhookUrl = env.BUG_REPORT_WEBHOOK_URL?.trim();
	if (!webhookUrl) return;

	try {
		await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				type: 'bug_report',
				id: report.id,
				category: report.category,
				description: report.description,
				steps: report.steps,
				pageUrl: report.pageUrl,
				email: report.email,
				userId: report.userId,
				createdAt: report.createdAt
			})
		});
	} catch (error) {
		console.error('bug report webhook failed:', error);
	}
}

// @inspiration-scaffold: intentional — /support/report-bug persistence; see docs/plans/active/inspiration-polish-tracker.md#IP-031
export async function createBugReport(input: BugReportInput): Promise<BugReport | null> {
	const limits = LIMITS.bugReport;
	const payload = {
		email: input.email ? trimToMax(input.email, limits.email) : null,
		user_id: input.userId ?? null,
		category: input.category,
		description: trimToMax(input.description, limits.description),
		steps: trimToMax(input.steps, limits.steps),
		page_url: input.pageUrl ? trimToMax(input.pageUrl, limits.pageUrl) : null,
		status: 'open' as const
	};

	const admin = createAdminClient();
	if (!admin) {
		const report: BugReport = {
			id: crypto.randomUUID(),
			email: payload.email,
			userId: payload.user_id,
			category: payload.category,
			description: payload.description,
			steps: payload.steps,
			pageUrl: payload.page_url,
			status: 'open',
			createdAt: new Date().toISOString()
		};
		mockStore.push(report);
		await notifyBugReportWebhook(report);
		return report;
	}

	const { data, error } = await admin.from('bug_reports').insert(payload).select('*').single();

	if (error || !data) {
		console.error('bug_reports insert failed:', error?.message);
		return null;
	}

	const report = rowToBugReport(data);
	await notifyBugReportWebhook(report);
	return report;
}

// @inspiration-scaffold: intentional — admin support inbox (future /admin/support)
export async function listBugReports(limit = 50): Promise<BugReport[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
	}

	const { data, error } = await admin
		.from('bug_reports')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error || !data) return [];
	return data.map(rowToBugReport);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.length = 0;
}
