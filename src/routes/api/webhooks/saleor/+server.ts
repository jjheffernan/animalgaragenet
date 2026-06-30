import { json } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

/**
 * Saleor → storefront webhooks (ORDER_CREATED, fulfillment, etc.).
 * PSP webhooks (Stripe → Saleor Payment App) do NOT hit this route.
 *
 * @saleor-migration: intentional — wire handlers when SALEOR_WEBHOOK_SECRET is set;
 * see docs/commerce/saleor-payments.md
 */
export const POST: RequestHandler = async ({ request }) => {
	const secret = privateEnv.SALEOR_WEBHOOK_SECRET;
	if (secret) {
		const signature = request.headers.get('saleor-signature') ?? request.headers.get('Saleor-Signature');
		if (!signature) {
			return json({ error: 'Missing Saleor-Signature' }, { status: 401 });
		}
		// TODO: verify HMAC per Saleor async webhook docs when wiring ORDER_CREATED handlers
	}

	return json(
		{ error: 'Saleor webhook handler not configured' },
		{ status: 501 }
	);
};
