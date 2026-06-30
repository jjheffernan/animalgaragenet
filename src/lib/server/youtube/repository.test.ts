import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { mockYouTubeChannels } from '$lib/data/mock/youtube-channels';
import {
	_resetMockStoreForTests,
	getPublicVideoById,
	listPublicVideos,
	upsertSyncedVideos
} from './repository';
import type { Video } from '$lib/types/domain';

const sampleVideos: Video[] = [
	{
		id: 'yt-UCmockAnimalGarage-vid1',
		youtubeId: 'vid1',
		title: 'Synced Upload',
		description: 'Fresh from YouTube',
		longDescription: 'Fresh from YouTube',
		publishedAt: '2026-06-01',
		thumbnail: 'https://cdn.example/thumb.jpg',
		duration: '8:15',
		linkedProductIds: []
	}
];

describe('youtube repository (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('upsertSyncedVideos updates mock channel metadata', async () => {
		const syncedAt = '2026-06-30T12:00:00.000Z';
		const count = await upsertSyncedVideos('UCmockAnimalGarage', sampleVideos, syncedAt);

		expect(count).toBe(1);
		const channel = mockYouTubeChannels.find((c) => c.channelId === 'UCmockAnimalGarage');
		expect(channel?.lastSyncedAt).toBe(syncedAt);
		expect(channel?.videoCount).toBe(1);
	});

	it('listPublicVideos returns empty without admin client', async () => {
		await expect(listPublicVideos()).resolves.toEqual([]);
	});

	it('getPublicVideoById returns null without admin client', async () => {
		await expect(getPublicVideoById('vid1')).resolves.toBeNull();
	});
});

describe('youtube repository (admin client)', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('upsertSyncedVideos writes rows and updates channel sync timestamp', async () => {
		const upsert = vi.fn().mockResolvedValue({ error: null });
		const selectIn = vi.fn().mockResolvedValue({ data: [], error: null });
		const select = vi.fn().mockReturnValue({ in: selectIn });
		const updateEq = vi.fn().mockResolvedValue({ error: null });
		const update = vi.fn().mockReturnValue({ eq: updateEq });
		const from = vi.fn((table: string) => {
			if (table === 'videos') return { select, upsert };
			if (table === 'youtube_channels') return { update };
			throw new Error(`unexpected table ${table}`);
		});

		vi.mocked(createAdminClient).mockReturnValue({ from } as never);

		const syncedAt = '2026-06-30T12:00:00.000Z';
		const count = await upsertSyncedVideos('UCchannel', sampleVideos, syncedAt);

		expect(count).toBe(1);
		expect(select).toHaveBeenCalledWith('youtube_id, linked_product_ids');
		expect(selectIn).toHaveBeenCalledWith('youtube_id', ['vid1']);
		expect(upsert).toHaveBeenCalledWith(
			[
				expect.objectContaining({
					youtube_id: 'vid1',
					channel_id: 'UCchannel',
					title: 'Synced Upload'
				})
			],
			{ onConflict: 'youtube_id' }
		);
		expect(update).toHaveBeenCalledWith({ last_synced_at: syncedAt });
		expect(updateEq).toHaveBeenCalledWith('channel_id', 'UCchannel');
	});
});
