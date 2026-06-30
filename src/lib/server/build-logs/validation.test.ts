import { describe, expect, it } from 'vitest';
import { validateBuildLogFields, type BuildLogFields } from './validation';

const emptyFields: BuildLogFields = {
	title: '',
	year: '',
	make: '',
	model: '',
	description: '',
	modList: ''
};

const validFields: BuildLogFields = {
	title: 'Track Civic',
	year: '2018',
	make: 'Honda',
	model: 'Civic',
	description: 'Full track build with coilovers, wheels, and aero upgrades.',
	modList: 'BC coilovers, Enkei RPF1'
};

describe('validateBuildLogFields', () => {
	it('returns no errors for empty fields in draft mode', () => {
		expect(validateBuildLogFields(emptyFields)).toEqual({});
	});

	it('validates only touched fields in draft mode', () => {
		expect(validateBuildLogFields({ ...emptyFields, title: '  ' })).toEqual({
			title: 'Build title is required'
		});
		expect(validateBuildLogFields({ ...emptyFields, year: '99' })).toEqual({
			year: 'Enter a valid 4-digit year'
		});
	});

	it('requires all fields when requireComplete is true', () => {
		const errors = validateBuildLogFields(emptyFields, { requireComplete: true });

		expect(errors).toMatchObject({
			title: expect.any(String),
			year: expect.any(String),
			make: expect.any(String),
			model: expect.any(String),
			description: expect.any(String),
			modList: expect.any(String)
		});
	});

	it('enforces minimum description length on complete submit', () => {
		const errors = validateBuildLogFields(
			{ ...validFields, description: 'Too short' },
			{ requireComplete: true }
		);

		expect(errors.description).toMatch(/at least 20 characters/i);
	});

	it('accepts a complete valid payload', () => {
		expect(validateBuildLogFields(validFields, { requireComplete: true })).toEqual({});
	});
});
