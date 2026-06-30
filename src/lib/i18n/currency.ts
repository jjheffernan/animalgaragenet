export function formatMoney(amount: number, currency: string, locale: string): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	}).format(amount);
}

export function getCurrencySymbol(currency: string, locale: string): string {
	const part = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(0).find(
		(p) => p.type === 'currency'
	);
	return part?.value ?? currency;
}
