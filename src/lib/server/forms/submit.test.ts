import { afterEach, describe, expect, it, vi } from 'vitest';
import { _resetRateLimitsForTests } from '$lib/server/rate-limit';
import { createAdminClient } from '$lib/server/supabase/admin';
import { submitFormStub } from '$lib/server/forms/submit';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

const formPayload = {
	title: 'Public Build',
	year: '2020',
	make: 'Toyota',
	model: '86',
	email: 'anon@example.com',
	description: 'Street build submission.',
	modList: 'Wheels, exhaust'
};

describe('submitFormStub build_submissions guard', () => {
	afterEach(() => {
		_resetRateLimitsForTests();
		vi.mocked(createAdminClient).mockReturnValue(null);
	});

	it('silently succeeds when honeypot is filled', async () => {
		const result = await submitFormStub('build_submissions', formPayload, {
			clientKey: '1.2.3.4',
			honeypot: 'bot-filled'
		});
		expect(result.ok).toBe(true);
		expect(createAdminClient).not.toHaveBeenCalled();
	});

	it('rejects when rate limit exceeded', async () => {
		const key = '9.9.9.9';
		for (let i = 0; i < 10; i++) {
			await submitFormStub('build_submissions', formPayload, { clientKey: key });
		}
		const blocked = await submitFormStub('build_submissions', formPayload, { clientKey: key });
		expect(blocked.ok).toBe(false);
		expect(blocked.message).toMatch(/too many/i);
	});
});
