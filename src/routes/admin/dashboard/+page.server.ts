import { getDashboardActivity } from '$lib/server/admin/dashboard-activity';
import { getDashboardStats } from '$lib/server/admin/dashboard-stats';
import { getRuntimeStatus } from '$lib/server/admin/runtime-status';
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
