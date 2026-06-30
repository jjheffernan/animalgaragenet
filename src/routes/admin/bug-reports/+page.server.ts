import { listBugReports } from '$lib/server/support/repository';
import { createAdminClient } from '$lib/server/supabase/admin';
import type { PageServerLoad } from './$types';

// @inspiration-scaffold: intentional — staff bug report inbox (read-only); see docs/plans/active/inspiration-polish-tracker.md#IP-031
export const load: PageServerLoad = async () => {
	const reports = await listBugReports();
	const source = createAdminClient() ? ('supabase' as const) : ('mock' as const);
	return { reports, source };
};
