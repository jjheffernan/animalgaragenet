import type { Video } from '$lib/types/domain';
import { env as privateEnv } from '$env/dynamic/private';
import { mockVideos } from '$lib/data/mock/videos';
import { upsertSyncedVideos } from '$lib/server/youtube/repository';

/** Raw payload from YouTube Data API v3 (subset). */
export interface YouTubeApiVideo {
	youtubeId: string;
	title: string;
	description: string;
	thumbnail: string;
	duration: string;
	publishedAt: string;
}

interface YouTubeChannelsResponse {
	error?: { message: string };
	items?: Array<{
		contentDetails?: { relatedPlaylists?: { uploads?: string } };
	}>;
}

interface YouTubePlaylistItemsResponse {
	error?: { message: string };
	items?: Array<{ contentDetails?: { videoId?: string } }>;
	nextPageToken?: string;
}

interface YouTubeVideosResponse {
	error?: { message: string };
	items?: Array<{
		id: string;
		snippet?: {
			title?: string;
			description?: string;
			publishedAt?: string;
			thumbnails?: Record<string, { url?: string }>;
		};
		contentDetails?: { duration?: string };
	}>;
}

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3';
const MAX_UPLOADS_PER_SYNC = 50;

/** Convert YouTube ISO 8601 duration (PT12M34S) to display form (12:34). */
export function formatYoutubeDuration(iso: string): string {
	const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return iso;
	const hours = Number(match[1] ?? 0);
	const minutes = Number(match[2] ?? 0);
	const seconds = Number(match[3] ?? 0);
	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function pickThumbnail(thumbnails?: Record<string, { url?: string }>): string {
	if (!thumbnails) return '';
	return (
		thumbnails.maxres?.url ??
		thumbnails.standard?.url ??
		thumbnails.high?.url ??
		thumbnails.medium?.url ??
		thumbnails.default?.url ??
		''
	);
}

async function youtubeGet<T>(url: URL): Promise<T | null> {
	const response = await fetch(url.toString());
	const body = (await response.json()) as T & { error?: { message: string } };
	if (!response.ok || body.error) {
		console.error('YouTube API error:', body.error?.message ?? response.status);
		return null;
	}
	return body;
}

async function fetchUploadsPlaylistId(apiKey: string, channelId: string): Promise<string | null> {
	const url = new URL(`${YOUTUBE_API}/channels`);
	url.searchParams.set('part', 'contentDetails');
	url.searchParams.set('id', channelId);
	url.searchParams.set('key', apiKey);

	const body = await youtubeGet<YouTubeChannelsResponse>(url);
	const playlistId = body?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
	return playlistId ?? null;
}

async function fetchPlaylistVideoIds(apiKey: string, playlistId: string): Promise<string[]> {
	const ids: string[] = [];
	let pageToken: string | undefined;

	do {
		const url = new URL(`${YOUTUBE_API}/playlistItems`);
		url.searchParams.set('part', 'contentDetails');
		url.searchParams.set('playlistId', playlistId);
		url.searchParams.set('maxResults', '50');
		url.searchParams.set('key', apiKey);
		if (pageToken) url.searchParams.set('pageToken', pageToken);

		const body = await youtubeGet<YouTubePlaylistItemsResponse>(url);
		if (!body?.items) break;

		for (const item of body.items) {
			const videoId = item.contentDetails?.videoId;
			if (videoId) ids.push(videoId);
		}

		pageToken = body.nextPageToken;
	} while (pageToken && ids.length < MAX_UPLOADS_PER_SYNC);

	return ids.slice(0, MAX_UPLOADS_PER_SYNC);
}

async function fetchVideosByIds(apiKey: string, videoIds: string[]): Promise<YouTubeApiVideo[]> {
	if (videoIds.length === 0) return [];

	const url = new URL(`${YOUTUBE_API}/videos`);
	url.searchParams.set('part', 'snippet,contentDetails');
	url.searchParams.set('id', videoIds.join(','));
	url.searchParams.set('key', apiKey);

	const body = await youtubeGet<YouTubeVideosResponse>(url);
	if (!body?.items) return [];

	return body.items.map((item) => {
		const rawDuration = item.contentDetails?.duration ?? '';
		return {
			youtubeId: item.id,
			title: item.snippet?.title ?? '',
			description: item.snippet?.description ?? '',
			thumbnail: pickThumbnail(item.snippet?.thumbnails),
			duration: rawDuration ? formatYoutubeDuration(rawDuration) : '',
			publishedAt: item.snippet?.publishedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
		};
	});
}

/**
 * Fetch uploads from a channel via YouTube Data API v3.
 * Falls back to mock catalog when `apiKey` is unset.
 */
export async function fetchChannelVideos(
	apiKey: string,
	channelId: string
): Promise<YouTubeApiVideo[]> {
	if (!apiKey) {
		return mockVideos.slice(0, 4).map((v) => ({
			youtubeId: v.youtubeId,
			title: v.title,
			description: v.description,
			thumbnail: v.thumbnail,
			duration: v.duration,
			publishedAt: v.publishedAt ?? new Date().toISOString().slice(0, 10)
		}));
	}

	const playlistId = await fetchUploadsPlaylistId(apiKey, channelId);
	if (!playlistId) return [];

	const videoIds = await fetchPlaylistVideoIds(apiKey, playlistId);
	return fetchVideosByIds(apiKey, videoIds);
}

export function mapToVideo(apiVideo: YouTubeApiVideo, channelId: string): Video {
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

/** Sync channel uploads into the videos table (Supabase upsert or mock fallback). */
export async function syncToDatabase(channelId: string, apiKey?: string): Promise<SyncResult> {
	const key = apiKey ?? privateEnv.YOUTUBE_API_KEY ?? '';
	const fetched = await fetchChannelVideos(key, channelId);
	const videos = fetched.map((v) => mapToVideo(v, channelId));
	const syncedAt = new Date().toISOString();
	const upserted = await upsertSyncedVideos(channelId, videos, syncedAt);

	return {
		channelId,
		upserted,
		videos,
		syncedAt
	};
}

/** Cron / webhook entry point — wire to Vercel cron or Supabase pg_cron. */
export async function syncAllChannels(channelIds: string[], apiKey: string): Promise<SyncResult[]> {
	return Promise.all(channelIds.map((id) => syncToDatabase(id, apiKey)));
}
