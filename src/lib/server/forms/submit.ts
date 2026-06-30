import { createSupabaseClient } from '$lib/server/supabase/client';

export interface FormSubmitResult {
	ok: boolean;
	message: string;
}

/** Stub — inserts into Supabase when client is wired. */
export async function submitFormStub(
	table: string,
	payload: Record<string, string>
): Promise<FormSubmitResult> {
	const client = await createSupabaseClient();
	if (!client) {
		return {
			ok: true,
			message: 'Message received — we will respond within 1–2 business days.'
		};
	}

	return {
		ok: false,
		message: `${client.message} (table: ${table}, fields: ${Object.keys(payload).join(', ')})`
	};
}
