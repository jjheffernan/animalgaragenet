import { env } from '$env/dynamic/private';
import { error, isHttpError, isRedirect, redirect, type Handle } from '@sveltejs/kit';
import { resolveAdminGate } from '$lib/server/auth/admin-gate';
import { isDevAdminEnabled, isProductionHostname } from '$lib/server/auth/local-dev';
import { canAccessAdmin } from '$lib/server/auth/roles';
import { logHttpRequest } from '$lib/server/observability/request-log';
import { recordHttpRequest } from '$lib/server/observability/metrics';
import { REQUEST_ID_HEADER, resolveRequestId } from '$lib/server/observability/request-id';
import { passthroughTraceHeaders, resolveTraceparent, TRACEPARENT_HEADER } from '$lib/server/observability/trace';
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

function observeRequest(
	method: string,
	path: string,
	route: string,
	status: number,
	durationMs: number,
	requestId: string,
	traceId?: string
): void {
	recordHttpRequest(method, route, status, durationMs);
	logHttpRequest({
		method,
		path,
		status,
		duration_ms: durationMs,
		request_id: requestId,
		...(traceId ? { trace_id: traceId } : {})
	});
}

function decorateResponse(
	response: Response,
	requestId: string,
	traceHeaders: Record<string, string>
): Response {
	response.headers.set(REQUEST_ID_HEADER, requestId);
	for (const [name, value] of Object.entries(traceHeaders)) {
		response.headers.set(name, value);
	}
	return response;
}

export const handle: Handle = async ({ event, resolve }) => {
	const requestId = resolveRequestId(event.request.headers.get(REQUEST_ID_HEADER));
	const traceHeaders = passthroughTraceHeaders(event.request);
	event.locals.requestId = requestId;
	event.locals.traceParent = resolveTraceparent(event.request.headers.get('traceparent'));

	const method = event.request.method;
	const path = event.url.pathname;
	const started = performance.now();

	const logOutcome = (status: number) => {
		const route = event.route?.id ?? path;
		const traceId = event.locals.traceParent?.split('-')[1];
		observeRequest(method, path, route, status, Math.round(performance.now() - started), requestId, traceId);
	};

	try {
		event.locals.devAdmin = isDevAdminEnabled(event);

		const supabase = isSupabaseConfigured() ? createServerClient(event) : null;
		if (supabase) {
			event.locals.supabase = supabase;
			await supabase.auth.getSession();
			event.locals.session = await getSession(supabase);
		} else {
			event.locals.supabase = null;
			event.locals.session = isProductionHostname(event.url.hostname)
				? null
				: parseSessionCookie(event.cookies.get(SESSION_COOKIE));
		}

		if (env.SITE_LOCKED === 'true' && !isLockdownExemptPath(event.url.pathname)) {
			const isAdmin = event.locals.devAdmin || canAccessAdmin(event.locals.session?.role ?? null);
			if (!isAdmin) {
				throw redirect(303, '/locked');
			}
		}

		if (event.url.pathname.startsWith('/admin')) {
			const gate = resolveAdminGate({
				hasSession: Boolean(event.locals.session),
				role: event.locals.session?.role,
				devAdmin: event.locals.devAdmin
			});

			if (gate === 'sign-in') {
				const redirectTo = encodeURIComponent(event.url.pathname);
				throw redirect(303, `/auth/sign-in?redirect=${redirectTo}`);
			}

			if (gate === 'forbidden') {
				throw error(403, 'Admin access requires an editor or admin role.');
			}
		}

		const response = await resolve(event, {
			filterSerializedResponseHeaders(name) {
				return (
					name === 'content-range' ||
					name === 'x-supabase-api-version' ||
					name === REQUEST_ID_HEADER ||
					name === TRACEPARENT_HEADER ||
					name === 'tracestate'
				);
			}
		});

		logOutcome(response.status);
		return decorateResponse(response, requestId, traceHeaders);
	} catch (err) {
		const status = isHttpError(err) ? err.status : isRedirect(err) ? err.status : 500;
		logOutcome(status);
		throw err;
	}
};
