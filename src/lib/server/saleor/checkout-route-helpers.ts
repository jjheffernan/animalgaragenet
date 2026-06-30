import { json } from '@sveltejs/kit';
import { isSaleorEnabled } from '$lib/server/saleor/client';

/** Structured response when Saleor env is not configured. */
export function saleorDisabledResponse() {
	return json(
		{
			error: 'Saleor not configured',
			code: 'SALEOR_DISABLED',
			hint: 'Set PUBLIC_SALEOR_API_URL to enable live checkout.'
		},
		{ status: 503 }
	);
}

/** Guard for checkout API routes — returns a Response when Saleor is off. */
export function requireSaleorEnabled(): Response | null {
	if (!isSaleorEnabled()) return saleorDisabledResponse();
	return null;
}

/** Payment proxy routes use 501 when Saleor is not configured. */
export function requireSaleorPaymentEnabled(): Response | null {
	if (!isSaleorEnabled()) {
		return json(
			{
				error: 'Checkout payment not configured',
				code: 'SALEOR_DISABLED',
				hint: 'Set PUBLIC_SALEOR_API_URL and install a Payment App on the Saleor channel.'
			},
			{ status: 501 }
		);
	}
	return null;
}
