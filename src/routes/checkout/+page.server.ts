import type { PageServerLoad } from './$types';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { getCheckoutId, getCheckoutShipping, PAYMENT_APP_OPS_HINT } from '$lib/server/saleor/checkout';

export const load: PageServerLoad = async ({ cookies }) => {
	const saleorEnabled = isSaleorEnabled();

	if (!saleorEnabled) {
		return {
			saleorEnabled,
			checkout: null,
			shipping: null,
			paymentConfigured: false,
			shippingComplete: false,
			paymentAppOpsHint: null
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
			paymentAppOpsHint: PAYMENT_APP_OPS_HINT
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
			paymentAppOpsHint: PAYMENT_APP_OPS_HINT
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
		paymentAppOpsHint: paymentConfigured ? null : PAYMENT_APP_OPS_HINT
	};
};
