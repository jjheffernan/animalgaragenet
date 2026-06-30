import { BUG_REPORT_CATEGORIES, type BugReportCategory } from '$lib/types/bug-report';
import { LIMITS } from '$lib/server/validation/limits';

const CATEGORY_VALUES = new Set<string>(BUG_REPORT_CATEGORIES.map((c) => c.value));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface BugReportPayload {
	email?: string;
	category?: string;
	description?: string;
	steps?: string;
	pageUrl?: string;
}

export interface ValidatedBugReport {
	email: string | null;
	category: BugReportCategory;
	description: string;
	steps: string;
	pageUrl: string | null;
}

export function isBugReportCategory(value: string): value is BugReportCategory {
	return CATEGORY_VALUES.has(value);
}

export function validateBugReportPayload(
	body: BugReportPayload,
	options?: { sessionEmail?: string | null }
): { ok: true; data: ValidatedBugReport } | { ok: false; error: string } {
	const sessionEmail = options?.sessionEmail?.trim() || null;
	const rawEmail = String(body.email ?? '').trim();
	const email = rawEmail || sessionEmail;

	if (!email) {
		return { ok: false, error: 'Email is required when not signed in' };
	}
	if (!EMAIL_RE.test(email)) {
		return { ok: false, error: 'Enter a valid email address' };
	}
	if (email.length > LIMITS.bugReport.email) {
		return { ok: false, error: `Email must be ${LIMITS.bugReport.email} characters or less` };
	}

	const category = String(body.category ?? '').trim();
	if (!isBugReportCategory(category)) {
		return { ok: false, error: 'Select a valid category' };
	}

	const description = String(body.description ?? '').trim();
	if (!description) {
		return { ok: false, error: 'Description is required' };
	}
	if (description.length < LIMITS.bugReport.descriptionMin) {
		return {
			ok: false,
			error: `Description must be at least ${LIMITS.bugReport.descriptionMin} characters`
		};
	}
	if (description.length > LIMITS.bugReport.description) {
		return {
			ok: false,
			error: `Description must be ${LIMITS.bugReport.description} characters or less`
		};
	}

	const steps = String(body.steps ?? '').trim();
	if (!steps) {
		return { ok: false, error: 'Steps to reproduce are required' };
	}
	if (steps.length < LIMITS.bugReport.stepsMin) {
		return {
			ok: false,
			error: `Steps must be at least ${LIMITS.bugReport.stepsMin} characters`
		};
	}
	if (steps.length > LIMITS.bugReport.steps) {
		return { ok: false, error: `Steps must be ${LIMITS.bugReport.steps} characters or less` };
	}

	const pageUrlRaw = String(body.pageUrl ?? '').trim();
	const pageUrl = pageUrlRaw ? pageUrlRaw.slice(0, LIMITS.bugReport.pageUrl) : null;

	return {
		ok: true,
		data: {
			email,
			category,
			description,
			steps,
			pageUrl
		}
	};
}
