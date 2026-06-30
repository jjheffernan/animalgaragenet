import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';
import type { Testimonial, TestimonialStatus } from '$lib/types/testimonial';

const mockStore = new Map<string, Testimonial>();

function rowToTestimonial(row: Record<string, unknown>): Testimonial {
	return {
		id: String(row.id),
		userId: String(row.user_id),
		displayName: String(row.display_name),
		vehicleSummary: row.vehicle_summary ? String(row.vehicle_summary) : null,
		rating: Number(row.rating),
		title: String(row.title),
		body: String(row.body),
		status: row.status as TestimonialStatus,
		loyaltyTier: row.loyalty_tier ? String(row.loyalty_tier) : null,
		featured: Boolean(row.featured),
		createdAt: String(row.created_at),
		updatedAt: String(row.updated_at ?? row.created_at),
		approvedAt: row.approved_at ? String(row.approved_at) : null
	};
}

function mockTestimonial(
	userId: string,
	fields: Omit<Testimonial, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'approvedAt'>
): Testimonial {
	const now = new Date().toISOString();
	const id = crypto.randomUUID();
	const testimonial: Testimonial = {
		id,
		userId,
		createdAt: now,
		updatedAt: now,
		approvedAt: null,
		...fields
	};
	mockStore.set(id, testimonial);
	return testimonial;
}

export async function listTestimonialsForUser(userId: string): Promise<Testimonial[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()]
			.filter((t) => t.userId === userId)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}

	const { data, error } = await admin
		.from('testimonials')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error || !data) return [];
	return data.map(rowToTestimonial);
}

export async function listApprovedTestimonials(limit?: number): Promise<Testimonial[]> {
	const admin = createAdminClient();
	if (!admin) {
		const approved = [...mockStore.values()]
			.filter((t) => t.status === 'approved')
			.sort((a, b) => (b.approvedAt ?? b.createdAt).localeCompare(a.approvedAt ?? a.createdAt));
		return limit ? approved.slice(0, limit) : approved;
	}

	let query = admin
		.from('testimonials')
		.select('*')
		.eq('status', 'approved')
		.order('approved_at', { ascending: false, nullsFirst: false });

	if (limit) query = query.limit(limit);

	const { data, error } = await query;
	if (error || !data) return [];
	return data.map(rowToTestimonial);
}

export async function listFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()]
			.filter((t) => t.status === 'approved' && t.featured)
			.sort((a, b) => (b.approvedAt ?? b.createdAt).localeCompare(a.approvedAt ?? a.createdAt))
			.slice(0, limit);
	}

	const { data, error } = await admin
		.from('testimonials')
		.select('*')
		.eq('status', 'approved')
		.eq('featured', true)
		.order('approved_at', { ascending: false, nullsFirst: false })
		.limit(limit);

	if (error || !data) return [];
	return data.map(rowToTestimonial);
}

export async function listPendingTestimonials(): Promise<Testimonial[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()]
			.filter((t) => t.status === 'pending')
			.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	}

	const { data, error } = await admin
		.from('testimonials')
		.select('*')
		.eq('status', 'pending')
		.order('created_at', { ascending: true });

	if (error || !data) return [];
	return data.map(rowToTestimonial);
}

export async function createTestimonial(
	userId: string,
	fields: {
		displayName: string;
		vehicleSummary: string | null;
		rating: number;
		title: string;
		body: string;
		loyaltyTier: string | null;
	}
): Promise<Testimonial> {
	const sanitized = {
		displayName: trimToMax(fields.displayName, LIMITS.testimonial.displayName),
		vehicleSummary: fields.vehicleSummary
			? trimToMax(fields.vehicleSummary, LIMITS.testimonial.vehicleSummary)
			: null,
		rating: fields.rating,
		title: trimToMax(fields.title, LIMITS.testimonial.title),
		body: trimToMax(fields.body, LIMITS.testimonial.body),
		loyaltyTier: fields.loyaltyTier
			? trimToMax(fields.loyaltyTier, LIMITS.testimonial.loyaltyTier)
			: null
	};

	const admin = createAdminClient();
	if (!admin) {
		return mockTestimonial(userId, {
			...sanitized,
			status: 'pending',
			featured: false
		});
	}

	const { data, error } = await admin
		.from('testimonials')
		.insert({
			user_id: userId,
			display_name: sanitized.displayName,
			vehicle_summary: sanitized.vehicleSummary,
			rating: sanitized.rating,
			title: sanitized.title,
			body: sanitized.body,
			loyalty_tier: sanitized.loyaltyTier,
			status: 'pending',
			featured: false
		})
		.select('*')
		.single();

	if (error || !data) throw new Error(error?.message ?? 'Failed to submit testimonial');
	return rowToTestimonial(data);
}

export async function moderateTestimonial(
	id: string,
	decision: 'approved' | 'rejected',
	options: { featured?: boolean } = {}
): Promise<boolean> {
	const admin = createAdminClient();
	const now = new Date().toISOString();

	if (!admin) {
		const testimonial = mockStore.get(id);
		if (!testimonial) return false;
		testimonial.status = decision;
		testimonial.updatedAt = now;
		if (decision === 'approved') {
			testimonial.approvedAt = now;
			testimonial.featured = options.featured ?? false;
			// TODO: grant loyalty XP server-side when XP moves off localStorage
		}
		mockStore.set(id, testimonial);
		return true;
	}

	const patch: Record<string, unknown> = {
		status: decision,
		updated_at: now
	};

	if (decision === 'approved') {
		patch.approved_at = now;
		patch.featured = options.featured ?? false;
		// TODO: grant loyalty XP server-side when XP moves off localStorage
	}

	const { error } = await admin.from('testimonials').update(patch).eq('id', id);
	return !error;
}

/** Clears in-memory mock store — for unit tests only. */
export function _resetMockStoreForTests(): void {
	mockStore.clear();
}
