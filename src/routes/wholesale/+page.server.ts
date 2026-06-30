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
		const businessName = String(data.get('businessName') ?? '').trim();
		const contactName = String(data.get('contactName') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const website = String(data.get('website') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();

		const errors: Record<string, string> = {};
		if (!businessName) errors.businessName = 'Business name is required';
		else if (businessName.length > LIMITS.wholesale.businessName) {
			errors.businessName = `Business name must be ${LIMITS.wholesale.businessName} characters or less`;
		}
		if (!contactName) errors.contactName = 'Contact name is required';
		else if (contactName.length > LIMITS.wholesale.contactName) {
			errors.contactName = `Contact name must be ${LIMITS.wholesale.contactName} characters or less`;
		}
		if (!email) errors.email = 'Email is required';
		else if (!validateEmail(email)) errors.email = 'Enter a valid email address';
		else if (email.length > LIMITS.wholesale.email) {
			errors.email = `Email must be ${LIMITS.wholesale.email} characters or less`;
		}
		if (phone && phone.length > LIMITS.wholesale.phone) {
			errors.phone = `Phone must be ${LIMITS.wholesale.phone} characters or less`;
		}
		if (website && website.length > LIMITS.wholesale.website) {
			errors.website = `Website must be ${LIMITS.wholesale.website} characters or less`;
		}
		if (!message) errors.message = 'Tell us about your business';
		else if (message.length < LIMITS.wholesale.messageMin) {
			errors.message = `Please provide more detail (${LIMITS.wholesale.messageMin}+ characters)`;
		} else if (message.length > LIMITS.wholesale.message) {
			errors.message = `Message must be ${LIMITS.wholesale.message} characters or less`;
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				businessName,
				contactName,
				email,
				phone,
				website,
				message
			});
		}

		const result = await submitFormStub('wholesale_inquiries', {
			businessName,
			contactName,
			email,
			phone,
			website,
			message
		});
		if (!result.ok) {
			return fail(500, {
				errors: { form: result.message },
				businessName,
				contactName,
				email,
				phone,
				website,
				message
			});
		}

		return { success: true, message: result.message };
	}
};
