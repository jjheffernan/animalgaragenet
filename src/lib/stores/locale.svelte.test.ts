import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'ag-locale';
const storage = new Map<string, string>();

function stubBrowserStorage() {
	vi.stubGlobal('window', {});
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => {
			storage.set(key, value);
		},
		removeItem: (key: string) => {
			storage.delete(key);
		},
		clear: () => {
			storage.clear();
		}
	});
}

describe('locale store persistence', () => {
	beforeEach(() => {
		storage.clear();
		stubBrowserStorage();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it('persists locale choice to localStorage', async () => {
		const { locale } = await import('./locale.svelte.ts');
		locale.setLocale('de-DE');
		expect(storage.get(STORAGE_KEY)).toBe('de-DE');
		expect(locale.code).toBe('de-DE');
	});

	it('restores a stored locale on module init', async () => {
		storage.set(STORAGE_KEY, 'ja-JP');
		const { locale } = await import('./locale.svelte.ts');
		expect(locale.code).toBe('ja-JP');
	});
});
