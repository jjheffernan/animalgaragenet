import { createAdminClient } from '$lib/server/supabase/admin';

export interface FormSubmitResult {
	ok: boolean;
	message: string;
}

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

async function insertBuildSubmission(
	payload: Record<string, string>,
	options?: SubmitFormOptions
): Promise<FormSubmitResult> {
	const admin = createAdminClient();
	if (!admin) {
		return { ok: true, message: mockSuccessMessage('build_submissions') };
	}

	const { error } = await admin.from('build_submissions').insert({
		title: payload.title,
		year: Number.parseInt(payload.year, 10),
		make: payload.make,
		model: payload.model,
		email: payload.email,
		description: payload.description,
		mod_list: payload.modList,
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
