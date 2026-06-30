import { getLatestVideo, getVideosExcluding } from '$lib/data/mock/videos';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const featuredVideo = getLatestVideo();
	const listVideos = featuredVideo ? getVideosExcluding(featuredVideo) : [];
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, featuredVideo };
};
