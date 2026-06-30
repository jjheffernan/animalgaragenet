import { getCollections } from '$lib/server/catalog/collections';
import { getPartsNavData } from '$lib/server/catalog/parts-nav';
import { hasCookieConsentAnswer } from '$lib/server/cookies';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	const shopCollections = (await getCollections())
		.filter((c) => c.slug !== 'clearance')
		.slice(0, 4);

	return {
		session: locals.session,
		notificationCount: 0,
		shopCollections,
		partsNav: await getPartsNavData(),
		showCookieConsent: !hasCookieConsentAnswer(cookies)
	};
};
