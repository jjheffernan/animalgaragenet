import { createAdminClient } from '$lib/server/supabase/admin';
import type { SocialPlatformId } from '$lib/data/social-platforms';
import type { SocialConnectionsMap } from '$lib/types/social-connections';
import { parseStoredConnections } from './validation';

const mockConnections = new Map<string, SocialConnectionsMap>();

// @inspiration-scaffold: intentional — account social links; see docs/plans/active/inspiration-polish-tracker.md#IP-027
export async function getUserSocialConnections(userId: string): Promise<SocialConnectionsMap> {
	const admin = createAdminClient();
	if (!admin) {
		return mockConnections.get(userId) ?? {};
	}

	const { data, error } = await admin
		.from('user_preferences')
		.select('social_connections')
		.eq('user_id', userId)
		.maybeSingle();

	if (error) {
		console.error('user_preferences social_connections read failed:', error.message);
		return {};
	}

	return parseStoredConnections(data?.social_connections);
}

export async function saveUserSocialConnections(
	userId: string,
	connections: SocialConnectionsMap
): Promise<boolean> {
	const admin = createAdminClient();
	if (!admin) {
		mockConnections.set(userId, connections);
		return true;
	}

	const { error } = await admin
		.from('user_preferences')
		.upsert({ user_id: userId, social_connections: connections }, { onConflict: 'user_id' });

	if (error) {
		console.error('user_preferences social_connections upsert failed:', error.message);
		return false;
	}
	return true;
}

export async function updateUserSocialConnection(
	userId: string,
	platform: SocialPlatformId,
	update: { action: 'connect'; handle: string; mock: boolean } | { action: 'disconnect' }
): Promise<SocialConnectionsMap | null> {
	const current = await getUserSocialConnections(userId);
	const next = { ...current };

	if (update.action === 'disconnect') {
		delete next[platform];
	} else {
		next[platform] = {
			handle: update.handle,
			connectedAt: new Date().toISOString(),
			...(update.mock ? { mock: true } : {})
		};
	}

	const ok = await saveUserSocialConnections(userId, next);
	return ok ? next : null;
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockConnections.clear();
}
