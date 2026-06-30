import type { SocialPlatformId } from '$lib/data/social-platforms';

export interface SocialConnection {
	handle: string;
	connectedAt: string;
	/** True when linked via mock handle entry (no OAuth provider keys). */
	mock?: boolean;
}

export type SocialConnectionsMap = Partial<Record<SocialPlatformId, SocialConnection>>;
