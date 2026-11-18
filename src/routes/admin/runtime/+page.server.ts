import { getRuntimeStatus, listRuntimeCronTriggers } from '#lib/server/admin/runtime-status.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	status: getRuntimeStatus(),
	cronTriggers: listRuntimeCronTriggers(),
	checkedAt: new Date().toISOString()
});
