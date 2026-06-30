import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '$lib/config/env';
import { createAdminClient } from '$lib/server/supabase/admin';
import { findUserByEmail } from '$lib/server/supabase/admin-users';
import {
	createMockUser,
	mapSupabaseUser,
	setSessionCookie,
	type SessionUser
} from '$lib/server/supabase/auth';
import { isSupabaseConfigured } from '$lib/server/supabase/client';
import type { LocalDevAccount } from './local-dev-accounts';

const PRODUCTION_HOST = 'animalgarage.net';
const NETLIFY_PREVIEW_SUFFIX = '.netlify.app';

export function isProductionHostname(hostname: string): boolean {
	if (hostname === PRODUCTION_HOST || hostname.endsWith(`.${PRODUCTION_HOST}`)) {
		return true;
	}
	return hostname === 'netlify.app' || hostname.endsWith(NETLIFY_PREVIEW_SUFFIX);
}

export function isProductionSiteUrl(): boolean {
	try {
		return isProductionHostname(new URL(config.siteUrl).hostname);
	} catch {
		return false;
	}
}

function isLocalHostname(hostname: string): boolean {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

/** True only on localhost with dev mode or LOCAL_DEV_AUTH — never on production. */
export function isLocalDevAuthEnabled(event: Pick<RequestEvent, 'url'>): boolean {
	if (!isLocalHostname(event.url.hostname)) return false;
	if (isProductionSiteUrl()) return false;
	if (import.meta.env.DEV) return true;
	return env.LOCAL_DEV_AUTH === 'true';
}

/** DEV_ADMIN bypass is allowed only off production hostnames and site URL. */
export function isDevAdminEnabled(event: Pick<RequestEvent, 'url'>): boolean {
	if (env.DEV_ADMIN !== 'true') return false;
	if (isProductionHostname(event.url.hostname)) return false;
	if (isProductionSiteUrl()) return false;
	return true;
}

async function ensureSupabaseDevUser(
	admin: NonNullable<ReturnType<typeof createAdminClient>>,
	account: LocalDevAccount
): Promise<string> {
	const { user: existingUser, error: lookupError } = await findUserByEmail(admin, account.email);
	if (lookupError) throw lookupError;

	if (existingUser) {
		const { error } = await admin.auth.admin.updateUserById(existingUser.id, {
			app_metadata: { role: account.role },
			user_metadata: { name: account.label }
		});
		if (error) throw new Error(error.message);
		return existingUser.id;
	}

	const { data, error } = await admin.auth.admin.createUser({
		email: account.email,
		email_confirm: true,
		app_metadata: { role: account.role },
		user_metadata: { name: account.label }
	});
	if (error || !data.user) throw new Error(error?.message ?? 'Failed to create dev user');
	return data.user.id;
}

/** Sign in a predefined local dev account (mock cookie or Supabase session). */
export async function devSignInAccount(
	event: Pick<RequestEvent, 'cookies'>,
	supabase: SupabaseClient | null,
	account: LocalDevAccount
): Promise<{ ok: true; user: SessionUser } | { ok: false; message: string }> {
	if (!supabase || !isSupabaseConfigured()) {
		const user = createMockUser(account.email, account.label, account.role);
		setSessionCookie(event.cookies, user);
		return { ok: true, user };
	}

	const admin = createAdminClient();
	if (!admin) {
		return {
			ok: false,
			message: 'SUPABASE_SERVICE_ROLE_KEY required for dev sign-in with Supabase.'
		};
	}

	try {
		await ensureSupabaseDevUser(admin, account);

		const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
			type: 'magiclink',
			email: account.email
		});
		if (linkError || !linkData.properties?.hashed_token) {
			return { ok: false, message: linkError?.message ?? 'Failed to generate dev sign-in link.' };
		}

		const { error: verifyError } = await supabase.auth.verifyOtp({
			token_hash: linkData.properties.hashed_token,
			type: 'email'
		});
		if (verifyError) return { ok: false, message: verifyError.message };

		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();
		if (userError || !user)
			return { ok: false, message: userError?.message ?? 'Dev sign-in failed.' };

		return { ok: true, user: mapSupabaseUser(user) };
	} catch (err) {
		return { ok: false, message: err instanceof Error ? err.message : 'Dev sign-in failed.' };
	}
}
