import { config } from '$lib/config/env';
import { formatDisplayPrice } from '$lib/i18n/currency';
import { getLocaleConfig, isSupportedLocale } from '$lib/i18n/locale';
import type { Money } from '$lib/types/saleor';
import type { LocaleCode } from '$lib/types/locale';
import { readStoredString, writeStoredString } from './storage';

const STORAGE_KEY = 'ag-locale';

function readStoredLocale(): LocaleCode | null {
	const raw = readStoredString(STORAGE_KEY);
	return raw && isSupportedLocale(raw) ? raw : null;
}

class LocaleState {
	code = $state<LocaleCode>(
		readStoredLocale() ?? ((config.defaultLocale as LocaleCode) || 'en-US')
	);

	get current() {
		return getLocaleConfig(this.code);
	}

	get currency() {
		return this.current.currency;
	}

	setLocale(code: LocaleCode) {
		this.code = code;
		writeStoredString(STORAGE_KEY, code);
	}

	formatPrice(amount: number, fromCurrency: string = config.defaultCurrency) {
		return formatDisplayPrice(amount, fromCurrency, this.currency, this.code, {
			useMockRates: !config.saleorApiUrl
		});
	}

	formatMoneyValue(money: Money) {
		return this.formatPrice(money.amount, money.currency);
	}
}

export const locale = new LocaleState();
