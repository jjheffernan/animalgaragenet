import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { addYouTubeChannel, listYouTubeChannels } from '$lib/server/youtube/repository';
import { syncToDatabase } from '$lib/server/youtube/sync';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	channels: await listYouTubeChannels()
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

		const added = await addYouTubeChannel({ channelId, handle, title });
		if (!added) {
			return fail(400, { error: 'Channel already connected or save failed.' });
		}

		return { added: true };
	},

	sync: async ({ request }) => {
		const data = await request.formData();
		const channelId = String(data.get('channelId') ?? '').trim();

		if (!channelId) {
			return fail(400, { error: 'Missing channel ID.' });
		}

		const channels = await listYouTubeChannels();
		const channel = channels.find((c) => c.channelId === channelId);
		if (!channel) {
			return fail(404, { error: 'Channel not found.' });
		}

		const result = await syncToDatabase(channelId, env.YOUTUBE_API_KEY ?? '');

		return {
			synced: true,
			upserted: result.upserted,
			channelId
		};
	}
};
