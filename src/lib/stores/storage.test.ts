import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	readStoredJson,
	readStoredString,
	removeStoredJson,
	writeStoredJson,
	writeStoredString
} from './storage';

const storage = new Map<string, string>();

beforeEach(() => {
	storage.clear();
	vi.stubGlobal('window', {});
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => storage.get(key) ?? null,
		setItem: (key: string, value: string) => {
			storage.set(key, value);
		},
		removeItem: (key: string) => {
			storage.delete(key);
		}
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('store storage helpers', () => {
	it('round-trips JSON values', () => {
		writeStoredJson('ag-test', { xp: 5 });
		expect(readStoredJson('ag-test', { xp: 0 })).toEqual({ xp: 5 });
	});

	it('returns fallback on missing or invalid JSON', () => {
		storage.set('ag-bad', '{');
		expect(readStoredJson('ag-missing', [])).toEqual([]);
		expect(readStoredJson('ag-bad', [])).toEqual([]);
	});

	it('round-trips plain strings and removes keys', () => {
		writeStoredString('ag-locale', 'de-DE');
		expect(readStoredString('ag-locale')).toBe('de-DE');
		removeStoredJson('ag-locale');
		expect(readStoredString('ag-locale')).toBeNull();
	});
});
