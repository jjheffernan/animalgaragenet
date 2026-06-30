import type { SessionUser } from '$lib/server/supabase/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: SessionUser | null;
			devAdmin: boolean;
		}
		interface PageData {
			session: SessionUser | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
