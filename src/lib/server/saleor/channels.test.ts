import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: {}
}));

vi.mock('./client', () => ({
	getSaleorChannel: vi.fn(() => 'default-channel'),
	isSaleorEnabled: vi.fn(() => false),
	saleorFetch: vi.fn()
}));

import { env } from '$env/dynamic/private';
import { getSaleorChannel, isSaleorEnabled, saleorFetch } from './client';
import {
	LOCALE_CHANNEL,
	_resetChannelCacheForTests,
	getChannelForLocale,
	listSaleorChannels,
	resolveChannelForLocale,
	resolveLocaleChannelMap
} from './channels';

describe('getChannelForLocale', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(env).SALEOR_LOCALE_CHANNELS = undefined;
		_resetChannelCacheForTests();
	});

	afterEach(() => {
		_resetChannelCacheForTests();
	});

	it('maps known locales to market channels', () => {
		expect(LOCALE_CHANNEL['en-US']).toBe('us');
		expect(LOCALE_CHANNEL['en-GB']).toBe('eu');
		expect(LOCALE_CHANNEL['ja-JP']).toBe('jp');
		expect(getChannelForLocale('en-US')).toBe('us');
		expect(getChannelForLocale('en-GB')).toBe('eu');
		expect(getChannelForLocale('ja-JP')).toBe('jp');
	});

	it('falls back to SALEOR_CHANNEL for unmapped locales', () => {
		expect(getChannelForLocale('fr-FR')).toBe('default-channel');
		expect(getChannelForLocale('')).toBe('default-channel');
	});

	it('merges SALEOR_LOCALE_CHANNELS env overrides', () => {
		vi.mocked(env).SALEOR_LOCALE_CHANNELS = JSON.stringify({
			'de-DE': 'eu',
			'en-US': 'us-west'
		});

		expect(resolveLocaleChannelMap()).toMatchObject({
			'en-US': 'us-west',
			'en-GB': 'eu',
			'de-DE': 'eu'
		});
		expect(getChannelForLocale('de-DE')).toBe('eu');
	});

	it('listSaleorChannels returns active channels when Saleor is enabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				channels: [
					{ slug: 'us', name: 'US', currencyCode: 'USD', isActive: true },
					{ slug: 'eu', name: 'EU', currencyCode: 'EUR', isActive: false }
				]
			}
		});

		const channels = await listSaleorChannels();
		expect(channels).toHaveLength(1);
		expect(channels[0]?.slug).toBe('us');
	});

	it('resolveChannelForLocale prefers mapped slug when present in Saleor', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				channels: [{ slug: 'us', name: 'US', currencyCode: 'USD', isActive: true }]
			}
		});

		await expect(resolveChannelForLocale('en-US')).resolves.toBe('us');
	});

	it('resolveChannelForLocale falls back to SALEOR_CHANNEL when map slug missing', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
		vi.mocked(getSaleorChannel).mockReturnValue('default-channel');
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				channels: [
					{ slug: 'default-channel', name: 'Default', currencyCode: 'USD', isActive: true }
				]
			}
		});

		await expect(resolveChannelForLocale('en-US')).resolves.toBe('default-channel');
	});
});
