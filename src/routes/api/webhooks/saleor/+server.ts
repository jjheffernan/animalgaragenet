import { json } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import {
	isOrderMirrorEvent,
	mirrorSaleorOrderPayload
} from '$lib/server/saleor/order-webhook';
import { verifySaleorWebhookSignature } from '$lib/server/saleor/webhook-signature';
import type { RequestHandler } from './$types';

function readSaleorEvent(request: Request): string {
	return (
		request.headers.get('saleor-event') ??
		request.headers.get('Saleor-Event') ??
		request.headers.get('x-saleor-event') ??
		''
	).trim();
}

function readSaleorSignature(request: Request): string | null {
	return (
		request.headers.get('saleor-signature') ?? request.headers.get('Saleor-Signature')
	)?.trim() ?? null;
}

/**
 * Saleor → storefront webhooks (ORDER_CREATED, fulfillment, etc.).
 * PSP webhooks (Stripe → Saleor Payment App) do NOT hit this route.
 *
 * @saleor-migration: intentional — see docs/commerce/saleor-payments.md
 */
export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const secret = privateEnv.SALEOR_WEBHOOK_SECRET?.trim();

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
