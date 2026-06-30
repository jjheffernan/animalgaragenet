import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LOCALE_CHANNEL, getChannelForLocale } from './channels';

vi.mock('./client', () => ({
	getSaleorChannel: vi.fn(() => 'default-channel')
}));

describe('getChannelForLocale', () => {
	beforeEach(() => {
		vi.clearAllMocks();
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
});
