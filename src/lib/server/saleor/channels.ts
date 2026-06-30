import { env as privateEnv } from '$env/dynamic/private';
import { getSaleorChannel, isSaleorEnabled, saleorFetch } from './client';

/**
 * Storefront locale → Saleor channel slug (static defaults).
 * Ops override via `SALEOR_LOCALE_CHANNELS` JSON env — merged in `resolveLocaleChannelMap()`.
 */
// @saleor-migration: intentional — locale→channel map; see docs/commerce/saleor.md#quick-migration
export const LOCALE_CHANNEL: Record<string, string> = {
	'en-US': 'us',
	'en-GB': 'eu',
	'ja-JP': 'jp'
};

const CHANNELS_QUERY = `query {
	channels {
		slug
		name
		currencyCode
		isActive
	}
}`;

export type SaleorChannelInfo = {
	slug: string;
	name: string;
	currencyCode: string;
	isActive: boolean;
};

let channelListCache: SaleorChannelInfo[] | null = null;

function parseLocaleChannelEnv(): Record<string, string> {
	const raw = privateEnv.SALEOR_LOCALE_CHANNELS?.trim();
	if (!raw) return {};

	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

		return Object.fromEntries(
			Object.entries(parsed)
				.filter(
					([locale, slug]) =>
						typeof locale === 'string' && typeof slug === 'string' && locale.trim() && slug.trim()
				)
				.map(([locale, slug]) => [locale.trim(), (slug as string).trim()])
		);
	} catch {
		return {};
	}
}

/** Static defaults merged with `SALEOR_LOCALE_CHANNELS` when set in Saleor admin / Netlify. */
export function resolveLocaleChannelMap(): Record<string, string> {
	return { ...LOCALE_CHANNEL, ...parseLocaleChannelEnv() };
}

export function getChannelForLocale(locale: string): string {
	return resolveLocaleChannelMap()[locale] ?? getSaleorChannel();
}

/** Active Saleor channels from admin (empty when Saleor env unset). */
export async function listSaleorChannels(): Promise<SaleorChannelInfo[]> {
	if (!isSaleorEnabled()) return [];
	if (channelListCache) return channelListCache;

	const result = await saleorFetch<{ channels: SaleorChannelInfo[] }>(CHANNELS_QUERY);
	channelListCache = (result.data?.channels ?? []).filter((channel) => channel.isActive);
	return channelListCache;
}

/** Prefer mapped slug when it exists in Saleor; otherwise fall back to `SALEOR_CHANNEL`. */
export async function resolveChannelForLocale(locale: string): Promise<string> {
	const mapped = getChannelForLocale(locale);
	const channels = await listSaleorChannels();
	if (channels.length === 0) return mapped;

	const slugs = new Set(channels.map((channel) => channel.slug));
	if (slugs.has(mapped)) return mapped;

	const fallback = getSaleorChannel();
	return slugs.has(fallback) ? fallback : mapped;
}

/** Test helper */
export function _resetChannelCacheForTests(): void {
	channelListCache = null;
}
