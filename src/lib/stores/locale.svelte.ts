import { config } from '$lib/config/env';
import { formatDisplayPrice } from '$lib/i18n/currency';
import { getLocaleConfig } from '$lib/i18n/locale';
import { getCurrencyForLocale } from '$lib/data/mock/locales';
import type { Money } from '$lib/types/saleor';
import type { LocaleCode } from '$lib/types/locale';

class LocaleState {
	code = $state<LocaleCode>((config.defaultLocale as LocaleCode) || 'en-US');

	get current() {
		return getLocaleConfig(this.code);
	}

	get currency() {
		return getCurrencyForLocale(this.code) || this.current.currency;
	}

	get usesMockConversion() {
		return !config.saleorApiUrl;
	}

	setLocale(code: LocaleCode) {
		this.code = code;
	}

	formatPrice(amount: number, fromCurrency: string = config.defaultCurrency) {
		return formatDisplayPrice(amount, fromCurrency, this.currency, this.code, {
			useMockRates: this.usesMockConversion
		});
	}

	formatMoneyValue(money: Money) {
		return this.formatPrice(money.amount, money.currency);
	}
}

export const locale = new LocaleState();
