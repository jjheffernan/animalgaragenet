import { config } from '$lib/config/env';
import type { PageServerLoad } from './$types';
import { getMockPromo } from '$lib/server/checkout/promo';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { getCheckoutId, getCheckoutLines } from '$lib/server/saleor/checkout';
import { getFreeShippingProgress } from '$lib/server/saleor/shipping-promo';

// @saleor-migration: intentional — checkout scaffold load; see docs/commerce/saleor.md#quick-migration
export const load: PageServerLoad = async ({ cookies, url }) => {
	const saleorEnabled = isSaleorEnabled();
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;

	if (!saleorEnabled) {
		return {
			saleorEnabled,
			checkout: null,
			mockPromo: getMockPromo(cookies),
			freeShipping: getFreeShippingProgress(0, locale)
		};
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return {
			saleorEnabled,
			checkout: null,
			mockPromo: null,
			freeShipping: getFreeShippingProgress(0, locale)
		};
	}

	const checkout = await getCheckoutLines(checkoutId);
	return {
		saleorEnabled,
		checkout,
		mockPromo: null,
		freeShipping: getFreeShippingProgress(checkout?.subtotal.amount ?? 0, locale)
	};
};
