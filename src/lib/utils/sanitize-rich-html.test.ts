import { describe, expect, it } from 'vitest';
import { sanitizeRichHtml } from './sanitize-rich-html';

describe('sanitizeRichHtml', () => {
	it('keeps safe article markup', () => {
		const input = '<h2>Title</h2><p>Hello <strong>world</strong></p>';
		expect(sanitizeRichHtml(input)).toBe(input);
	});

	it('strips script tags and event handlers', () => {
		const input = '<p onclick="alert(1)">Hi</p><script>alert(1)</script>';
		expect(sanitizeRichHtml(input)).toBe('<p>Hi</p>');
	});

	it('allows links and images with safe attrs', () => {
		const input =
			'<a href="https://example.com" target="_blank" rel="noopener">Go</a><img src="https://cdn.example/x.jpg" alt="x" loading="lazy" />';
		expect(sanitizeRichHtml(input)).toContain('href="https://example.com"');
		expect(sanitizeRichHtml(input)).toContain('loading="lazy"');
	});
});
