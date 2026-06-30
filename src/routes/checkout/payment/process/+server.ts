import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTransactionId, processTransaction } from '$lib/server/saleor/checkout';
import { requireSaleorPaymentEnabled } from '$lib/server/saleor/checkout-route-helpers';

interface ProcessBody {
	transactionId?: string;
	data?: Record<string, unknown>;
}

/** Sync transaction status after 3DS or redirect (server-side proxy). */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const disabled = requireSaleorPaymentEnabled();
	if (disabled) return disabled;

	const body = (await request.json()) as ProcessBody;
	const transactionId = body.transactionId?.trim() || getTransactionId(cookies);

	if (!transactionId) {
		return json({ error: 'No active transaction', code: 'NO_TRANSACTION' }, { status: 400 });
	}

	const result = await processTransaction(transactionId, body.data);
	if (!result.ok) {
		return json({ error: result.error, code: 'TRANSACTION_PROCESS_FAILED' }, { status: 502 });
	}

	return json({
		eventType: result.data.eventType,
		data: result.data.data
	});
};
