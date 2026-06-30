/** Currencies formatted without fractional units. */
export const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW']);

/**
 * Fixed USD pivot rates for mock catalog display only — not for checkout or live Saleor pricing.
 * Rates are approximate and stable for dev UX; production uses channel-native Money from Saleor.
 */
export const MOCK_EXCHANGE_RATES_FROM_USD: Record<string, number> = {
	USD: 1,
	CAD: 1.36,
	GBP: 0.79,
	EUR: 0.92,
	AUD: 1.52,
	JPY: 150,
	KRW: 1350,
	CNY: 7.2,
	BRL: 5.0,
	MXN: 17,
	NZD: 1.65,
	SEK: 10.5,
	NOK: 10.8,
	PLN: 4.0,
	INR: 83,
	SGD: 1.34,
	AED: 3.67,
	CHF: 0.88
};

export interface ConvertMoneyOptions {
	/** When false (Saleor live), amounts are already channel-native — skip conversion. */
	useMockRates?: boolean;
}

export function roundForCurrency(amount: number, currency: string): number {
	if (ZERO_DECIMAL_CURRENCIES.has(currency)) return Math.round(amount);
	return Math.round(amount * 100) / 100;
}

export function convertMoney(
	amount: number,
	fromCurrency: string,
	toCurrency: string,
	options: ConvertMoneyOptions = {}
): number {
	const from = fromCurrency.toUpperCase();
	const to = toCurrency.toUpperCase();
	if (from === to) return amount;

	const useMockRates = options.useMockRates ?? true;
	if (!useMockRates) return amount;

	const fromRate = MOCK_EXCHANGE_RATES_FROM_USD[from];
	const toRate = MOCK_EXCHANGE_RATES_FROM_USD[to];
	if (!fromRate || !toRate) return amount;

	const usd = amount / fromRate;
	return roundForCurrency(usd * toRate, to);
}

export function formatMoney(amount: number, currency: string, locale: string): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	}).format(amount);
}

export function formatDisplayPrice(
	amount: number,
	fromCurrency: string,
	toCurrency: string,
	locale: string,
	options?: ConvertMoneyOptions
): string {
	const converted = convertMoney(amount, fromCurrency, toCurrency, options);
	return formatMoney(converted, toCurrency, locale);
}

export function getCurrencySymbol(currency: string, locale: string): string {
	const part = new Intl.NumberFormat(locale, { style: 'currency', currency })
		.formatToParts(0)
		.find((p) => p.type === 'currency');
	return part?.value ?? currency;
}
