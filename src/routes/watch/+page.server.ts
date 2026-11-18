import { paginateFromUrl } from '#lib/pagination.ts';
import { loadWatchHubVideos } from '#lib/server/youtube/public.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { featuredVideo, listVideos } = await loadWatchHubVideos();
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, featuredVideo };
};
