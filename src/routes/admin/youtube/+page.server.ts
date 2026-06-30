import { fail } from '@sveltejs/kit';
import { mockYouTubeChannels } from '$lib/data/mock-youtube-channels';
import { syncToDatabase } from '$lib/server/youtube/sync';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	channels: mockYouTubeChannels
});

export const actions: Actions = {
	addChannel: async ({ request }) => {
		const data = await request.formData();
		const channelId = String(data.get('channelId') ?? '').trim();
		const handle = String(data.get('handle') ?? '').trim();
		const title = String(data.get('title') ?? '').trim();

		if (!channelId || !handle || !title) {
			return fail(400, { error: 'Channel ID, handle, and title are required.' });
		}

		const exists = mockYouTubeChannels.some((c) => c.channelId === channelId);
		if (exists) {
			return fail(400, { error: 'Channel already connected.' });
		}

		mockYouTubeChannels.push({
			id: `yc${mockYouTubeChannels.length + 1}`,
			channelId,
			handle: handle.startsWith('@') ? handle : `@${handle}`,
			title,
			videoCount: 0
		});

		return { added: true };
	},

	sync: async ({ request }) => {
		const data = await request.formData();
		const channelId = String(data.get('channelId') ?? '').trim();

		if (!channelId) {
			return fail(400, { error: 'Missing channel ID.' });
		}

		const channel = mockYouTubeChannels.find((c) => c.channelId === channelId);
		if (!channel) {
			return fail(404, { error: 'Channel not found.' });
		}

		const result = await syncToDatabase(channelId);
		channel.lastSyncedAt = result.syncedAt;
		channel.videoCount = result.upserted;

		return {
			synced: true,
			upserted: result.upserted,
			channelId
		};
	}
};
