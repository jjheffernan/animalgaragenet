import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { isOAuthProvider, mockCallbackUrl, type OAuthProvider } from '$lib/auth/oauth';
import { isProductionHostname } from '$lib/server/auth/local-dev';
import { signInWithOAuth } from '$lib/server/supabase/auth';
import { createServerClient } from '$lib/server/supabase/client';

/** Shared form action for OAuth sign-in / sign-up pages (SSR PKCE — no browser anon key). */
export async function handleOAuthAction(event: RequestEvent) {
	const form = await event.request.formData();
	const providerRaw = String(form.get('provider') ?? '');
	const redirectTo = String(form.get('redirect') ?? '/account');

	if (!isOAuthProvider(providerRaw)) {
		return fail(400, { error: 'Invalid OAuth provider.' });
	}

	const provider = providerRaw as OAuthProvider;
	const supabase = createServerClient(event);

	if (supabase) {
		const result = await signInWithOAuth(supabase, provider, {
			origin: event.url.origin,
			redirectTo
		});

		if (!result.ok || !result.url) {
			return fail(400, { error: result.message });
		}

		throw redirect(303, result.url);
	}

	if (isProductionHostname(event.url.hostname)) {
		return fail(503, {
			error:
				'Sign-in is not configured for this site. Set Supabase environment variables on the host.'
		});
	}

	throw redirect(303, mockCallbackUrl(provider, redirectTo));
}
