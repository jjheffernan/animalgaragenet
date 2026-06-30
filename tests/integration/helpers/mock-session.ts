import type { SessionUser } from '$lib/server/supabase/auth';

export const DEFAULT_SESSION: SessionUser = {
	id: 'mock-user-1',
	email: 'builder@example.com',
	name: 'Builder',
	role: 'customer'
};

export function mockSession(overrides: Partial<SessionUser> = {}): SessionUser {
	return { ...DEFAULT_SESSION, ...overrides };
}

/** Minimal RequestEvent-shaped object for SvelteKit form actions in integration tests. */
export function formActionEvent(
	path: string,
	fields: Record<string, string>,
	options: { session?: SessionUser | null; devAdmin?: boolean } = {}
) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}
	const request = new Request(`http://localhost${path}`, { method: 'POST', body: formData });
	return {
		request,
		locals: {
			session: options.session === undefined ? DEFAULT_SESSION : options.session,
			devAdmin: options.devAdmin ?? false
		}
	};
}
