import { checkBuildSubmitRateLimit } from '$lib/server/build-logs/submit-guard';
import { createAdminClient } from '$lib/server/supabase/admin';
import { createWholesaleInquiry } from '$lib/server/wholesale/repository';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';

export interface FormSubmitResult {
	ok: boolean;
	message: string;
}

/** userId must come from server session (locals.session.id), never from form body. */
export interface SubmitFormOptions {
	userId?: string | null;
	/** Client IP or fingerprint for rate limiting (from `getClientAddress()`). */
	clientKey?: string;
	/** Honeypot field value — bots that fill it are silently rejected. */
	honeypot?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mockSuccessMessage(table: string): string {
	if (table === 'build_submissions') {
		return 'Build submitted — pending review. We will notify you when it is approved.';
	}
	return 'Message received — we will respond within 1–2 business days.';
}

function resolveUserId(userId?: string | null): string | null {
	if (!userId || !UUID_RE.test(userId)) return null;
	return userId;
}

function sanitizeBuildPayload(payload: Record<string, string>) {
	const limits = LIMITS.buildLog;
	return {
		title: trimToMax(payload.title ?? '', limits.title),
		year: Number.parseInt(payload.year ?? '', 10),
		make: trimToMax(payload.make ?? '', limits.make),
		model: trimToMax(payload.model ?? '', limits.model),
		email: trimToMax(payload.email ?? '', limits.email),
		description: trimToMax(payload.description ?? '', limits.description),
		modList: trimToMax(payload.modList ?? '', limits.modList)
	};
}

async function insertBuildSubmission(
	payload: Record<string, string>,
	options?: SubmitFormOptions
): Promise<FormSubmitResult> {
	if (options?.honeypot?.trim()) {
		return { ok: true, message: mockSuccessMessage('build_submissions') };
	}
	if (options?.clientKey && !checkBuildSubmitRateLimit(options.clientKey)) {
		return { ok: false, message: 'Too many submissions. Please try again later.' };
	}

	const admin = createAdminClient();
	if (!admin) {
		return { ok: true, message: mockSuccessMessage('build_submissions') };
	}

	const fields = sanitizeBuildPayload(payload);

	const { error } = await admin.from('build_submissions').insert({
		title: fields.title,
		year: fields.year,
		make: fields.make,
		model: fields.model,
		email: fields.email,
		description: fields.description,
		mod_list: fields.modList,
		user_id: resolveUserId(options?.userId),
		status: 'pending',
		slug: null
	});

	if (error) {
		console.error('build_submissions insert failed:', error.message);
		return { ok: false, message: 'Unable to submit build. Please try again.' };
	}

	return { ok: true, message: mockSuccessMessage('build_submissions') };
}

/** Persists form data to Supabase when configured; mock success otherwise. */
export async function submitFormStub(
	table: string,
	payload: Record<string, string>,
	options?: SubmitFormOptions
): Promise<FormSubmitResult> {
	if (table === 'build_submissions') {
		return insertBuildSubmission(payload, options);
	}

	if (table === 'wholesale_inquiries') {
		const inquiry = await createWholesaleInquiry({
			businessName: payload.businessName ?? '',
			contactName: payload.contactName ?? '',
			email: payload.email ?? '',
			phone: payload.phone,
			website: payload.website,
			message: payload.message ?? ''
		});
		if (!inquiry) {
			return { ok: false, message: 'Unable to submit application. Please try again.' };
		}
		return {
			ok: true,
			message: 'Application received — our wholesale team will respond within 1–2 business days.'
		};
	}

	// ponytail: contact_submissions has no table yet — mock success only
	return { ok: true, message: mockSuccessMessage(table) };
}
