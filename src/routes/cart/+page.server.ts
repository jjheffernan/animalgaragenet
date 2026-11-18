import { config } from '#lib/config/env.ts';
import type { PageServerLoad } from './$types';
import { getMockPromo } from '#lib/server/checkout/promo.ts';
import { isSaleorEnabled } from '#lib/server/saleor/client.ts';
import { getCheckoutId, getCheckoutLines } from '#lib/server/saleor/checkout.ts';
import { getFreeShippingThresholdForLocale } from '#lib/server/saleor/shipping-promo.ts';

// @saleor-migration: intentional — checkout scaffold load; see docs/commerce/saleor.md#quick-migration
export const load: PageServerLoad = async ({ cookies, url }) => {
	const saleorEnabled = isSaleorEnabled();
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;

	if (!saleorEnabled) {
		return {
			saleorEnabled,
			checkout: null,
			mockPromo: getMockPromo(cookies),
			freeShippingThreshold: getFreeShippingThresholdForLocale(locale)
		};
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return {
			saleorEnabled,
			checkout: null,
			mockPromo: null,
			freeShippingThreshold: getFreeShippingThresholdForLocale(locale)
		};
	}

	const checkout = await getCheckoutLines(checkoutId);
	return {
		saleorEnabled,
		checkout,
		mockPromo: null,
		freeShippingThreshold: getFreeShippingThresholdForLocale(locale)
	};
};
