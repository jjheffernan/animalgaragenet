import { config } from '$lib/config/env';

export const SITE_NAME = 'Animal Garage';

export const DEFAULT_SITE_DESCRIPTION =
	'Animal Garage — automotive brand merchandising, media, and culture.';

export const DEFAULT_OG_IMAGE_PATH = '/logo.svg';

export function absoluteSiteUrl(path = ''): string {
	const base = config.siteUrl.replace(/\/$/, '');
	if (!path) return base;
	return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

export function defaultOgImageUrl(): string {
	return absoluteSiteUrl(DEFAULT_OG_IMAGE_PATH);
}

/** Plain-text excerpt for meta descriptions (strips HTML, caps length). */
export function metaDescriptionFromText(text: string, maxLen = 160): string {
	const plain = text
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	if (plain.length <= maxLen) return plain;
	return `${plain.slice(0, maxLen - 1).trimEnd()}…`;
}
