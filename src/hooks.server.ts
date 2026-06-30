import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { isDevAdminEnabled } from '$lib/server/auth/local-dev';
import { canAccessAdmin } from '$lib/server/auth/roles';
import { getSession, parseSessionCookie, SESSION_COOKIE } from '$lib/server/supabase/auth';
import { createServerClient, isSupabaseConfigured } from '$lib/server/supabase/client';

function isLockdownExemptPath(pathname: string): boolean {
	if (pathname === '/locked') return true;
	if (pathname.startsWith('/auth')) return true;
	if (pathname.startsWith('/admin')) return true;
	if (pathname.startsWith('/_app')) return true;
	if (pathname.startsWith('/favicon')) return true;
	return /\.(ico|png|jpe?g|gif|webp|svg|woff2?|css|js|map|txt|xml)$/i.test(pathname);
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.devAdmin = isDevAdminEnabled(event);

	const supabase = isSupabaseConfigured() ? createServerClient(event) : null;
	if (supabase) {
		event.locals.supabase = supabase;
		await supabase.auth.getSession();
		event.locals.session = await getSession(supabase);
	} else {
		event.locals.supabase = null;
		event.locals.session = parseSessionCookie(event.cookies.get(SESSION_COOKIE));
	}

	if (env.SITE_LOCKED === 'true' && !isLockdownExemptPath(event.url.pathname)) {
		const isAdmin =
			event.locals.devAdmin || canAccessAdmin(event.locals.session?.role ?? null);
		if (!isAdmin) {
			throw redirect(303, '/locked');
		}
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
