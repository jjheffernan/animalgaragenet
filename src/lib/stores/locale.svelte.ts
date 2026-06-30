import { config } from '$lib/config/env';
import { formatDisplayPrice } from '$lib/i18n/currency';
import { getLocaleConfig, isSupportedLocale } from '$lib/i18n/locale';
import { getCurrencyForLocale } from '$lib/data/mock/locales';
import type { Money } from '$lib/types/saleor';
import type { LocaleCode } from '$lib/types/locale';

const STORAGE_KEY = 'ag-locale';

function readStoredLocale(): LocaleCode | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw && isSupportedLocale(raw) ? raw : null;
	} catch {
		return null;
	}
}

class LocaleState {
	code = $state<LocaleCode>(
		readStoredLocale() ?? ((config.defaultLocale as LocaleCode) || 'en-US')
	);

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
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(STORAGE_KEY, code);
			} catch {
				// ignore quota / private mode
			}
		}
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
