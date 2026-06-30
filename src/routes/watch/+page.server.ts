import { paginateFromUrl } from '$lib/pagination';
import { loadWatchHubVideos } from '$lib/server/youtube/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const { featuredVideo, listVideos } = await loadWatchHubVideos();
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, featuredVideo };
};
