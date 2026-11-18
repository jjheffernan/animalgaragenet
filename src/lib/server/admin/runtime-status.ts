import { YOUTUBE_SYNC_SECRET, SITE_LOCKED } from '$app/env/private';
import { isProductionSiteUrl } from '#lib/server/auth/local-dev.ts';
import { isGhostEnabled } from '#lib/server/ghost/client.ts';
import { isSaleorEnabled } from '#lib/server/saleor/client.ts';
import { isSupabaseConfigured } from '#lib/server/supabase/client.ts';

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
			configured: Boolean(YOUTUBE_SYNC_SECRET?.trim())
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
		youtubeSyncConfigured: Boolean(YOUTUBE_SYNC_SECRET?.trim()),
		siteLocked: SITE_LOCKED === 'true'
	};
}
