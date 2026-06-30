import { fail } from '@sveltejs/kit';
import {
	cleanupStalePendingAssets,
	deleteMediaAssetAsAdmin,
	listStaffMediaAssets
} from '$lib/server/media/repository';
import { isCdnInvalidationConfigured, isCdnUploadConfigured } from '$lib/server/media/cdn';
import { createAdminClient } from '$lib/server/supabase/admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ugcConfigured = createAdminClient() !== null;
	const ugcAssets = ugcConfigured ? await listStaffMediaAssets(100) : [];

	return {
		cdnUploadConfigured: isCdnUploadConfigured(),
		cdnInvalidationConfigured: isCdnInvalidationConfigured(),
		ugcConfigured,
		ugcAssets
	};
};

export const actions: Actions = {
	deleteAsset: async ({ request }) => {
		const id = String((await request.formData()).get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Missing asset id.' });

		const result = await deleteMediaAssetAsAdmin(id);
		if ('error' in result) return fail(500, { error: result.error });
		return { deleted: true };
	},
	cleanupOrphans: async () => {
		const result = await cleanupStalePendingAssets(24);
		return { cleanup: result };
	}
};
