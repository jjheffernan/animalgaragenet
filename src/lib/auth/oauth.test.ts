import { describe, expect, it } from 'vitest';
import {
	isOAuthProvider,
	mockCallbackQuery,
	mockCallbackUrl,
	mockOAuthEmail,
	oauthDisplayName,
	OAUTH_BUTTON_LABELS,
	OAUTH_PROVIDER_LABELS
} from './oauth';

describe('OAuth provider helpers', () => {
	it('narrows supported providers', () => {
		expect(isOAuthProvider('google')).toBe(true);
		expect(isOAuthProvider('discord')).toBe(true);
		expect(isOAuthProvider('azure')).toBe(true);
		expect(isOAuthProvider('facebook')).toBe(false);
		expect(isOAuthProvider(null)).toBe(false);
	});

	it('exposes human-readable labels for each provider', () => {
		expect(OAUTH_PROVIDER_LABELS.google).toBe('Google');
		expect(OAUTH_BUTTON_LABELS.discord).toBe('Continue with Discord');
	});

	it('builds mock callback query and URL', () => {
		expect(mockCallbackQuery('google')).toBe('provider=google&mock=1');
		expect(mockCallbackQuery('azure', '/account')).toBe(
			'provider=azure&mock=1&redirect=%2Faccount'
		);
		expect(mockCallbackUrl('discord', '/shop')).toBe(
			'/auth/callback?provider=discord&mock=1&redirect=%2Fshop'
		);
	});

	it('returns provider-specific mock emails', () => {
		expect(mockOAuthEmail('google')).toBe('user@gmail.com');
		expect(mockOAuthEmail('discord')).toBe('user@discord.mock');
		expect(mockOAuthEmail('azure')).toBe('user@outlook.com');
	});
});

describe('oauthDisplayName', () => {
	it('prefers username fields over full name', () => {
		expect(
			oauthDisplayName({
				user_name: ' trackfan ',
				full_name: 'Jordan Lee'
			})
		).toBe('trackfan');
	});

	it('falls back to full_name or name', () => {
		expect(oauthDisplayName({ full_name: 'Sam Rivera' })).toBe('Sam Rivera');
		expect(oauthDisplayName({ name: 'Alex' })).toBe('Alex');
	});

	it('returns null for empty or missing metadata', () => {
		expect(oauthDisplayName(null)).toBeNull();
		expect(oauthDisplayName({ full_name: '   ' })).toBeNull();
		expect(oauthDisplayName({ preferred_username: '' })).toBeNull();
	});
});
