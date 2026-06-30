import { locales, type LocaleCode } from '$lib/types/locale';

export function getLocaleConfig(code: LocaleCode) {
	return locales.find((l) => l.code === code) ?? locales[0];
}

export function isSupportedLocale(code: string): code is LocaleCode {
	return locales.some((l) => l.code === code);
}
