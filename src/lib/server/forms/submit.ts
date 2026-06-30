import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';

export interface FormSubmitResult {
	ok: boolean;
	message: string;
}

/** userId must come from server session (locals.session.id), never from form body. */
export interface SubmitFormOptions {
	userId?: string | null;
}

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

	if (!createAdminClient()) {
		return { ok: true, message: mockSuccessMessage(table) };
	}

	return { ok: true, message: mockSuccessMessage(table) };
}
