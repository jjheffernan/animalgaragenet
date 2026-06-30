import { describe, expect, it } from 'vitest';
import { load } from '../../src/routes/admin/+page.server';

describe('/admin redirect', () => {
	it('redirects to /admin/runtime', async () => {
		await expect(load({} as Parameters<typeof load>[0])).rejects.toMatchObject({
			status: 303,
			location: '/admin/runtime'
		});
	});
});
