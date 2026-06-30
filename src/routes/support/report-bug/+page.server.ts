import { BUG_REPORT_CATEGORIES } from '$lib/types/bug-report';
import { LIMITS } from '$lib/server/validation/limits';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const prefillUrl = (url.searchParams.get('url') ?? '').slice(0, LIMITS.bugReport.pageUrl);

	return {
		sessionEmail: locals.session?.email ?? null,
		prefillUrl,
		categories: BUG_REPORT_CATEGORIES
	};
};
