import type { Cookies } from '@sveltejs/kit';
import { getSupabaseConfig } from '$lib/server/supabase/client';

export const SESSION_COOKIE = 'ag-session';

export interface SessionUser {
	id: string;
	email: string;
	name: string;
	role: import('$lib/auth/roles').Role;
}

export interface AuthClientStub {
	url: string;
	ready: boolean;
	signInWithOtp: (email: string) => Promise<{ ok: boolean; message: string }>;
	signInWithOAuth: (provider: 'google') => Promise<{ ok: boolean; url?: string; message: string }>;
	signUp: (email: string, name: string) => Promise<{ ok: boolean; message: string }>;
	signOut: () => Promise<void>;
	getSession: () => Promise<SessionUser | null>;
}

function stubMessage(action: string): string {
	return `Supabase not configured — ${action} uses mock session. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.`;
}

export function createBrowserClient(): AuthClientStub | null {
	const cfg = getSupabaseConfig();
	if (!cfg) return null;

	return {
		url: cfg.url,
		ready: false,
		signInWithOtp: async (email: string) => ({
			ok: true,
			message: stubMessage(`magic link for ${email}`)
		}),
		signInWithOAuth: async () => ({
			ok: true,
			url: '/auth/callback?provider=google&mock=1',
			message: stubMessage('Google OAuth')
		}),
		signUp: async (email: string) => ({
			ok: true,
			message: stubMessage(`registration for ${email}`)
		}),
		signOut: async () => {},
		getSession: async () => null
	};
}

export function createServerClient(_cookies: Cookies): AuthClientStub | null {
	const cfg = getSupabaseConfig();
	if (!cfg) return null;

	return {
		url: cfg.url,
		ready: false,
		signInWithOtp: async (email: string) => ({
			ok: true,
			message: stubMessage(`magic link for ${email}`)
		}),
		signInWithOAuth: async () => ({
			ok: true,
			url: '/auth/callback?provider=google&mock=1',
			message: stubMessage('Google OAuth')
		}),
		signUp: async (email: string) => ({
			ok: true,
			message: stubMessage(`registration for ${email}`)
		}),
		signOut: async () => {},
		getSession: async () => null
	};
}

export function parseSessionCookie(raw: string | undefined): SessionUser | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as SessionUser;
		if (!parsed.email || !parsed.role) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function setSessionCookie(cookies: Cookies, user: SessionUser): void {
	cookies.set(SESSION_COOKIE, JSON.stringify(user), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function createMockUser(email: string, name: string, role: SessionUser['role'] = 'customer'): SessionUser {
	return {
		id: `mock-${Date.now()}`,
		email,
		name: name || email.split('@')[0],
		role
	};
}
