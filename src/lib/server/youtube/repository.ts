import { mockYouTubeChannels } from '$lib/data/mock/youtube-channels';
import { createAdminClient } from '$lib/server/supabase/admin';
import { trimToMax } from '$lib/server/validation/limits';
import type { Video } from '$lib/types/domain';

export interface YouTubeChannelRecord {
	id: string;
	channelId: string;
	handle: string;
	title: string;
	lastSyncedAt: string | null;
	createdAt: string;
	videoCount?: number;
}

function rowToChannel(row: Record<string, unknown>): YouTubeChannelRecord {
	return {
		id: String(row.id),
		channelId: String(row.channel_id),
		handle: String(row.handle),
		title: String(row.title),
		lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : null,
		createdAt: String(row.created_at)
	};
}

function rowToVideo(row: Record<string, unknown>): Video {
	return {
		id: String(row.id),
		youtubeId: String(row.youtube_id),
		title: String(row.title),
		description: String(row.description ?? ''),
		longDescription: row.long_description ? String(row.long_description) : undefined,
		publishedAt: row.published_at ? String(row.published_at) : undefined,
		thumbnail: String(row.thumbnail ?? ''),
		duration: String(row.duration ?? ''),
		linkedProductIds: Array.isArray(row.linked_product_ids)
			? (row.linked_product_ids as string[])
			: []
	};
}

// @inspiration-scaffold: intentional — YouTube channel manager; see docs/plans/active/inspiration-polish-coordination.md#IP-007
export async function listYouTubeChannels(): Promise<YouTubeChannelRecord[]> {
	const admin = createAdminClient();
	if (!admin) {
		return mockYouTubeChannels.map((c) => ({
			id: c.id,
			channelId: c.channelId,
			handle: c.handle,
			title: c.title,
			lastSyncedAt: c.lastSyncedAt ?? null,
			createdAt: new Date().toISOString(),
			videoCount: c.videoCount
		}));
	}

	const { data, error } = await admin
		.from('youtube_channels')
		.select('*')
		.order('created_at', { ascending: true });

	if (error || !data) return [];
	return data.map(rowToChannel);
}

export async function addYouTubeChannel(input: {
	channelId: string;
	handle: string;
	title: string;
}): Promise<YouTubeChannelRecord | null> {
	const channelId = trimToMax(input.channelId, 64);
	const handle = trimToMax(input.handle, 80);
	const title = trimToMax(input.title, 120);
	if (!channelId || !handle || !title) return null;

	const admin = createAdminClient();
	if (!admin) {
		const exists = mockYouTubeChannels.some((c) => c.channelId === channelId);
		if (exists) return null;
		const record = {
			id: `yc${mockYouTubeChannels.length + 1}`,
			channelId,
			handle: handle.startsWith('@') ? handle : `@${handle}`,
			title,
			videoCount: 0
		};
		mockYouTubeChannels.push(record);
		return {
			id: record.id,
			channelId: record.channelId,
			handle: record.handle,
			title: record.title,
			lastSyncedAt: null,
			createdAt: new Date().toISOString(),
			videoCount: 0
		};
	}

	const { data, error } = await admin
		.from('youtube_channels')
		.insert({ channel_id: channelId, handle, title })
		.select('*')
		.single();

	if (error || !data) {
		console.error('youtube_channels insert failed:', error?.message);
		return null;
	}
	return rowToChannel(data);
}

// @inspiration-scaffold: intentional — sync upsert from youtube/sync.ts
export async function upsertSyncedVideos(
	channelId: string,
	videos: Video[],
	syncedAt: string
): Promise<number> {
	const admin = createAdminClient();
	if (!admin) {
		const channel = mockYouTubeChannels.find((c) => c.channelId === channelId);
		if (channel) {
			channel.lastSyncedAt = syncedAt;
			channel.videoCount = videos.length;
		}
		return videos.length;
	}

	const rows = videos.map((v) => ({
		youtube_id: v.youtubeId,
		channel_id: channelId,
		title: v.title,
		description: v.description,
		long_description: v.longDescription ?? v.description,
		thumbnail: v.thumbnail,
		duration: v.duration,
		published_at: v.publishedAt ?? null,
		linked_product_ids: v.linkedProductIds
	}));

	const { error: videoError } = await admin.from('videos').upsert(rows, { onConflict: 'youtube_id' });
	if (videoError) {
		console.error('videos upsert failed:', videoError.message);
		return 0;
	}

	await admin
		.from('youtube_channels')
		.update({ last_synced_at: syncedAt })
		.eq('channel_id', channelId);

	return videos.length;
}

export async function listPublicVideos(limit = 24): Promise<Video[]> {
	const admin = createAdminClient();
	if (!admin) return [];

	const { data, error } = await admin
		.from('videos')
		.select('*')
		.order('published_at', { ascending: false, nullsFirst: false })
		.limit(limit);

	if (error || !data) return [];
	return data.map(rowToVideo);
}
