import type { CountryLocale } from '$lib/types/domain';

export const mockLocales: CountryLocale[] = [
	{ code: 'en-US', country: 'United States', currency: 'USD', label: 'United States (USD)', flag: '🇺🇸' },
	{ code: 'en-CA', country: 'Canada', currency: 'CAD', label: 'Canada (CAD)', flag: '🇨🇦' },
	{ code: 'en-GB', country: 'United Kingdom', currency: 'GBP', label: 'United Kingdom (GBP)', flag: '🇬🇧' },
	{ code: 'en-AU', country: 'Australia', currency: 'AUD', label: 'Australia (AUD)', flag: '🇦🇺' },
	{ code: 'de-DE', country: 'Germany', currency: 'EUR', label: 'Deutschland (EUR)', flag: '🇩🇪' },
	{ code: 'fr-FR', country: 'France', currency: 'EUR', label: 'France (EUR)', flag: '🇫🇷' },
	{ code: 'es-ES', country: 'Spain', currency: 'EUR', label: 'España (EUR)', flag: '🇪🇸' },
	{ code: 'it-IT', country: 'Italy', currency: 'EUR', label: 'Italia (EUR)', flag: '🇮🇹' },
	{ code: 'nl-NL', country: 'Netherlands', currency: 'EUR', label: 'Nederland (EUR)', flag: '🇳🇱' },
	{ code: 'ja-JP', country: 'Japan', currency: 'JPY', label: '日本 (JPY)', flag: '🇯🇵' },
	{ code: 'ko-KR', country: 'South Korea', currency: 'KRW', label: '대한민국 (KRW)', flag: '🇰🇷' },
	{ code: 'zh-CN', country: 'China', currency: 'CNY', label: '中国 (CNY)', flag: '🇨🇳' },
	{ code: 'pt-BR', country: 'Brazil', currency: 'BRL', label: 'Brasil (BRL)', flag: '🇧🇷' },
	{ code: 'mx-MX', country: 'Mexico', currency: 'MXN', label: 'México (MXN)', flag: '🇲🇽' },
	{ code: 'en-NZ', country: 'New Zealand', currency: 'NZD', label: 'New Zealand (NZD)', flag: '🇳🇿' },
	{ code: 'sv-SE', country: 'Sweden', currency: 'SEK', label: 'Sverige (SEK)', flag: '🇸🇪' },
	{ code: 'no-NO', country: 'Norway', currency: 'NOK', label: 'Norge (NOK)', flag: '🇳🇴' },
	{ code: 'pl-PL', country: 'Poland', currency: 'PLN', label: 'Polska (PLN)', flag: '🇵🇱' },
	{ code: 'en-IN', country: 'India', currency: 'INR', label: 'India (INR)', flag: '🇮🇳' },
	{ code: 'en-SG', country: 'Singapore', currency: 'SGD', label: 'Singapore (SGD)', flag: '🇸🇬' },
	{ code: 'ar-AE', country: 'UAE', currency: 'AED', label: 'UAE (AED)', flag: '🇦🇪' },
	{ code: 'en-IE', country: 'Ireland', currency: 'EUR', label: 'Ireland (EUR)', flag: '🇮🇪' },
	{ code: 'de-AT', country: 'Austria', currency: 'EUR', label: 'Österreich (EUR)', flag: '🇦🇹' },
	{ code: 'de-CH', country: 'Switzerland', currency: 'CHF', label: 'Schweiz (CHF)', flag: '🇨🇭' }
];

export function getLocaleByCode(code: string): CountryLocale | undefined {
	return mockLocales.find((l) => l.code === code);
}

export function getCurrencyForLocale(code: string): string {
	return getLocaleByCode(code)?.currency ?? 'USD';
}
