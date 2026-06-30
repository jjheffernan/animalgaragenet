import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests,
	getDefaultHeroSection,
	getFeaturedSection
} from './repository';

describe('featured-sections repository', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('getDefaultHeroSection uses static fallback when no active campaign', () => {
		const section = getDefaultHeroSection();
		expect(section.sectionKey).toBe('hero');
		expect(section.content.headline).toBe('Garage Culture Delivered');
		expect(section.content.subheadline).toContain('Animal Garage');
		expect(section.content.image).toBe('https://picsum.photos/seed/aghero/1920/1080');
	});

	it('getFeaturedSection returns hero fallback in mock mode', async () => {
		const section = await getFeaturedSection('hero');
		expect(section?.sectionKey).toBe('hero');
		expect(section?.content.headline).toBeTruthy();
	});
});
