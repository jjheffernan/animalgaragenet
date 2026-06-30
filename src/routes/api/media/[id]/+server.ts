import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteMediaAsset } from '$lib/server/media/repository';
import { isSupabaseConfigured } from '$lib/server/supabase/client';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session) {
		return json({ error: 'Sign in required.' }, { status: 401 });
	}
	if (!isSupabaseConfigured() || !locals.supabase) {
		return json({ error: 'Media uploads are not configured.' }, { status: 503 });
	}

	const assetId = params.id?.trim();
	if (!assetId) {
		return json({ error: 'Asset id is required.' }, { status: 400 });
	}

	const result = await deleteMediaAsset(locals.supabase, locals.session.id, assetId);
	if ('error' in result) {
		return json({ error: result.error }, { status: 404 });
	}

	return json({ ok: true });
};
