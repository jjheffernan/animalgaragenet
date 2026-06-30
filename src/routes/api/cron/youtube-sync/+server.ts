import { json } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { listYouTubeChannels } from '$lib/server/youtube/repository';
import { syncAllChannels } from '$lib/server/youtube/sync';
import { verifySharedSecret } from '$lib/server/webhook-signature';
import type { RequestHandler } from './$types';

/**
 * Cron entry: sync all registered YouTube channels.
 * Requires `YOUTUBE_SYNC_SECRET` and request header `x-youtube-sync-secret`.
 */
export const POST: RequestHandler = async ({ request }) => {
	const secret = privateEnv.YOUTUBE_SYNC_SECRET;
	if (secret) {
		if (!verifySharedSecret(request.headers.get('x-youtube-sync-secret'), secret)) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
	} else {
		return json({ error: 'YouTube sync not configured' }, { status: 501 });
	}

	const apiKey = privateEnv.YOUTUBE_API_KEY ?? '';
	const channels = await listYouTubeChannels();
	const channelIds = channels.map((c) => c.channelId);
	const results = await syncAllChannels(channelIds, apiKey);

	return json({
		ok: true,
		synced: results.length,
		upserted: results.reduce((sum, r) => sum + r.upserted, 0)
	});
};
