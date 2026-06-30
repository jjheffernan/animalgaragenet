import type { Video } from '$lib/types/domain';
import { mockVideos } from '$lib/data/mock/videos';

/** Raw payload from YouTube Data API v3 (subset). */
export interface YouTubeApiVideo {
	youtubeId: string;
	title: string;
	description: string;
	thumbnail: string;
	duration: string;
	publishedAt: string;
}

/**
 * Fetch uploads from a channel via YouTube Data API v3.
 * Stub — replace with channels.list → uploads playlist → playlistItems.list → videos.list.
 */
export async function fetchChannelVideos(
	_apiKey: string,
	channelId: string
): Promise<YouTubeApiVideo[]> {
	// Mock: return a slice of catalog videos tagged with synthetic channel metadata
	return mockVideos.slice(0, 4).map((v) => ({
		youtubeId: v.youtubeId,
		title: v.title,
		description: v.description,
		thumbnail: v.thumbnail,
		duration: v.duration,
		publishedAt: v.publishedAt ?? new Date().toISOString().slice(0, 10)
	}));
}

function mapToVideo(apiVideo: YouTubeApiVideo, channelId: string): Video {
	return {
		id: `yt-${channelId}-${apiVideo.youtubeId}`,
		youtubeId: apiVideo.youtubeId,
		title: apiVideo.title,
		description: apiVideo.description,
		longDescription: apiVideo.description,
		publishedAt: apiVideo.publishedAt,
		thumbnail: apiVideo.thumbnail,
		duration: apiVideo.duration,
		linkedProductIds: []
	};
}

export interface SyncResult {
	channelId: string;
	upserted: number;
	videos: Video[];
	syncedAt: string;
}

/**
 * Sync channel uploads into the videos table (mock upsert).
 * Production: Supabase upsert on `videos` with conflict on `youtube_id`.
 */
export async function syncToDatabase(channelId: string, apiKey = ''): Promise<SyncResult> {
	const fetched = await fetchChannelVideos(apiKey, channelId);
	const videos = fetched.map((v) => mapToVideo(v, channelId));

	return {
		channelId,
		upserted: videos.length,
		videos,
		syncedAt: new Date().toISOString()
	};
}

/** Cron / webhook entry point — wire to Vercel cron or Supabase pg_cron. */
export async function syncAllChannels(
	channelIds: string[],
	apiKey: string
): Promise<SyncResult[]> {
	return Promise.all(channelIds.map((id) => syncToDatabase(id, apiKey)));
}
