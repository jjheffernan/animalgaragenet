import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '$lib/config/env';
import { createAdminClient } from '$lib/server/supabase/admin';

export interface SupabaseClientConfig {
	url: string;
	anonKey: string;
}

export function isSupabaseConfigured(): boolean {
	return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export function getSupabaseConfig(): SupabaseClientConfig | null {
	if (!isSupabaseConfigured()) {
		return null;
	}

	return {
		url: config.supabaseUrl,
		anonKey: config.supabaseAnonKey
	};
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

/** @deprecated Use createAdminClient() from `$lib/server/supabase/admin` */
export async function createSupabaseClient() {
	return createAdminClient();
}
