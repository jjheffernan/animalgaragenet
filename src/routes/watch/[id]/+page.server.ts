// @inspiration-scaffold: intentional — see docs/plans/active/inspiration-polish-coordination.md#IP-014
import { error } from '@sveltejs/kit';
import { getLatestVideo, getVideoById, getVideosExcluding } from '$lib/data/mock/videos';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const video = getVideoById(params.id);
	if (!video) error(404, 'Video not found');
	const featuredVideo = getLatestVideo();
	const listVideos = featuredVideo ? getVideosExcluding(featuredVideo) : [];
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, video, featuredVideo };
};
