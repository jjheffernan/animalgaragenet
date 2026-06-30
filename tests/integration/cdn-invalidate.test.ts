import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const validKey = 'media/admin/550e8400-e29b-41d4-a716-446655440000/hero.jpg';

vi.mock('$lib/server/media/cdn', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/media/cdn')>();
	return {
		...actual,
		invalidateCdnPaths: vi.fn(),
		isCdnInvalidationConfigured: vi.fn()
	};
});

import {
	collectAdminInvalidationKeys,
	invalidateCdnPaths,
	isCdnInvalidationConfigured
} from '$lib/server/media/cdn';
import { POST } from '../../src/routes/api/admin/media/invalidate/+server';

function apiEvent(body: Record<string, unknown>, locals: App.Locals) {
	const request = new Request('http://localhost/api/admin/media/invalidate', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
	return { request, locals };
}

const staffLocals = {
	session: { role: 'editor' },
	devAdmin: false
} as App.Locals;

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
			apiEvent({ objectKey: validKey }, { session: null, devAdmin: false } as App.Locals)
		);
		expect(response.status).toBe(403);
	});

	it('invalidates CDN path for staff via objectKey', async () => {
		const response = await POST(apiEvent({ objectKey: validKey }, staffLocals));
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);
		expect(invalidateCdnPaths).toHaveBeenCalledWith([validKey]);
	});

	it('rejects CloudFront wildcard invalidation', async () => {
		const response = await POST(apiEvent({ paths: ['/*'] }, staffLocals));
		const body = await response.json();
		expect(response.status).toBe(400);
		expect(body.error).toMatch(/invalid/i);
		expect(invalidateCdnPaths).not.toHaveBeenCalled();
	});

	it('rejects path traversal', async () => {
		const response = await POST(apiEvent({ paths: ['media/admin/../secrets.txt'] }, staffLocals));
		expect(response.status).toBe(400);
		expect(invalidateCdnPaths).not.toHaveBeenCalled();
	});

	it('rejects keys outside media/admin prefix', async () => {
		const response = await POST(apiEvent({ objectKey: 'ugc/user/photo.jpg' }, staffLocals));
		expect(response.status).toBe(400);
		expect(invalidateCdnPaths).not.toHaveBeenCalled();
	});

	it('rejects more than ten paths', async () => {
		const paths = Array.from(
			{ length: 11 },
			(_, index) =>
				`media/admin/00000000-0000-4000-8000-${String(index).padStart(12, '0')}/file.jpg`
		);
		const response = await POST(apiEvent({ paths }, staffLocals));
		expect(response.status).toBe(400);
		expect(invalidateCdnPaths).not.toHaveBeenCalled();
	});
});

describe('collectAdminInvalidationKeys', () => {
	it('accepts upload-slot object keys with or without a leading slash', () => {
		const result = collectAdminInvalidationKeys({
			paths: [`/${validKey}`]
		});
		expect(result).toEqual({ ok: true, keys: [validKey] });
	});
});
