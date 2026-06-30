import { LIMITS } from '$lib/server/validation/limits';

export interface TestimonialFields {
	displayName: string;
	vehicleSummary: string;
	rating: string;
	title: string;
	body: string;
}

export function validateTestimonialFields(fields: TestimonialFields): Record<string, string> {
	const errors: Record<string, string> = {};
	const { displayName, vehicleSummary, title, body } = LIMITS.testimonial;

	if (!fields.displayName.trim()) {
		errors.displayName = 'Display name is required';
	} else if (fields.displayName.trim().length > displayName) {
		errors.displayName = `Display name must be ${displayName} characters or less`;
	}

	if (fields.vehicleSummary.trim().length > vehicleSummary) {
		errors.vehicleSummary = `Vehicle / build summary must be ${vehicleSummary} characters or less`;
	}

	const rating = Number.parseInt(fields.rating, 10);
	if (!fields.rating.trim()) {
		errors.rating = 'Rating is required';
	} else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		errors.rating = 'Select a rating from 1 to 5 stars';
	}

	if (!fields.title.trim()) {
		errors.title = 'Review title is required';
	} else if (fields.title.trim().length > title) {
		errors.title = `Title must be ${title} characters or less`;
	}

	if (!fields.body.trim()) {
		errors.body = 'Review text is required';
	} else if (fields.body.trim().length < LIMITS.testimonial.bodyMin) {
		errors.body = `Review must be at least ${LIMITS.testimonial.bodyMin} characters`;
	} else if (fields.body.trim().length > body) {
		errors.body = `Review must be ${body} characters or less`;
	}

	return errors;
}
