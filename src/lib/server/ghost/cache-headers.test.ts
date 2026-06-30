import { describe, expect, it } from 'vitest';
import {
	GHOST_DETAIL_CACHE_CONTROL,
	GHOST_LIST_CACHE_CONTROL,
	setGhostDetailCacheHeaders,
	setGhostListCacheHeaders
} from './cache-headers';

describe('ghost cache headers', () => {
	it('sets list cache-control on list routes', () => {
		const headers: Record<string, string> = {};
		setGhostListCacheHeaders((h) => Object.assign(headers, h));
		expect(headers['cache-control']).toBe(GHOST_LIST_CACHE_CONTROL);
		expect(headers['cache-control']).toContain('max-age=300');
	});

	it('sets detail cache-control on detail routes', () => {
		const headers: Record<string, string> = {};
		setGhostDetailCacheHeaders((h) => Object.assign(headers, h));
		expect(headers['cache-control']).toBe(GHOST_DETAIL_CACHE_CONTROL);
		expect(headers['cache-control']).toContain('max-age=600');
	});
});
