import { describe, expect, it } from 'vitest';
import { validateTestimonialFields, type TestimonialFields } from './validation';

const emptyFields: TestimonialFields = {
	displayName: '',
	vehicleSummary: '',
	rating: '',
	title: '',
	body: ''
};

const validFields: TestimonialFields = {
	displayName: 'Alex M.',
	vehicleSummary: '2019 WRX track build',
	rating: '5',
	title: 'Best shop experience',
	body: 'The team helped me dial in my suspension setup and the parts arrived fast. Highly recommend for anyone building a track car.'
};

describe('validateTestimonialFields', () => {
	it('requires core fields', () => {
		const errors = validateTestimonialFields(emptyFields);

		expect(errors).toMatchObject({
			displayName: expect.any(String),
			rating: expect.any(String),
			title: expect.any(String),
			body: expect.any(String)
		});
	});

	it('rejects invalid rating', () => {
		expect(validateTestimonialFields({ ...validFields, rating: '0' }).rating).toMatch(/1 to 5/i);
		expect(validateTestimonialFields({ ...validFields, rating: '6' }).rating).toMatch(/1 to 5/i);
	});

	it('enforces minimum body length', () => {
		const errors = validateTestimonialFields({ ...validFields, body: 'Too short' });
		expect(errors.body).toMatch(/at least 20 characters/i);
	});

	it('accepts a valid payload', () => {
		expect(validateTestimonialFields(validFields)).toEqual({});
	});
});
