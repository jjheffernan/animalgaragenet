import { env as privateEnv } from '$env/dynamic/private';
import { FREE_SHIP_THRESHOLD } from '$lib/data/mock/banners';
import { getChannelForLocale } from './channels';

/** Per-channel free-shipping subtotal thresholds (USD-equivalent display units). */
const DEFAULT_CHANNEL_THRESHOLDS: Record<string, number> = {
	us: 75,
	eu: 100,
	jp: 10000,
	'default-channel': FREE_SHIP_THRESHOLD
};

export type FreeShippingProgress = {
	threshold: number;
	subtotal: number;
	remaining: number;
	qualified: boolean;
};

function parseThresholdEnv(): Record<string, number> {
	const raw = privateEnv.SALEOR_FREE_SHIPPING_THRESHOLDS?.trim();
	if (!raw) return {};

	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

		return Object.fromEntries(
			Object.entries(parsed)
				.filter(
					([channel, amount]) =>
						typeof channel === 'string' &&
						typeof amount === 'number' &&
						Number.isFinite(amount) &&
						amount >= 0
				)
				.map(([channel, amount]) => [channel.trim(), amount as number])
		);
	} catch {
		return {};
	}
}

/** Free-shipping threshold for a locale (maps to Saleor channel). */
export function getFreeShippingThresholdForLocale(locale: string): number {
	const channel = getChannelForLocale(locale);
	const envMap = parseThresholdEnv();
	return envMap[channel] ?? DEFAULT_CHANNEL_THRESHOLDS[channel] ?? FREE_SHIP_THRESHOLD;
}

export function getFreeShippingProgress(subtotal: number, locale: string): FreeShippingProgress {
	const threshold = getFreeShippingThresholdForLocale(locale);
	return {
		threshold,
		subtotal,
		remaining: Math.max(0, threshold - subtotal),
		qualified: subtotal >= threshold
	};
}
