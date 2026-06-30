import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests as resetBuildLogs,
	createBuildLogDraft,
	moderateBuildLog,
	updateBuildLog
} from '$lib/server/build-logs/repository';
import {
	_resetMockStoreForTests as resetTestimonials,
	createTestimonial,
	moderateTestimonial
} from '$lib/server/testimonials/repository';
import { submitFormStub } from '$lib/server/forms/submit';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

const BUILD_COLUMNS = [
	'user_id',
	'email',
	'title',
	'year',
	'make',
	'model',
	'description',
	'mod_list',
	'status',
	'slug'
] as const;

const TESTIMONIAL_COLUMNS = [
	'user_id',
	'display_name',
	'vehicle_summary',
	'rating',
	'title',
	'body',
	'loyalty_tier',
	'status',
	'featured'
] as const;

function assertSnakeCasePayload(payload: Record<string, unknown>): void {
	for (const key of Object.keys(payload)) {
		expect(key).toMatch(/^[a-z][a-z0-9_]*$/);
		expect(key).not.toMatch(/[A-Z]/);
	}
}

function buildRowFixture(overrides: Record<string, unknown> = {}) {
	const now = '2026-06-30T12:00:00.000Z';
	return {
		id: VALID_UUID,
		user_id: VALID_UUID,
		email: 'driver@example.com',
		title: 'Track Civic',
		year: 2018,
		make: 'Honda',
		model: 'Civic',
		description: 'Full track build.',
		mod_list: 'Coilovers, wheels',
		status: 'draft',
		slug: null,
		created_at: now,
		updated_at: now,
		...overrides
	};
}

function testimonialRowFixture(overrides: Record<string, unknown> = {}) {
	const now = '2026-06-30T12:00:00.000Z';
	return {
		id: VALID_UUID,
		user_id: VALID_UUID,
		display_name: 'Jordan',
		vehicle_summary: 'E46 M3',
		rating: 5,
		title: 'Solid crew',
		body: 'Great support on my build.',
		loyalty_tier: 'Pit Crew',
		status: 'pending',
		featured: false,
		created_at: now,
		updated_at: now,
		approved_at: null,
		...overrides
	};
}

function createSupabaseMock(row: Record<string, unknown>) {
	const insert = vi.fn().mockReturnValue({
		select: vi.fn().mockReturnValue({
			single: vi.fn().mockResolvedValue({ data: row, error: null })
		})
	});

	const update = vi.fn().mockReturnValue({
		eq: vi.fn().mockImplementation(() => ({
			eq: vi.fn().mockReturnValue({
				select: vi.fn().mockReturnValue({
					single: vi.fn().mockResolvedValue({ data: row, error: null })
				})
			}),
			then: (resolve: (value: { error: null }) => void) => resolve({ error: null })
		}))
	});

	const from = vi.fn().mockReturnValue({ insert, update });

	return { from, insert, update };
}

