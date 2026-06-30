export const BUG_REPORT_CATEGORIES = [
	{ value: 'website', label: 'Website / UI' },
	{ value: 'checkout', label: 'Checkout & payments' },
	{ value: 'account', label: 'Account & orders' },
	{ value: 'shop', label: 'Shop & products' },
	{ value: 'other', label: 'Other' }
] as const;

export type BugReportCategory = (typeof BUG_REPORT_CATEGORIES)[number]['value'];

export type BugReportStatus = 'open' | 'triaged' | 'resolved' | 'closed';

export interface BugReport {
	id: string;
	email: string | null;
	userId: string | null;
	category: BugReportCategory;
	description: string;
	steps: string;
	pageUrl: string | null;
	status: BugReportStatus;
	createdAt: string;
}

export interface BugReportInput {
	email?: string | null;
	userId?: string | null;
	category: BugReportCategory;
	description: string;
	steps: string;
	pageUrl?: string | null;
}
