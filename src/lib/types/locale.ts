import { mockLocales } from '$lib/data/mock/locales';
import { getCurrencyForLocale } from '$lib/data/mock/locales';

export type LocaleCode = (typeof mockLocales)[number]['code'];

export interface LocaleConfig {
	code: LocaleCode;
	label: string;
	currency: string;
	flag: string;
	shippingRegions: string[];
}

export const locales: LocaleConfig[] = mockLocales.map((l) => ({
	code: l.code as LocaleCode,
	label: l.label,
	currency: l.currency,
	flag: l.flag,
	shippingRegions: [l.country.slice(0, 2).toUpperCase()]
}));

export { getCurrencyForLocale };
