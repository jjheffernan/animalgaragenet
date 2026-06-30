import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { confirmUpload } from '$lib/server/media/repository';
import { isSupabaseConfigured } from '$lib/server/supabase/client';

interface ConfirmBody {
	assetId?: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Sign in required.' }, { status: 401 });
	}
	if (!isSupabaseConfigured() || !locals.supabase) {
		return json({ error: 'Media uploads are not configured.' }, { status: 503 });
	}

	const body = (await request.json()) as ConfirmBody;
	const assetId = String(body.assetId ?? '').trim();
	if (!assetId) {
		return json({ error: 'assetId is required.' }, { status: 400 });
	}

	const result = await confirmUpload(locals.supabase, locals.session.id, assetId);
	if ('error' in result) {
		return json({ error: result.error }, { status: 400 });
	}

	return json({ asset: result.asset });
};
