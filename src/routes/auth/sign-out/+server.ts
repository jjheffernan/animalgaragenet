import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { signOut } from '$lib/server/supabase/auth';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	await signOut(locals.supabase, cookies);
	throw redirect(303, '/');
};
