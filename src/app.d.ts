import type { SessionUser } from '$lib/server/supabase/auth';
import type { SupabaseClient } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient | null;
			session: SessionUser | null;
			devAdmin: boolean;
			requestId: string;
			traceParent: string | null;
		}
		interface PageData {
			session: SessionUser | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
