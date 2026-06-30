import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { buildAuthCallbackUrl } from '$lib/server/auth/callback-url';
import { LOCAL_DEV_ACCOUNTS } from '$lib/server/auth/local-dev-accounts';
import {
	devSignInAccount,
	isLocalDevAuthEnabled,
	isProductionHostname
} from '$lib/server/auth/local-dev';
import { createMockUser, setSessionCookie, signInWithOtp } from '$lib/server/supabase/auth';
import { createServerClient, isSupabaseConfigured } from '$lib/server/supabase/client';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session) {
		const redirectTo = url.searchParams.get('redirect') ?? '/account';
		throw redirect(303, redirectTo);
	}

	const supabaseReady = isSupabaseConfigured();

	return {
		supabaseReady,
		productionAuthMisconfigured: isProductionHostname(url.hostname) && !supabaseReady,
		localDevAuthEnabled: isLocalDevAuthEnabled({ url }),
		devAccounts: LOCAL_DEV_ACCOUNTS,
		redirectTo: url.searchParams.get('redirect') ?? '/account'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const redirectTo = String(
			form.get('redirect') ?? url.searchParams.get('redirect') ?? '/account'
		);

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Enter a valid email address.', email, name });
		}

		const supabase = createServerClient({ cookies });
		if (supabase) {
			const result = await signInWithOtp(supabase, email, {
				emailRedirectTo: buildAuthCallbackUrl(url.origin, redirectTo),
				name: name || undefined
			});

			if (!result.ok) {
				return fail(400, { error: result.message, email, name });
			}

			return { success: true, message: result.message, email, name };
		}

		if (isProductionHostname(url.hostname)) {
			return fail(503, {
				error:
					'Sign-in is not configured for this site. Set Supabase environment variables on the host.',
				email,
				name
			});
		}

		const user = createMockUser(email, name);
		setSessionCookie(cookies, user);
		throw redirect(303, redirectTo);
	},

	devSignIn: async (event) => {
		if (!isLocalDevAuthEnabled(event)) {
			return fail(403, { error: 'Dev sign-in is not available.' });
		}

		const form = await event.request.formData();
		const email = String(form.get('email') ?? '').trim();
		const redirectTo = String(
			form.get('redirect') ?? event.url.searchParams.get('redirect') ?? '/account'
		);

		const account = LOCAL_DEV_ACCOUNTS.find((a) => a.email === email);
		if (!account) {
			return fail(400, { error: 'Unknown dev account.' });
		}

		const result = await devSignInAccount(event, event.locals.supabase, account);
		if (!result.ok) {
			return fail(400, { error: result.message });
		}

		throw redirect(303, redirectTo);
	}
};
