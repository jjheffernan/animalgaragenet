import {
	getLatestVideo,
	getVideoById,
	getVideosExcluding,
	mockVideos
} from '$lib/data/mock/videos';
import { createAdminClient } from '$lib/server/supabase/admin';
import { getPublicVideoById, listPublicVideos } from '$lib/server/youtube/repository';
import type { Video } from '$lib/types/domain';

function sortByPublishedDesc(videos: Video[]): Video[] {
	return [...videos].sort(
		(a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
	);
}

export async function loadWatchHubVideos(): Promise<{
	featuredVideo: Video | undefined;
	listVideos: Video[];
}> {
	const admin = createAdminClient();
	if (!admin) {
		const featuredVideo = getLatestVideo();
		const listVideos = featuredVideo ? getVideosExcluding(featuredVideo) : [...mockVideos];
		return { featuredVideo, listVideos };
	}

	const dbVideos = await listPublicVideos(100);
	if (dbVideos.length === 0) {
		const featuredVideo = getLatestVideo();
		const listVideos = featuredVideo ? getVideosExcluding(featuredVideo) : [...mockVideos];
		return { featuredVideo, listVideos };
	}

	const sorted = sortByPublishedDesc(dbVideos);
	const featuredVideo = sorted[0];
	const listVideos = sorted.slice(1);
	return { featuredVideo, listVideos };
}

export async function resolveWatchVideo(id: string): Promise<Video | null> {
	const admin = createAdminClient();
	if (!admin) return getVideoById(id) ?? null;

	const fromDb = await getPublicVideoById(id);
	if (fromDb) return fromDb;

	return getVideoById(id) ?? null;
}
