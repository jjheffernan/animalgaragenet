export type BuildLogStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface BuildLog {
	id: string;
	userId: string;
	title: string;
	year: number;
	make: string;
	model: string;
	email: string;
	description: string;
	modList: string;
	status: BuildLogStatus;
	slug: string | null;
	createdAt: string;
	updatedAt: string;
}

export const BUILD_LOG_STATUS_LABELS: Record<BuildLogStatus, string> = {
	draft: 'Draft',
	pending: 'Pending review',
	approved: 'Published',
	rejected: 'Rejected'
};
