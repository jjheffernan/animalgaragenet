import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Legacy payment entry — use dedicated proxy routes instead:
 * POST /checkout/payment/initialize · /process · /complete
 *
 * @see docs/commerce/saleor-payments.md
 */
export const POST: RequestHandler = async () => {
	return json(
		{
			error: 'Use /checkout/payment/initialize, /process, or /complete',
			code: 'DEPRECATED_ENDPOINT'
		},
		{ status: 400 }
	);
};
