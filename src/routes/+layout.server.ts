import { resolveAdminGate } from '#lib/server/auth/admin-gate.ts';
import { getCollections } from '#lib/server/catalog/collections.ts';
import { getPartsNavData } from '#lib/server/catalog/parts-nav.ts';
import { hasAnalyticsConsent, hasCookieConsentAnswer } from '#lib/server/cookies.ts';
import { countActiveDeals } from '#lib/server/deals/repository.ts';
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
		showCookieConsent: !hasCookieConsentAnswer(cookies),
		analyticsConsent: hasAnalyticsConsent(cookies)
	};
};
