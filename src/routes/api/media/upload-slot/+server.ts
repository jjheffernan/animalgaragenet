import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUploadSlot } from '$lib/server/media/repository';
import { validateUploadRequest } from '$lib/server/media/validation';
import { isSupabaseConfigured } from '$lib/server/supabase/client';

interface UploadSlotBody {
	mimeType?: string;
	byteSize?: number;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Sign in required.' }, { status: 401 });
	}
	if (!isSupabaseConfigured() || !locals.supabase) {
		return json({ error: 'Media uploads are not configured.' }, { status: 503 });
	}

	const body = (await request.json()) as UploadSlotBody;
	const mimeType = String(body.mimeType ?? '').trim();
	const byteSize = Number(body.byteSize);
	const validationError = validateUploadRequest(mimeType, byteSize);
	if (validationError) {
		return json({ error: validationError }, { status: 400 });
	}

	const result = await createUploadSlot(locals.supabase, locals.session.id, mimeType, byteSize);
	if ('error' in result) {
		return json({ error: result.error }, { status: 502 });
	}

	return json({
		assetId: result.asset.id,
		signedUrl: result.signedUrl,
		token: result.token,
		storagePath: result.asset.storagePath
	});
};
