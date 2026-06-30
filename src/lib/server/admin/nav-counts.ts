import { listPendingBuildLogs } from '$lib/server/build-logs/repository';
import { listBugReports } from '$lib/server/support/repository';
import { listPendingTestimonials } from '$lib/server/testimonials/repository';

export interface AdminNavCounts {
	builds: number;
	testimonials: number;
	openBugs: number;
}

/** Pending moderation and open support counts for sidebar badges. */
export async function getAdminNavCounts(): Promise<AdminNavCounts> {
	const [builds, testimonials, reports] = await Promise.all([
		listPendingBuildLogs(),
		listPendingTestimonials(),
		listBugReports()
	]);

	return {
		builds: builds.length,
		testimonials: testimonials.length,
		openBugs: reports.filter((report) => report.status === 'open').length
	};
}
