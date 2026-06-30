import { config } from '$lib/config/env';
import type { PageServerLoad } from './$types';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { getCheckoutId, getCheckoutShipping, PAYMENT_APP_OPS_HINT } from '$lib/server/saleor/checkout';
import { getFreeShippingProgress } from '$lib/server/saleor/shipping-promo';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const saleorEnabled = isSaleorEnabled();
	const locale = url.searchParams.get('locale') ?? config.defaultLocale;

	if (!saleorEnabled) {
		return {
			saleorEnabled,
			checkout: null,
			shipping: null,
			paymentConfigured: false,
			shippingComplete: false,
			paymentAppOpsHint: null,
			freeShipping: getFreeShippingProgress(0, locale)
		};
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return {
			saleorEnabled,
			checkout: null,
			shipping: null,
			paymentConfigured: false,
			shippingComplete: false,
			paymentAppOpsHint: PAYMENT_APP_OPS_HINT,
			freeShipping: getFreeShippingProgress(0, locale)
		};
	}

	const snapshot = await getCheckoutShipping(checkoutId);
	if (!snapshot) {
		return {
			saleorEnabled,
			checkout: null,
			shipping: null,
			paymentConfigured: false,
			shippingComplete: false,
			paymentAppOpsHint: PAYMENT_APP_OPS_HINT,
			freeShipping: getFreeShippingProgress(0, locale)
		};
	}

	const { checkout, shipping } = snapshot;
	const shippingComplete = Boolean(shipping.selectedShippingMethodId);
	const paymentConfigured = shipping.paymentGateways.length > 0;

	return {
		saleorEnabled,
		checkout,
		shipping,
		paymentConfigured,
		shippingComplete,
		paymentAppOpsHint: paymentConfigured ? null : PAYMENT_APP_OPS_HINT,
		freeShipping: getFreeShippingProgress(checkout.subtotal.amount, locale)
	};
};
