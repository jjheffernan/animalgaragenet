/**
 * Supabase env resolution — shared by SvelteKit server code and CLI scripts.
 *
 * Netlify Supabase integration sets `SUPABASE_DATABASE_URL` (Postgres), not the REST API URL.
 * Derive `https://<ref>.supabase.co` from the connection string hostname or pooler username.
 */

export interface SupabaseEnv {
	url: string;
	anonKey: string;
}

/** Extract project ref from Postgres host and/or username (pooler URLs). */
export function extractProjectRef(host: string, username = ''): string | null {
	const dbHost = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
	if (dbHost) return dbHost[1];

	const directHost = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
	if (directHost && directHost[1] !== 'db') return directHost[1];

	const poolerUser = username.match(/^postgres\.([a-z0-9]+)$/i);
	if (poolerUser) return poolerUser[1];

	return null;
}

/** Derive Supabase REST API URL from `SUPABASE_DATABASE_URL` or legacy `PUBLIC_SUPABASE_URL`. */
export function deriveSupabaseApiUrl(
	databaseUrl: string | undefined,
	legacyPublicUrl?: string
): string | null {
	const legacy = legacyPublicUrl?.trim();
	if (legacy) return legacy.replace(/\/$/, '');

	const raw = databaseUrl?.trim();
	if (!raw) return null;

	try {
		const normalized = raw.replace(/^postgres(ql)?:\/\//i, 'http://');
		const parsed = new URL(normalized);
		const ref = extractProjectRef(parsed.hostname, parsed.username);
		if (ref) return `https://${ref}.supabase.co`;
	} catch {
		// fall through
	}

	return null;
}

/** Resolve server-side Supabase client config from env record (process.env or SvelteKit private env). */
export function resolveSupabaseEnv(env: Record<string, string | undefined>): SupabaseEnv | null {
	const url = deriveSupabaseApiUrl(env.SUPABASE_DATABASE_URL, env.PUBLIC_SUPABASE_URL);
	const anonKey = env.SUPABASE_ANON_KEY?.trim();
	if (!url || !anonKey) return null;
	return { url, anonKey };
}
