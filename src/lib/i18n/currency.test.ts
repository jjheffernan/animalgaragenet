import { describe, expect, it } from 'vitest';
import {
	convertMoney,
	formatDisplayPrice,
	formatMoney,
	MOCK_EXCHANGE_RATES_FROM_USD,
	roundForCurrency
} from './currency';

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

describe('convertMoney', () => {
	it('returns the same amount when currencies match', () => {
		expect(convertMoney(42, 'USD', 'USD')).toBe(42);
	});

	it('converts USD to EUR using mock rates', () => {
		const eur = convertMoney(100, 'USD', 'EUR');
		const expected = roundForCurrency(100 * MOCK_EXCHANGE_RATES_FROM_USD.EUR, 'EUR');
		expect(eur).toBe(expected);
	});

	it('converts GBP to USD via USD pivot', () => {
		const usd = convertMoney(79, 'GBP', 'USD');
		expect(usd).toBe(100);
	});

	it('rounds JPY to whole units', () => {
		const jpy = convertMoney(10, 'USD', 'JPY');
		expect(jpy).toBe(Math.round(10 * MOCK_EXCHANGE_RATES_FROM_USD.JPY));
		expect(jpy % 1).toBe(0);
	});

	it('skips conversion when mock rates are disabled (Saleor live)', () => {
		expect(convertMoney(100, 'USD', 'EUR', { useMockRates: false })).toBe(100);
	});
});

describe('formatDisplayPrice', () => {
	it('changes numeric amount and symbol for mock catalog prices', () => {
		const usd = formatDisplayPrice(100, 'USD', 'USD', 'en-US', { useMockRates: true });
		const eur = formatDisplayPrice(100, 'USD', 'EUR', 'de-DE', { useMockRates: true });
		expect(usd).toBe('$100.00');
		expect(eur).not.toBe(usd);
		expect(eur).toMatch(/€/);
	});

	it('formats Saleor channel amounts without conversion', () => {
		const formatted = formatDisplayPrice(89.5, 'EUR', 'EUR', 'de-DE', { useMockRates: false });
		expect(formatted).toMatch(/89,50/);
		expect(formatted).toMatch(/€/);
	});
});
