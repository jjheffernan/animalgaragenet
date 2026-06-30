// @inspiration-scaffold: intentional — see docs/plans/active/inspiration-polish-tracker.md#IP-014
import { getLatestVideo, getVideosExcluding } from '$lib/data/mock/videos';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// TODO: prefer Supabase `videos` table when YouTube sync (IP-009) is live
	const featuredVideo = getLatestVideo();
	const listVideos = featuredVideo ? getVideosExcluding(featuredVideo) : [];
	const { items, pagination } = paginateFromUrl(url, listVideos);
	return { videos: items, pagination, featuredVideo };
};
