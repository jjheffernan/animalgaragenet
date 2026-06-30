import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'p',
	'br',
	'ul',
	'ol',
	'li',
	'a',
	'strong',
	'em',
	'blockquote',
	'code',
	'pre',
	'img',
	'figure',
	'figcaption',
	'hr',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td'
] as const;

/** Sanitize Ghost/CMS HTML for {@html} — no jsdom (Netlify/serverless safe). */
export function sanitizeRichHtml(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: [...ALLOWED_TAGS],
		allowedAttributes: {
			a: ['href', 'title', 'target', 'rel', 'class'],
			img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
			td: ['class'],
			th: ['class'],
			tr: ['class'],
			figure: ['class'],
			figcaption: ['class'],
			code: ['class'],
			pre: ['class'],
			p: ['class'],
			h1: ['class'],
			h2: ['class'],
			h3: ['class'],
			h4: ['class'],
			h5: ['class'],
			h6: ['class'],
			blockquote: ['class'],
			table: ['class'],
			thead: ['class'],
			tbody: ['class']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowedSchemesByTag: {
			img: ['http', 'https', 'data']
		}
	});
}
