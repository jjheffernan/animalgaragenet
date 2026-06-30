export type LocaleCode = 'en-US' | 'en-GB' | 'de-DE' | 'ja-JP';

export interface LocaleConfig {
	code: LocaleCode;
	label: string;
	currency: string;
	shippingRegions: string[];
}

export const locales: LocaleConfig[] = [
	{ code: 'en-US', label: 'United States', currency: 'USD', shippingRegions: ['US', 'CA'] },
	{ code: 'en-GB', label: 'United Kingdom', currency: 'GBP', shippingRegions: ['GB', 'EU'] },
	{ code: 'de-DE', label: 'Deutschland', currency: 'EUR', shippingRegions: ['DE', 'EU'] },
	{ code: 'ja-JP', label: '日本', currency: 'JPY', shippingRegions: ['JP', 'APAC'] }
];
