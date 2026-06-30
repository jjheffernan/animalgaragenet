import type { PageServerLoad } from './$types';
import { isCdnUploadConfigured } from '$lib/server/media/cdn';

export const load: PageServerLoad = async () => {
	return {
		cdnUploadConfigured: isCdnUploadConfigured()
	};
};
