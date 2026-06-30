import type { Cookies } from '@sveltejs/kit';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { oauthDisplayName, type OAuthProvider } from '$lib/auth/oauth';
import { isValidRole, type Role } from '$lib/auth/roles';

/** Legacy mock session cookie — used when Supabase env vars are unset. */
export const SESSION_COOKIE = 'ag-session';

export interface SessionUser {
	id: string;
	email: string;
	name: string;
	role: Role;
}

export function mapSupabaseUser(user: User): SessionUser {
	const rawRole = user.app_metadata?.role;
	const name =
		oauthDisplayName(user.user_metadata) ||
		(typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
		(typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
		user.email?.split('@')[0] ||
		'User';

	return {
		id: user.id,
		email: user.email ?? '',
		name,
		role: typeof rawRole === 'string' && isValidRole(rawRole) ? rawRole : 'customer'
	};
}

/** Validates JWT via Auth server and maps to app session shape. */
export async function getSession(supabase: SupabaseClient): Promise<SessionUser | null> {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error || !user) return null;
	return mapSupabaseUser(user);
}

export async function signInWithOtp(
	supabase: SupabaseClient,
	email: string,
	options?: { emailRedirectTo?: string; name?: string }
): Promise<{ ok: boolean; message: string }> {
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: options?.emailRedirectTo,
			data: options?.name ? { name: options.name } : undefined
		}
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	return { ok: true, message: 'Check your email for the magic link.' };
}

export async function signUpWithOtp(
	supabase: SupabaseClient,
	email: string,
	name: string,
	options?: { emailRedirectTo?: string }
): Promise<{ ok: boolean; message: string }> {
	return signInWithOtp(supabase, email, { ...options, name });
}

/** Starts Supabase OAuth for google, discord, or azure (PKCE via @supabase/ssr). */
export async function signInWithOAuth(
	supabase: SupabaseClient,
	provider: OAuthProvider,
	options: { redirectTo: string; origin: string }
): Promise<{ ok: boolean; url?: string; message: string }> {
	const callbackUrl = new URL('/auth/callback', options.origin);
	callbackUrl.searchParams.set('redirect', options.redirectTo);

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: callbackUrl.toString(),
			...(provider === 'azure' ? { queryParams: { prompt: 'select_account' } } : {})
		}
	});

	if (error) {
		return { ok: false, message: error.message };
	}

	return {
		ok: true,
		url: data.url,
		message: `Redirecting to ${provider} sign-in`
	};
}

/** Exchange OAuth authorization code for a Supabase session (callback route). */
export async function exchangeOAuthCode(
	supabase: SupabaseClient,
	code: string
): Promise<{ ok: boolean; message: string; user: SessionUser | null }> {
	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		return { ok: false, message: error.message, user: null };
	}

	const user = await getSession(supabase);
	return { ok: true, message: 'Signed in', user };
}

export async function signOut(supabase: SupabaseClient | null, cookies: Cookies): Promise<void> {
	if (supabase) {
		await supabase.auth.signOut();
	}
	clearSessionCookie(cookies);
}

// --- Mock session fallback (no Supabase env) ---

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

export function createMockUser(
	email: string,
	name: string,
	role: SessionUser['role'] = 'customer'
): SessionUser {
	return {
		id: `mock-${Date.now()}`,
		email,
		name: name || email.split('@')[0],
		role
	};
}
