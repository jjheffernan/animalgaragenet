import { describe, expect, it } from 'vitest';
import { validateBugReportPayload } from './bug-report-validation';

const validBody = {
	email: 'driver@example.com',
	category: 'website',
	description: 'The add to cart button does nothing when clicked on mobile.',
	steps: '1. Open shop on phone 2. Tap add to cart 3. Nothing happens',
	pageUrl: '/shop/hoodie'
};

describe('validateBugReportPayload', () => {
	it('accepts a complete guest payload', () => {
		const result = validateBugReportPayload(validBody);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.email).toBe('driver@example.com');
			expect(result.data.category).toBe('website');
		}
	});

	it('uses session email when guest email omitted', () => {
		const withoutEmail = { ...validBody };
		delete (withoutEmail as { email?: string }).email;
		const result = validateBugReportPayload(withoutEmail, {
			sessionEmail: 'member@example.com'
		});
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.email).toBe('member@example.com');
		}
	});

	it('rejects missing email for guests', () => {
		const withoutEmail = { ...validBody };
		delete (withoutEmail as { email?: string }).email;
		const result = validateBugReportPayload(withoutEmail);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toMatch(/email/i);
		}
	});

	it('rejects invalid email', () => {
		const result = validateBugReportPayload({ ...validBody, email: 'not-an-email' });
		expect(result.ok).toBe(false);
	});

	it('rejects invalid category', () => {
		const result = validateBugReportPayload({ ...validBody, category: 'payments' });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toMatch(/category/i);
		}
	});

	it('rejects short description', () => {
		const result = validateBugReportPayload({ ...validBody, description: 'too short' });
		expect(result.ok).toBe(false);
	});

	it('rejects short steps', () => {
		const result = validateBugReportPayload({ ...validBody, steps: 'click' });
		expect(result.ok).toBe(false);
	});

	it('allows empty pageUrl', () => {
		const result = validateBugReportPayload({ ...validBody, pageUrl: '' });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data.pageUrl).toBeNull();
		}
	});
});
