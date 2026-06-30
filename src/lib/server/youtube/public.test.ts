import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn(() => null)
}));

import { loadHomepageVideos } from './public';
import { mockVideos } from '$lib/data/mock/videos';

describe('loadHomepageVideos', () => {
	it('falls back to mock videos when Supabase is unset', async () => {
		const videos = await loadHomepageVideos(3);
		expect(videos).toHaveLength(3);
		expect(mockVideos.some((video) => video.id === videos[0]?.id)).toBe(true);
	});
});
