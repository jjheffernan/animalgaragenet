import type { CountryLocale } from '$lib/types/domain';

export const mockLocales: CountryLocale[] = [
	{ code: 'en-US', country: 'United States', currency: 'USD', label: 'United States (USD)' },
	{ code: 'en-CA', country: 'Canada', currency: 'CAD', label: 'Canada (CAD)' },
	{ code: 'en-GB', country: 'United Kingdom', currency: 'GBP', label: 'United Kingdom (GBP)' },
	{ code: 'en-AU', country: 'Australia', currency: 'AUD', label: 'Australia (AUD)' },
	{ code: 'de-DE', country: 'Germany', currency: 'EUR', label: 'Deutschland (EUR)' },
	{ code: 'fr-FR', country: 'France', currency: 'EUR', label: 'France (EUR)' },
	{ code: 'es-ES', country: 'Spain', currency: 'EUR', label: 'España (EUR)' },
	{ code: 'it-IT', country: 'Italy', currency: 'EUR', label: 'Italia (EUR)' },
	{ code: 'nl-NL', country: 'Netherlands', currency: 'EUR', label: 'Nederland (EUR)' },
	{ code: 'ja-JP', country: 'Japan', currency: 'JPY', label: '日本 (JPY)' },
	{ code: 'ko-KR', country: 'South Korea', currency: 'KRW', label: '대한민국 (KRW)' },
	{ code: 'zh-CN', country: 'China', currency: 'CNY', label: '中国 (CNY)' },
	{ code: 'pt-BR', country: 'Brazil', currency: 'BRL', label: 'Brasil (BRL)' },
	{ code: 'mx-MX', country: 'Mexico', currency: 'MXN', label: 'México (MXN)' },
	{ code: 'en-NZ', country: 'New Zealand', currency: 'NZD', label: 'New Zealand (NZD)' },
	{ code: 'sv-SE', country: 'Sweden', currency: 'SEK', label: 'Sverige (SEK)' },
	{ code: 'no-NO', country: 'Norway', currency: 'NOK', label: 'Norge (NOK)' },
	{ code: 'pl-PL', country: 'Poland', currency: 'PLN', label: 'Polska (PLN)' },
	{ code: 'en-IN', country: 'India', currency: 'INR', label: 'India (INR)' },
	{ code: 'en-SG', country: 'Singapore', currency: 'SGD', label: 'Singapore (SGD)' },
	{ code: 'ar-AE', country: 'UAE', currency: 'AED', label: 'UAE (AED)' },
	{ code: 'en-IE', country: 'Ireland', currency: 'EUR', label: 'Ireland (EUR)' },
	{ code: 'de-AT', country: 'Austria', currency: 'EUR', label: 'Österreich (EUR)' },
	{ code: 'de-CH', country: 'Switzerland', currency: 'CHF', label: 'Schweiz (CHF)' }
];

export function getLocaleByCode(code: string): CountryLocale | undefined {
	return mockLocales.find((l) => l.code === code);
}

export function getCurrencyForLocale(code: string): string {
	return getLocaleByCode(code)?.currency ?? 'USD';
}
