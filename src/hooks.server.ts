import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { canAccessAdmin } from '$lib/server/auth/roles';
import { getSession, parseSessionCookie, SESSION_COOKIE } from '$lib/server/supabase/auth';
import { createServerClient, isSupabaseConfigured } from '$lib/server/supabase/client';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.devAdmin = env.DEV_ADMIN === 'true';

	if (isSupabaseConfigured()) {
		event.locals.supabase = createServerClient(event);
		// Refresh session tokens on each request
		await event.locals.supabase.auth.getSession();
		event.locals.session = await getSession(event.locals.supabase);
	} else {
		event.locals.supabase = null;
		event.locals.session = parseSessionCookie(event.cookies.get(SESSION_COOKIE));
	}

	if (event.url.pathname.startsWith('/admin')) {
		const hasAccess =
			event.locals.devAdmin || canAccessAdmin(event.locals.session?.role ?? null);

		if (!hasAccess) {
			const redirectTo = encodeURIComponent(event.url.pathname);
			throw redirect(303, `/auth/sign-in?redirect=${redirectTo}`);
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
