import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	adminGateJsonResponse,
	resolveAdminGateFromLocals
} from '$lib/server/auth/admin-gate';
import { deleteMediaAssetAsAdmin } from '$lib/server/media/repository';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const denied = adminGateJsonResponse(resolveAdminGateFromLocals(locals));
	if (denied) return denied;

	const assetId = params.id?.trim();
	if (!assetId) {
		return json({ error: 'Asset id is required.' }, { status: 400 });
	}

	const result = await deleteMediaAssetAsAdmin(assetId);
	if ('error' in result) {
		return json({ error: result.error }, { status: 404 });
	}

	return json({ ok: true });
};
