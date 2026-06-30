import { describe, expect, it } from 'vitest';
import { formatMoney } from './currency';

describe('formatMoney', () => {
	it('formats USD for en-US locale', () => {
		expect(formatMoney(29.99, 'USD', 'en-US')).toBe('$29.99');
	});

	it('respects locale grouping and currency symbol', () => {
		const formatted = formatMoney(1000, 'EUR', 'de-DE');
		expect(formatted).toMatch(/1\.000,00/);
		expect(formatted).toMatch(/€/);
	});

	it('handles zero amounts', () => {
		expect(formatMoney(0, 'USD', 'en-US')).toBe('$0.00');
	});
});
