import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearSessionCookie } from '$lib/server/supabase/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	clearSessionCookie(cookies);
	throw redirect(303, '/');
};
