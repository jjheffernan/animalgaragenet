import { describe, expect, it } from 'vitest';
import { getLatestVideo, getVideosExcluding } from './videos';

describe('mock videos helpers', () => {
	it('returns the most recently published video', () => {
		const latest = getLatestVideo();
		expect(latest?.id).toBe('v12');
		expect(latest?.publishedAt).toBe('2026-02-15');
	});

	it('excludes a video from the listing set', () => {
		const latest = getLatestVideo();
		expect(latest).toBeDefined();
		const list = getVideosExcluding(latest!);
		expect(list).toHaveLength(11);
		expect(list.some((v) => v.id === latest!.id)).toBe(false);
	});
});
