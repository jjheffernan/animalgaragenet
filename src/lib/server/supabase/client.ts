import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv, isSupabaseConfigured } from '#lib/server/supabase/config.ts';
import { createAdminClient } from '#lib/server/supabase/admin.ts';

export type SupabaseClientConfig = NonNullable<ReturnType<typeof getSupabaseEnv>>;

export { isSupabaseConfigured };

export function getSupabaseConfig(): SupabaseClientConfig | null {
	return getSupabaseEnv();
}

/** Request-scoped Supabase client with cookie-based auth (SSR). */
export function createServerClient(event: Pick<RequestEvent, 'cookies'>): SupabaseClient | null {
	const cfg = getSupabaseConfig();
	if (!cfg) return null;

	return createSupabaseServerClient(cfg.url, cfg.anonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

/** @deprecated Use createAdminClient() from `#lib/server/supabase/admin.ts` */
export async function createSupabaseClient() {
	return createAdminClient();
}
