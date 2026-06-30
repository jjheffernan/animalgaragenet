import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	clearCheckoutId,
	clearTransactionId,
	completeCheckout,
	getCheckoutId
} from '$lib/server/saleor/checkout';
import { requireSaleorPaymentEnabled } from '$lib/server/saleor/checkout-route-helpers';

/** Complete checkout and create order when payment covers total. */
export const POST: RequestHandler = async ({ cookies }) => {
	const disabled = requireSaleorPaymentEnabled();
	if (disabled) return disabled;

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return json({ error: 'No active checkout', code: 'NO_CHECKOUT' }, { status: 400 });
	}

	const result = await completeCheckout(checkoutId);
	if (!result.ok) {
		return json({ error: result.error, code: 'CHECKOUT_COMPLETE_FAILED' }, { status: 502 });
	}

	clearCheckoutId(cookies);
	clearTransactionId(cookies);

	return json({ orderId: result.data.orderId });
};
