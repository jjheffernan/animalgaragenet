import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
	readSaleorEvent,
	readSaleorSignature,
	verifySaleorWebhookSignature
} from './webhook-signature';

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
		expect(
			verifySaleorWebhookSignature('{"order":{"id":"ord-2"}}', sign(body, secret), secret)
		).toBe(false);
	});

	it('rejects wrong secret', () => {
		const body = '{"order":{"id":"ord-1"}}';
		expect(verifySaleorWebhookSignature(body, sign(body, 'secret-a'), 'secret-b')).toBe(false);
	});
});

describe('readSaleorEvent', () => {
	it('reads saleor-event header case-insensitively', () => {
		const request = new Request('http://localhost/webhook', {
			headers: { 'Saleor-Event': 'ORDER_CREATED' }
		});
		expect(readSaleorEvent(request)).toBe('ORDER_CREATED');
	});
});

describe('readSaleorSignature', () => {
	it('reads saleor-signature header', () => {
		const request = new Request('http://localhost/webhook', {
			headers: { 'Saleor-Signature': 'abc123' }
		});
		expect(readSaleorSignature(request)).toBe('abc123');
	});

	it('returns null when header missing', () => {
		expect(readSaleorSignature(new Request('http://localhost/webhook'))).toBeNull();
	});
});
