import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/media/cdn', () => ({
	invalidateCdnPaths: vi.fn(),
	isCdnInvalidationConfigured: vi.fn()
}));

import { invalidateCdnPaths, isCdnInvalidationConfigured } from '$lib/server/media/cdn';
import { POST } from '../../src/routes/api/admin/media/invalidate/+server';

function apiEvent(body: Record<string, unknown>, locals: App.Locals) {
	const request = new Request('http://localhost/api/admin/media/invalidate', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
	return { request, locals };
}

describe('POST /api/admin/media/invalidate', () => {
	beforeEach(() => {
		vi.mocked(isCdnInvalidationConfigured).mockReturnValue(true);
		vi.mocked(invalidateCdnPaths).mockResolvedValue(true);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('rejects unauthenticated staff', async () => {
		const response = await POST(
			apiEvent({ objectKey: 'media/admin/x.jpg' }, { session: null, devAdmin: false } as App.Locals)
		);
		expect(response.status).toBe(403);
	});

	it('invalidates CDN path for staff', async () => {
		const response = await POST(
			apiEvent(
				{ objectKey: 'media/admin/x.jpg' },
				{
					session: { role: 'editor' },
					devAdmin: false
				} as App.Locals
			)
		);
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);
		expect(invalidateCdnPaths).toHaveBeenCalledWith(['media/admin/x.jpg']);
	});
});
