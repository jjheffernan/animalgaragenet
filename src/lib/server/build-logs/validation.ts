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

	if (requireComplete || fields.title) {
		if (!fields.title.trim()) errors.title = 'Build title is required';
	}
	if (requireComplete || fields.year) {
		if (!fields.year.trim()) errors.year = 'Year is required';
		else if (!/^\d{4}$/.test(fields.year.trim())) errors.year = 'Enter a valid 4-digit year';
	}
	if (requireComplete || fields.make) {
		if (!fields.make.trim()) errors.make = 'Make is required';
	}
	if (requireComplete || fields.model) {
		if (!fields.model.trim()) errors.model = 'Model is required';
	}
	if (requireComplete || fields.description) {
		if (!fields.description.trim()) errors.description = 'Description is required';
		else if (requireComplete && fields.description.trim().length < 20) {
			errors.description = 'Description must be at least 20 characters';
		}
	}
	if (requireComplete || fields.modList) {
		if (!fields.modList.trim()) errors.modList = 'Mod list is required';
	}

	return errors;
}
