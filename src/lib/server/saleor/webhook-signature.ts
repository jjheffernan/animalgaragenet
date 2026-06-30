import { createHmac, timingSafeEqual } from 'node:crypto';

/** Verify Saleor-Signature HMAC SHA-256 (secretKey webhooks). */
export function verifySaleorWebhookSignature(
	rawBody: string,
	signatureHeader: string,
	secret: string
): boolean {
	const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
	const provided = signatureHeader.trim();

	if (expected.length !== provided.length) return false;

	try {
		return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(provided, 'utf8'));
	} catch {
		return false;
	}
}
