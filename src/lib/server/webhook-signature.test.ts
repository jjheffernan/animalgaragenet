import { describe, expect, it } from 'vitest';
import { verifySharedSecret } from './webhook-signature';

describe('verifySharedSecret', () => {
	it('accepts matching cron secret', () => {
		expect(verifySharedSecret('cron-secret', 'cron-secret')).toBe(true);
	});

	it('rejects missing or wrong secret', () => {
		expect(verifySharedSecret(null, 'cron-secret')).toBe(false);
		expect(verifySharedSecret('wrong', 'cron-secret')).toBe(false);
	});
});
