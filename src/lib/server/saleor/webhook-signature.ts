import { verifyHmacSha256Hex } from '$lib/server/webhook-signature';

export function readSaleorEvent(request: Request): string {
	return (
		request.headers.get('saleor-event') ??
		request.headers.get('Saleor-Event') ??
		request.headers.get('x-saleor-event') ??
		''
	).trim();
}

export function readSaleorSignature(request: Request): string | null {
	return (
		request.headers.get('saleor-signature') ?? request.headers.get('Saleor-Signature')
	)?.trim() ?? null;
}

/** Verify Saleor-Signature HMAC SHA-256 (secretKey webhooks). */
export const verifySaleorWebhookSignature = verifyHmacSha256Hex;
