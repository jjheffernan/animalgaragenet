import { env } from '$env/dynamic/private';

export interface GhostFetchOptions {
	path: string;
	searchParams?: Record<string, string>;
}

/** True when `GHOST_URL` and `GHOST_CONTENT_API_KEY` are both set. */
export function isGhostEnabled(): boolean {
	return Boolean(env.GHOST_URL?.trim() && env.GHOST_CONTENT_API_KEY?.trim());
}

function ghostBaseUrl(): string {
	const url = env.GHOST_URL?.trim();
	if (!url) {
		throw new Error('GHOST_URL not configured');
	}
	return url.replace(/\/$/, '');
}

function ghostContentApiKey(): string {
	const key = env.GHOST_CONTENT_API_KEY?.trim();
	if (!key) {
		throw new Error('GHOST_CONTENT_API_KEY not configured');
	}
	return key;
}

export async function ghostFetch<T>({
	path,
	searchParams = {}
}: GhostFetchOptions): Promise<T | null> {
	if (!isGhostEnabled()) {
		return null;
	}

	const url = new URL(`${ghostBaseUrl()}/ghost/api/content${path}`);
	url.searchParams.set('key', ghostContentApiKey());
	for (const [key, value] of Object.entries(searchParams)) {
		url.searchParams.set(key, value);
	}

	try {
		const response = await fetch(url.toString(), {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error(`Ghost API error: ${response.status} ${response.statusText}`);
			return null;
		}

		return (await response.json()) as T;
	} catch (error) {
		console.error('Ghost API request failed:', error);
		return null;
	}
}
