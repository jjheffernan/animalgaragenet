import { isSocialPlatformId } from '$lib/data/social-platforms';
import type { SocialConnection, SocialConnectionsMap } from '$lib/types/social-connections';

const HANDLE_RE = /^[a-zA-Z0-9._-]{1,50}$/;

export interface ConnectionPutBody {
	platform?: unknown;
	action?: unknown;
	handle?: unknown;
	connections?: unknown;
}

export function normalizeHandle(raw: string): string {
	return raw.trim().replace(/^@+/, '');
}

export function validateConnectionPutBody(body: ConnectionPutBody):
	| {
			ok: true;
			platform: string;
			action: 'connect' | 'disconnect';
			handle?: string;
	  }
	| {
			ok: false;
			error: string;
	  } {
	const platform = typeof body.platform === 'string' ? body.platform : '';
	if (!isSocialPlatformId(platform)) {
		return { ok: false, error: 'Invalid or missing platform' };
	}

	const action = body.action === 'disconnect' ? 'disconnect' : 'connect';
	if (action === 'disconnect') {
		return { ok: true, platform, action };
	}

	const handleRaw = typeof body.handle === 'string' ? body.handle : '';
	const handle = normalizeHandle(handleRaw);
	if (!handle) {
		return { ok: false, error: 'Handle is required to connect' };
	}
	if (!HANDLE_RE.test(handle)) {
		return {
			ok: false,
			error: 'Handle must be 1–50 characters (letters, numbers, . _ -)'
		};
	}

	return { ok: true, platform, action, handle };
}

export function parseStoredConnections(raw: unknown): SocialConnectionsMap {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
	const out: SocialConnectionsMap = {};
	for (const [key, value] of Object.entries(raw)) {
		if (!isSocialPlatformId(key) || !value || typeof value !== 'object') continue;
		const row = value as Record<string, unknown>;
		const handle = typeof row.handle === 'string' ? row.handle : '';
		const connectedAt = typeof row.connectedAt === 'string' ? row.connectedAt : '';
		if (!handle || !connectedAt) continue;
		const connection: SocialConnection = { handle, connectedAt };
		if (row.mock === true) connection.mock = true;
		out[key] = connection;
	}
	return out;
}
