import { env } from '$env/dynamic/private';
import { isProductionSiteUrl } from '$lib/server/auth/local-dev';
import { isGhostEnabled } from '$lib/server/ghost/client';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { isSupabaseConfigured } from '$lib/server/supabase/client';

export interface RuntimeStatus {
	saleorEnabled: boolean;
	ghostEnabled: boolean;
	supabaseConfigured: boolean;
	mockGuardsActive: boolean;
	youtubeSyncConfigured: boolean;
	siteLocked: boolean;
}

export interface RuntimeCronTrigger {
	id: string;
	label: string;
	path: string;
	configured: boolean;
}

// @inspiration-scaffold: intentional — admin cron trigger registry; see docs/plans/active/inspiration-polish-tracker.md#IP-026
export function listRuntimeCronTriggers(): RuntimeCronTrigger[] {
	return [
		{
			id: 'youtube-sync',
			label: 'YouTube channel sync',
			path: '/api/cron/youtube-sync',
			configured: Boolean(env.YOUTUBE_SYNC_SECRET?.trim())
		}
	];
}

/** Public-safe booleans only — no secret values. */
export function getRuntimeStatus(): RuntimeStatus {
	return {
		saleorEnabled: isSaleorEnabled(),
		ghostEnabled: isGhostEnabled(),
		supabaseConfigured: isSupabaseConfigured(),
		mockGuardsActive: isProductionSiteUrl(),
		youtubeSyncConfigured: Boolean(env.YOUTUBE_SYNC_SECRET?.trim()),
		siteLocked: env.SITE_LOCKED === 'true'
	};
}
