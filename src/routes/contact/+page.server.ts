import { fail } from '@sveltejs/kit';
import { submitFormStub } from '$lib/server/forms/submit';
import type { Actions } from './$types';

function validateEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const subject = String(data.get('subject') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();

		const errors: Record<string, string> = {};
		if (!name) errors.name = 'Name is required';
		if (!email) errors.email = 'Email is required';
		else if (!validateEmail(email)) errors.email = 'Enter a valid email address';
		if (!subject) errors.subject = 'Subject is required';
		if (!message) errors.message = 'Message is required';
		else if (message.length < 10) errors.message = 'Message must be at least 10 characters';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, name, email, subject, message });
		}

		const result = await submitFormStub('contact_submissions', { name, email, subject, message });
		if (!result.ok) {
			return fail(500, { errors: { form: result.message }, name, email, subject, message });
		}

		return { success: true, message: result.message };
	}
};
