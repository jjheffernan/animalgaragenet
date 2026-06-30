import { mockAdminUsers } from '$lib/data/mock/admin-users';
import { listAdminUsers } from '$lib/server/supabase/admin-users';
import { listBugReports } from '$lib/server/support/repository';
import { createAdminClient } from '$lib/server/supabase/admin';

export type CommerceKpiSource = 'mirror' | 'mock' | 'empty';

export interface DashboardStats {
	orders: number;
	revenueLabel: string;
	users: number;
	openBugs: number;
	commerceSource: CommerceKpiSource;
}

function formatRevenue(totalCents: number, currency: string): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(totalCents / 100);
}

async function getOrderMirrorKpis(): Promise<{
	orders: number;
	revenueLabel: string;
	source: CommerceKpiSource;
}> {
	const admin = createAdminClient();
	if (!admin) {
		return { orders: 12, revenueLabel: '—', source: 'mock' };
	}

	const monthStart = new Date();
	monthStart.setUTCDate(1);
	monthStart.setUTCHours(0, 0, 0, 0);

	const { data, error } = await admin
		.from('order_snapshots')
		.select('total_cents, currency')
		.gte('ordered_at', monthStart.toISOString());

	if (error || !data?.length) {
		return { orders: 0, revenueLabel: '—', source: 'empty' };
	}

	const totalCents = data.reduce((sum, row) => sum + Number(row.total_cents ?? 0), 0);
	const currency = String(data[0]?.currency ?? 'USD');

	return {
		orders: data.length,
		revenueLabel: formatRevenue(totalCents, currency),
		source: 'mirror'
	};
}

/** KPI counts for `/admin/dashboard` — commerce from order mirror when Supabase is set. */
export async function getDashboardStats(): Promise<DashboardStats> {
	const reports = await listBugReports();
	const openBugs = reports.filter((report) => report.status === 'open').length;

	const liveUsers = await listAdminUsers();
	const users = liveUsers !== null ? liveUsers.length : mockAdminUsers.length;

	const { orders, revenueLabel, source: commerceSource } = await getOrderMirrorKpis();

	return { orders, revenueLabel, users, openBugs, commerceSource };
}
