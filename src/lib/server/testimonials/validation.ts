export interface TestimonialFields {
	displayName: string;
	vehicleSummary: string;
	rating: string;
	title: string;
	body: string;
}

export function validateTestimonialFields(fields: TestimonialFields): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!fields.displayName.trim()) {
		errors.displayName = 'Display name is required';
	} else if (fields.displayName.trim().length > 80) {
		errors.displayName = 'Display name must be 80 characters or less';
	}

	if (fields.vehicleSummary.trim().length > 120) {
		errors.vehicleSummary = 'Vehicle / build summary must be 120 characters or less';
	}

	const rating = Number.parseInt(fields.rating, 10);
	if (!fields.rating.trim()) {
		errors.rating = 'Rating is required';
	} else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		errors.rating = 'Select a rating from 1 to 5 stars';
	}

	if (!fields.title.trim()) {
		errors.title = 'Review title is required';
	} else if (fields.title.trim().length > 100) {
		errors.title = 'Title must be 100 characters or less';
	}

	if (!fields.body.trim()) {
		errors.body = 'Review text is required';
	} else if (fields.body.trim().length < 20) {
		errors.body = 'Review must be at least 20 characters';
	} else if (fields.body.trim().length > 2000) {
		errors.body = 'Review must be 2000 characters or less';
	}

	return errors;
}
