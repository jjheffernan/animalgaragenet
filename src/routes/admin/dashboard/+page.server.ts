import { getDashboardActivity } from '#lib/server/admin/dashboard-activity.ts';
import { getDashboardStats } from '#lib/server/admin/dashboard-stats.ts';
import { getRuntimeStatus } from '#lib/server/admin/runtime-status.ts';
import type { PageServerLoad } from './$types';

/** Overview stats — commerce KPIs from order mirror when Supabase is configured. */
export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const [stats, activity] = await Promise.all([getDashboardStats(), getDashboardActivity()]);

	return {
		...parentData,
		stats,
		activity,
		status: getRuntimeStatus()
	};
};
