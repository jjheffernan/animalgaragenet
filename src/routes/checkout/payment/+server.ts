import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Checkout payment proxy — Transaction API (Payment Apps).
 *
 * @saleor-migration: intentional — wire when Saleor payment app is on channel;
 * see docs/commerce/saleor-payments.md and docs/plans/active/inspiration-polish-coordination.md#IP-003
 */

// @migration: intentional — POST /checkout/payment?action=initialize
// import { initializePaymentGateway, initializeTransaction } from '$lib/server/saleor/checkout';
// import { getCheckoutId } from '$lib/server/saleor/checkout-cookies';

export const POST: RequestHandler = async ({ request }) => {
	const action = new URL(request.url).searchParams.get('action');

	if (action === 'initialize' || action === 'process') {
		return json(
			{
				error: 'Checkout payment not configured',
				hint: 'Uncomment handlers in checkout.ts and checkout-queries.ts when Saleor Payment App is live'
			},
			{ status: 501 }
		);
	}

	return json({ error: 'Unknown payment action' }, { status: 400 });
};
