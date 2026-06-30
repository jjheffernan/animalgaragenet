import { LIMITS } from '$lib/server/validation/limits';

export interface BuildLogFields {
	title: string;
	year: string;
	make: string;
	model: string;
	description: string;
	modList: string;
}

export function validateBuildLogFields(
	fields: BuildLogFields,
	options: { requireComplete?: boolean } = {}
): Record<string, string> {
	const errors: Record<string, string> = {};
	const { requireComplete = false } = options;
	const limits = LIMITS.buildLog;

	if (requireComplete || fields.title) {
		if (!fields.title.trim()) errors.title = 'Build title is required';
		else if (fields.title.trim().length > limits.title) {
			errors.title = `Title must be ${limits.title} characters or less`;
		}
	}
	if (requireComplete || fields.year) {
		if (!fields.year.trim()) errors.year = 'Year is required';
		else if (!/^\d{4}$/.test(fields.year.trim())) errors.year = 'Enter a valid 4-digit year';
	}
	if (requireComplete || fields.make) {
		if (!fields.make.trim()) errors.make = 'Make is required';
		else if (fields.make.trim().length > limits.make) {
			errors.make = `Make must be ${limits.make} characters or less`;
		}
	}
	if (requireComplete || fields.model) {
		if (!fields.model.trim()) errors.model = 'Model is required';
		else if (fields.model.trim().length > limits.model) {
			errors.model = `Model must be ${limits.model} characters or less`;
		}
	}
	if (requireComplete || fields.description) {
		if (!fields.description.trim()) errors.description = 'Description is required';
		else if (requireComplete && fields.description.trim().length < limits.descriptionMin) {
			errors.description = `Description must be at least ${limits.descriptionMin} characters`;
		} else if (fields.description.trim().length > limits.description) {
			errors.description = `Description must be ${limits.description} characters or less`;
		}
	}
	if (requireComplete || fields.modList) {
		if (!fields.modList.trim()) errors.modList = 'Mod list is required';
		else if (fields.modList.trim().length > limits.modList) {
			errors.modList = `Mod list must be ${limits.modList} characters or less`;
		}
	}

	return errors;
}
