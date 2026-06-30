import type { SocialConnectionsMap } from '$lib/types/social-connections';
import type { SocialPlatformId } from '$lib/data/social-platforms';

export interface ConnectionsApiState {
	connections: SocialConnectionsMap;
	platforms: {
		id: SocialPlatformId;
		label: string;
		oauthConfigured: boolean;
		oauthAuthorizeUrl: string | null;
	}[];
	mockMode: boolean;
}

export async function loadConnectionsFromApi(): Promise<ConnectionsApiState | 'guest' | null> {
	try {
		const res = await fetch('/api/account/connections');
		if (res.status === 401) return 'guest';
		if (!res.ok) return null;
		return (await res.json()) as ConnectionsApiState;
	} catch {
		return null;
	}
}

export async function updateConnectionOnApi(
	platform: SocialPlatformId,
	payload: { action: 'connect'; handle: string } | { action: 'disconnect' }
): Promise<{ ok: true; connections: SocialConnectionsMap } | { ok: false; error: string }> {
	try {
		const res = await fetch('/api/account/connections', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ platform, ...payload })
		});
		const data = (await res.json()) as { connections?: SocialConnectionsMap; error?: string };
		if (!res.ok) {
			return { ok: false, error: data.error ?? 'Request failed' };
		}
		return { ok: true, connections: data.connections ?? {} };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}
