import { describe, expect, it } from 'vitest';
import { validateConnectionPutBody, normalizeHandle, parseStoredConnections } from './validation';

describe('normalizeHandle', () => {
	it('strips leading @ and whitespace', () => {
		expect(normalizeHandle('  @animalgarage  ')).toBe('animalgarage');
	});
});

describe('validateConnectionPutBody', () => {
	it('rejects missing platform', () => {
		const result = validateConnectionPutBody({ action: 'connect', handle: 'user' });
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toMatch(/platform/i);
	});

	it('rejects invalid platform', () => {
		const result = validateConnectionPutBody({
			platform: 'facebook',
			action: 'connect',
			handle: 'user'
		});
		expect(result.ok).toBe(false);
	});

	it('requires handle on connect', () => {
		const result = validateConnectionPutBody({ platform: 'instagram', action: 'connect' });
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toMatch(/handle/i);
	});

	it('rejects invalid handle characters', () => {
		const result = validateConnectionPutBody({
			platform: 'tiktok',
			action: 'connect',
			handle: 'bad handle!'
		});
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toMatch(/1–50/);
	});

	it('accepts connect with normalized handle', () => {
		const result = validateConnectionPutBody({
			platform: 'youtube',
			action: 'connect',
			handle: '@AnimalGarage'
		});
		expect(result).toEqual({
			ok: true,
			platform: 'youtube',
			action: 'connect',
			handle: 'AnimalGarage'
		});
	});

	it('accepts disconnect without handle', () => {
		const result = validateConnectionPutBody({ platform: 'discord', action: 'disconnect' });
		expect(result).toEqual({ ok: true, platform: 'discord', action: 'disconnect' });
	});
});

describe('parseStoredConnections', () => {
	it('ignores invalid keys and rows', () => {
		expect(
			parseStoredConnections({
				facebook: { handle: 'x', connectedAt: '2025-01-01' },
				instagram: { handle: 'ag', connectedAt: '2025-06-01T00:00:00.000Z', mock: true },
				youtube: null
			})
		).toEqual({
			instagram: { handle: 'ag', connectedAt: '2025-06-01T00:00:00.000Z', mock: true }
		});
	});
});
