import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifySaleorWebhookSignature } from './webhook-signature';

function sign(body: string, secret: string): string {
	return createHmac('sha256', secret).update(body, 'utf8').digest('hex');
}

describe('verifySaleorWebhookSignature', () => {
	it('accepts a valid HMAC SHA-256 signature', () => {
		const body = '{"order":{"id":"ord-1"}}';
		const secret = 'test-webhook-secret';
		expect(verifySaleorWebhookSignature(body, sign(body, secret), secret)).toBe(true);
	});

	it('rejects tampered payload', () => {
		const body = '{"order":{"id":"ord-1"}}';
		const secret = 'test-webhook-secret';
		expect(verifySaleorWebhookSignature('{"order":{"id":"ord-2"}}', sign(body, secret), secret)).toBe(
			false
		);
	});

	it('rejects wrong secret', () => {
		const body = '{"order":{"id":"ord-1"}}';
		expect(verifySaleorWebhookSignature(body, sign(body, 'secret-a'), 'secret-b')).toBe(false);
	});
});
