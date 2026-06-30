import { config } from '$lib/config/env';
import { getLocaleConfig } from '$lib/i18n/locale';
import { formatMoney } from '$lib/i18n/currency';
import { getCurrencyForLocale } from '$lib/data/mock-locales';
import type { LocaleCode } from '$lib/types/locale';

class LocaleState {
	code = $state<LocaleCode>((config.defaultLocale as LocaleCode) || 'en-US');

	get current() {
		return getLocaleConfig(this.code);
	}

	get currency() {
		return getCurrencyForLocale(this.code) || this.current.currency;
	}

	setLocale(code: LocaleCode) {
		this.code = code;
	}

	formatPrice(amount: number) {
		return formatMoney(amount, this.currency, this.code);
	}
}

export const locale = new LocaleState();
