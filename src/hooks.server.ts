import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { canAccessAdmin } from '$lib/server/auth/roles';
import { parseSessionCookie, SESSION_COOKIE } from '$lib/server/supabase/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const raw = event.cookies.get(SESSION_COOKIE);
	event.locals.session = parseSessionCookie(raw);
	event.locals.devAdmin = env.DEV_ADMIN === 'true';

	if (event.url.pathname.startsWith('/admin')) {
		const hasAccess =
			event.locals.devAdmin || canAccessAdmin(event.locals.session?.role ?? null);

		if (!hasAccess) {
			const redirectTo = encodeURIComponent(event.url.pathname);
			throw redirect(303, `/auth/sign-in?redirect=${redirectTo}`);
		}
	}

	return resolve(event);
};
