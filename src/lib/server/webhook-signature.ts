import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyHmacSha256Hex(
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

/** Timing-safe compare for cron / shared-secret headers. */
export function verifySharedSecret(
	provided: string | null | undefined,
	secret: string
): boolean {
	const a = (provided ?? '').trim();
	const b = secret.trim();
	if (!a || !b || a.length !== b.length) return false;

	try {
		return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
	} catch {
		return false;
	}
}

/** Saleor-Signature HMAC SHA-256 (secretKey webhooks). */
export const verifySaleorWebhookSignature = verifyHmacSha256Hex;
