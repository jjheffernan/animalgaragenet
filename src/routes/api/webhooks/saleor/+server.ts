import { json } from '@sveltejs/kit';
import { SALEOR_WEBHOOK_SECRET } from '$app/env/private';
import { isOrderMirrorEvent, mirrorSaleorOrderPayload } from '#lib/server/saleor/order-webhook.ts';
import {
	isStockRestockEvent,
	processStockRestockPayload
} from '#lib/server/saleor/stock-webhook.ts';
import {
	readSaleorEvent,
	readSaleorSignature,
	verifySaleorWebhookSignature
} from '#lib/server/saleor/webhook-signature.ts';
import type { RequestHandler } from './$types';

/**
 * Saleor → storefront webhooks (ORDER_CREATED, fulfillment, etc.).
 * PSP webhooks (Stripe → Saleor Payment App) do NOT hit this route.
 *
 * @saleor-migration: intentional — see docs/commerce/saleor-payments.md
 */
export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const secret = SALEOR_WEBHOOK_SECRET?.trim();

	if (secret) {
		const signature = readSaleorSignature(request);
		if (!signature) {
			return json({ error: 'Missing Saleor-Signature' }, { status: 401 });
		}
		if (!verifySaleorWebhookSignature(rawBody, signature, secret)) {
			return json({ error: 'Invalid Saleor-Signature' }, { status: 401 });
		}
	}

	let payload: unknown;
	try {
		payload = rawBody ? JSON.parse(rawBody) : {};
	} catch {
		return json({ error: 'Invalid JSON payload' }, { status: 400 });
	}

	const event = readSaleorEvent(request);
	if (!event) {
		return json({ error: 'Missing Saleor-Event' }, { status: 400 });
	}

	if (isStockRestockEvent(event)) {
		const result = await processStockRestockPayload(payload);
		if (!result.ok) {
			return json({ error: result.reason }, { status: 422 });
		}
		if ('skipped' in result) {
			return json({ ok: true, skipped: result.reason });
		}
		return json({ ok: true, notified: result.notified, productId: result.productId });
	}

	if (!isOrderMirrorEvent(event)) {
		return json({ ok: true, ignored: event });
	}

	const result = await mirrorSaleorOrderPayload(payload);
	if (!result.ok) {
		return json({ error: result.reason }, { status: 422 });
	}

	if ('skipped' in result && result.skipped) {
		return json({ ok: true, skipped: result.reason });
	}

	return json({ ok: true, orderNumber: result.orderNumber });
};
