import { error } from '@sveltejs/kit';
import { paginateFromUrl } from '$lib/pagination';
import { loadWatchHubVideos, resolveWatchVideo } from '$lib/server/youtube/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const video = await resolveWatchVideo(params.id);
	if (!video) error(404, 'Video not found');

	const { featuredVideo, listVideos } = await loadWatchHubVideos();
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, video, featuredVideo };
};
