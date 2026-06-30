import { getAdminNavCounts } from '$lib/server/admin/nav-counts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session,
		devAdmin: locals.devAdmin,
		navCounts: await getAdminNavCounts()
	};
};
