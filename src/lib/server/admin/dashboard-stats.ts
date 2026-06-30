import { mockAdminUsers } from '$lib/data/mock/admin-users';
import { listAdminUsers } from '$lib/server/supabase/admin-users';
import { listBugReports } from '$lib/server/support/repository';

export interface DashboardStats {
	orders: number;
	revenueLabel: string;
	users: number;
	openBugs: number;
}

/** KPI counts for `/admin/dashboard` — mock commerce fields until Saleor ships. */
export async function getDashboardStats(): Promise<DashboardStats> {
	const reports = await listBugReports();
	const openBugs = reports.filter((report) => report.status === 'open').length;

	const liveUsers = await listAdminUsers();
	const users = liveUsers !== null ? liveUsers.length : mockAdminUsers.length;

	// @inspiration-scaffold: intentional — wire Saleor open-order count; see docs/plans/active/inspiration-polish-tracker.md
	const orders = 12;

	// @inspiration-scaffold: intentional — wire Saleor revenue aggregate (MTD)
	const revenueLabel = '—';

	return { orders, revenueLabel, users, openBugs };
}
