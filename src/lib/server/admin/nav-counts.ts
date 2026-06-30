import { listPendingBuildLogs } from '$lib/server/build-logs/repository';
import { listPendingTestimonials } from '$lib/server/testimonials/repository';

export interface AdminNavCounts {
	builds: number;
	testimonials: number;
}

/** Pending moderation counts for sidebar badges. */
export async function getAdminNavCounts(): Promise<AdminNavCounts> {
	const [builds, testimonials] = await Promise.all([
		listPendingBuildLogs(),
		listPendingTestimonials()
	]);

	return {
		builds: builds.length,
		testimonials: testimonials.length
	};
}
