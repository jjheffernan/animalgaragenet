import { listPendingBuildLogs } from '$lib/server/build-logs/repository';
import { listPendingTestimonials } from '$lib/server/testimonials/repository';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const [pendingBuilds, pendingTestimonials] = await Promise.all([
		listPendingBuildLogs(),
		listPendingTestimonials()
	]);

	return {
		session: locals.session,
		devAdmin: locals.devAdmin,
		navBadges: {
			'/admin/builds': pendingBuilds.length,
			'/admin/testimonials': pendingTestimonials.length
		} satisfies Record<string, number>
	};
};
