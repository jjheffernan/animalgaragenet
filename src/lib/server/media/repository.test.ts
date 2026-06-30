import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { cleanupStalePendingAssets, listStaffMediaAssets } from './repository';

describe('media repository (admin)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('listStaffMediaAssets returns empty when Supabase is unset', async () => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		await expect(listStaffMediaAssets()).resolves.toEqual([]);
	});

	it('cleanupStalePendingAssets returns zero when Supabase is unset', async () => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		await expect(cleanupStalePendingAssets()).resolves.toEqual({ deleted: 0 });
	});
});
