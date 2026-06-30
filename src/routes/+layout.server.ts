import { resolveAdminGate } from '$lib/server/auth/admin-gate';
import { getCollections } from '$lib/server/catalog/collections';
import { getPartsNavData } from '$lib/server/catalog/parts-nav';
import { hasCookieConsentAnswer } from '$lib/server/cookies';
import { countActiveDeals } from '$lib/server/deals/repository';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	const shopCollections = (await getCollections())
		.filter((c) => c.slug !== 'clearance')
		.slice(0, 4);

	const staffPanel =
		resolveAdminGate({
			hasSession: Boolean(locals.session),
			role: locals.session?.role,
			devAdmin: locals.devAdmin
		}) === 'allow';

	return {
		session: locals.session,
		staffPanel,
		notificationCount: 0,
		dealCount: await countActiveDeals(),
		shopCollections,
		partsNav: await getPartsNavData(),
		showCookieConsent: !hasCookieConsentAnswer(cookies)
	};
};
