import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	clearCheckoutId,
	clearTransactionId,
	completeCheckout,
	getCheckoutId,
	getTransactionId,
	processTransaction,
	stripeReturnDataFromUrl
} from '$lib/server/saleor/checkout';

export type PaymentCompleteStatus =
	| 'disabled'
	| 'no_transaction'
	| 'no_checkout'
	| 'process_failed'
	| 'complete_failed'
	| 'success';

/** Stripe 3DS / redirect return — server runs transactionProcess then checkoutComplete. */
export const load: PageServerLoad = async ({ cookies, url }) => {
	if (!isSaleorEnabled()) {
		return { status: 'disabled' as const };
	}

	const transactionId = getTransactionId(cookies);
	if (!transactionId) {
		return { status: 'no_transaction' as const };
	}

	const processResult = await processTransaction(
		transactionId,
		stripeReturnDataFromUrl(url.searchParams)
	);
	if (!processResult.ok) {
		return { status: 'process_failed' as const, error: processResult.error };
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return { status: 'no_checkout' as const };
	}

	const completeResult = await completeCheckout(checkoutId);
	if (!completeResult.ok) {
		return { status: 'complete_failed' as const, error: completeResult.error };
	}

	clearCheckoutId(cookies);
	clearTransactionId(cookies);

	throw redirect(303, `/account/orders?placed=${encodeURIComponent(completeResult.data.orderId)}`);
};
