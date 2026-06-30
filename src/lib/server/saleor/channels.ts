import { getSaleorChannel } from './client';

/**
 * Storefront locale → Saleor channel slug.
 * Unmapped locales fall back to `SALEOR_CHANNEL` (default `default-channel`).
 */
// @saleor-migration: intentional — locale→channel map; see docs/commerce/saleor.md#quick-migration
export const LOCALE_CHANNEL: Record<string, string> = {
	'en-US': 'us',
	'en-GB': 'eu',
	'ja-JP': 'jp'
};

export function getChannelForLocale(locale: string): string {
	return LOCALE_CHANNEL[locale] ?? getSaleorChannel();
}
