import type { PageServerLoad } from './$types';
import { getMockPromo } from '$lib/server/checkout/promo';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { getCheckoutId, getCheckoutLines } from '$lib/server/saleor/checkout';

export const load: PageServerLoad = async ({ cookies }) => {
	const saleorEnabled = isSaleorEnabled();

	if (!saleorEnabled) {
		return { saleorEnabled, checkout: null, mockPromo: getMockPromo(cookies) };
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return { saleorEnabled, checkout: null, mockPromo: null };
	}

	const checkout = await getCheckoutLines(checkoutId);
	return { saleorEnabled, checkout, mockPromo: null };
};
