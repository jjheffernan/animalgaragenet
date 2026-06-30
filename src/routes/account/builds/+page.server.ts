import { listBuildLogsForUser } from '$lib/server/build-logs/repository';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();
	const allLogs = await listBuildLogsForUser(user.id);
	const { items, pagination } = paginateFromUrl(url, allLogs);
	return { logs: items, pagination };
};