describe('supabase-db insert/update payload contracts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		resetBuildLogs();
		resetTestimonials();
	});

	describe('build_submissions', () => {
		it('createBuildLogDraft uses snake_case columns matching migration', async () => {
			const row = buildRowFixture();
			const mock = createSupabaseMock(row);
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await createBuildLogDraft(VALID_UUID, 'driver@example.com', {
				title: 'Track Civic',
				year: 2018,
				make: 'Honda',
				model: 'Civic',
				description: 'Full track build.',
				modList: 'Coilovers, wheels'
			});

			expect(mock.from).toHaveBeenCalledWith('build_submissions');
			const payload = mock.insert.mock.calls[0]?.[0] as Record<string, unknown>;
			assertSnakeCasePayload(payload);
			for (const col of BUILD_COLUMNS) {
				expect(payload).toHaveProperty(col);
			}
			expect(payload.user_id).toBe(VALID_UUID);
			expect(payload.mod_list).toBe('Coilovers, wheels');
			expect(payload.status).toBe('draft');
		});

		it('updateBuildLog uses snake_case patch columns', async () => {
			const row = buildRowFixture({ status: 'pending' });
			const mock = createSupabaseMock(row);
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await updateBuildLog(
				VALID_UUID,
				VALID_UUID,
				{
					title: 'Time Attack Civic',
					year: 2019,
					make: 'Honda',
					model: 'Civic',
					description: 'Updated description.',
					modList: 'New mods'
				},
				'pending'
			);

			const payload = mock.update.mock.calls[0]?.[0] as Record<string, unknown>;
			assertSnakeCasePayload(payload);
			expect(payload.mod_list).toBe('New mods');
			expect(payload.status).toBe('pending');
			expect(payload).toHaveProperty('updated_at');
		});

		it('moderateBuildLog patches status and optional slug in snake_case', async () => {
			const mock = createSupabaseMock(buildRowFixture({ status: 'approved', slug: 'track-civic' }));
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await moderateBuildLog(VALID_UUID, 'approved', 'track-civic');

			const payload = mock.update.mock.calls[0]?.[0] as Record<string, unknown>;
			assertSnakeCasePayload(payload);
			expect(payload.status).toBe('approved');
			expect(payload.slug).toBe('track-civic');
		});
	});

	describe('testimonials', () => {
		it('createTestimonial uses snake_case columns matching migration', async () => {
			const row = testimonialRowFixture();
			const mock = createSupabaseMock(row);
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await createTestimonial(VALID_UUID, {
				displayName: 'Jordan',
				vehicleSummary: 'E46 M3',
				rating: 5,
				title: 'Solid crew',
				body: 'Great support on my build.',
				loyaltyTier: 'Pit Crew'
			});

			expect(mock.from).toHaveBeenCalledWith('testimonials');
			const payload = mock.insert.mock.calls[0]?.[0] as Record<string, unknown>;
			assertSnakeCasePayload(payload);
			for (const col of TESTIMONIAL_COLUMNS) {
				expect(payload).toHaveProperty(col);
			}
			expect(payload.user_id).toBe(VALID_UUID);
			expect(payload.display_name).toBe('Jordan');
			expect(payload.vehicle_summary).toBe('E46 M3');
			expect(payload.loyalty_tier).toBe('Pit Crew');
			expect(payload.status).toBe('pending');
			expect(payload.featured).toBe(false);
		});

		it('moderateTestimonial patches approval fields in snake_case', async () => {
			const mock = createSupabaseMock(testimonialRowFixture({ status: 'approved' }));
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await moderateTestimonial(VALID_UUID, 'approved', { featured: true });

			const payload = mock.update.mock.calls[0]?.[0] as Record<string, unknown>;
			assertSnakeCasePayload(payload);
			expect(payload.status).toBe('approved');
			expect(payload.featured).toBe(true);
			expect(payload).toHaveProperty('approved_at');
			expect(payload).toHaveProperty('updated_at');
		});
	});

	describe('forms/submit resolveUserId', () => {
		const formPayload = {
			title: 'Public Build',
			year: '2020',
			make: 'Toyota',
			model: '86',
			email: 'anon@example.com',
			description: 'Street build submission.',
			modList: 'Wheels, exhaust'
		};

		it('accepts valid UUID for user_id on public build insert', async () => {
			const mock = createSupabaseMock(buildRowFixture({ status: 'pending' }));
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			const result = await submitFormStub('build_submissions', formPayload, {
				userId: VALID_UUID
			});

			expect(result.ok).toBe(true);
			const payload = mock.insert.mock.calls[0]?.[0] as Record<string, unknown>;
			expect(payload.user_id).toBe(VALID_UUID);
			expect(payload.mod_list).toBe('Wheels, exhaust');
			expect(payload.status).toBe('pending');
		});

		it('rejects invalid userId strings and inserts null user_id', async () => {
			const mock = createSupabaseMock(buildRowFixture({ user_id: null, status: 'pending' }));
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			for (const badId of ['user-1', 'not-a-uuid', '', '550e8400-e29b-41d4-a716']) {
				mock.insert.mockClear();
				await submitFormStub('build_submissions', formPayload, { userId: badId });
				const payload = mock.insert.mock.calls[0]?.[0] as Record<string, unknown>;
				expect(payload.user_id).toBeNull();
			}
		});

		it('inserts null user_id when session userId is omitted', async () => {
			const mock = createSupabaseMock(buildRowFixture({ user_id: null, status: 'pending' }));
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			await submitFormStub('build_submissions', formPayload);

			const payload = mock.insert.mock.calls[0]?.[0] as Record<string, unknown>;
			expect(payload.user_id).toBeNull();
		});
	});

	describe('submitFormStub — contact_submissions', () => {
		it('returns mock success without DB insert', async () => {
			const mock = createSupabaseMock({});
			vi.mocked(createAdminClient).mockReturnValue({ from: mock.from } as never);

			const result = await submitFormStub('contact_submissions', {
				name: 'Test User',
				email: 'test@example.com',
				subject: 'Hello',
				message: 'A message long enough.'
			});

			expect(result.ok).toBe(true);
			expect(result.message).toContain('Message received');
			expect(mock.insert).not.toHaveBeenCalled();
		});
	});
});
