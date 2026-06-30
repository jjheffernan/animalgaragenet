import { env } from '$env/dynamic/private';
import type { SocialPlatformId } from '$lib/data/social-platforms';

const ENV_KEY: Record<SocialPlatformId, string> = {
	instagram: 'SOCIAL_INSTAGRAM_CLIENT_ID',
	youtube: 'SOCIAL_YOUTUBE_CLIENT_ID',
	tiktok: 'SOCIAL_TIKTOK_CLIENT_KEY',
	discord: 'SOCIAL_DISCORD_CLIENT_ID'
};

/** True when server has OAuth client credentials for linking this platform. */
export function isSocialOAuthConfigured(platform: SocialPlatformId): boolean {
	const key = ENV_KEY[platform];
	return Boolean(env[key]?.trim());
}

// @inspiration-scaffold: intentional — wire platform OAuth authorize URLs;
// see docs/plans/active/inspiration-polish-tracker.md#IP-027
export function socialOAuthAuthorizeUrl(
	platform: SocialPlatformId,
	redirectPath = '/account/connections'
): string | null {
	if (!isSocialOAuthConfigured(platform)) return null;
	// Placeholder — replace with provider-specific authorize URL + state param when keys are set.
	return `/api/account/connections/oauth/${platform}?redirect=${encodeURIComponent(redirectPath)}`;
}
