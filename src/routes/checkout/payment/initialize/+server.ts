import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	DEFAULT_PAYMENT_GATEWAY_ID,
	getCheckoutId,
	initializePaymentGateway,
	initializeTransaction,
	paymentGatewayUnavailablePayload,
	setTransactionId
} from '$lib/server/saleor/checkout';
import { requireSaleorPaymentEnabled } from '$lib/server/saleor/checkout-route-helpers';

interface InitializeBody {
	gatewayId?: string;
	amount?: number;
	gatewayData?: Record<string, unknown>;
	startTransaction?: boolean;
}

/** Initialize payment gateway config and optionally start a transaction. */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const disabled = requireSaleorPaymentEnabled();
	if (disabled) return disabled;

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return json({ error: 'No active checkout', code: 'NO_CHECKOUT' }, { status: 400 });
	}

	const body = (await request.json()) as InitializeBody;
	const gatewayId = body.gatewayId?.trim() || DEFAULT_PAYMENT_GATEWAY_ID;

	const gatewayResult = await initializePaymentGateway(checkoutId, gatewayId, body.amount);
	if (!gatewayResult.ok) {
		return json(paymentGatewayUnavailablePayload(gatewayResult.error), { status: 502 });
	}

	if (!body.startTransaction) {
		return json({ gateway: gatewayResult.data, gatewayId });
	}

	if (typeof body.amount !== 'number' || body.amount <= 0) {
		return json(
			{ error: 'amount is required to start a transaction', code: 'INVALID_AMOUNT' },
			{ status: 400 }
		);
	}

	const idempotencyKey = crypto.randomUUID();
	const txResult = await initializeTransaction(
		checkoutId,
		gatewayId,
		body.amount,
		body.gatewayData,
		idempotencyKey
	);

	if (!txResult.ok) {
		return json({ error: txResult.error, code: 'TRANSACTION_INIT_FAILED' }, { status: 502 });
	}

	setTransactionId(cookies, txResult.data.transactionId);

	return json({
		gateway: gatewayResult.data,
		gatewayId,
		transactionId: txResult.data.transactionId,
		data: txResult.data.data,
		eventType: txResult.data.eventType
	});
};
