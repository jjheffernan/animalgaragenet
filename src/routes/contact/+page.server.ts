import { fail } from '@sveltejs/kit';
import { submitFormStub } from '$lib/server/forms/submit';
import { LIMITS } from '$lib/server/validation/limits';
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
		else if (name.length > LIMITS.contact.name) {
			errors.name = `Name must be ${LIMITS.contact.name} characters or less`;
		}
		if (!email) errors.email = 'Email is required';
		else if (!validateEmail(email)) errors.email = 'Enter a valid email address';
		else if (email.length > LIMITS.contact.email) {
			errors.email = `Email must be ${LIMITS.contact.email} characters or less`;
		}
		if (!subject) errors.subject = 'Subject is required';
		else if (subject.length > LIMITS.contact.subject) {
			errors.subject = `Subject must be ${LIMITS.contact.subject} characters or less`;
		}
		if (!message) errors.message = 'Message is required';
		else if (message.length < LIMITS.contact.messageMin) {
			errors.message = `Message must be at least ${LIMITS.contact.messageMin} characters`;
		} else if (message.length > LIMITS.contact.message) {
			errors.message = `Message must be ${LIMITS.contact.message} characters or less`;
		}

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
