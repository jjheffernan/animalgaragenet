import type { UGCItem } from '#lib/types/domain.ts';
import type { Testimonial } from '#lib/types/testimonial.ts';

/** Map approved testimonials to UGC wall tiles; prefers linked review photos when present. */
export function testimonialsToUgcItems(testimonials: Testimonial[]): UGCItem[] {
	return testimonials.map((t) => ({
		id: t.id,
		image: t.photoUrls?.[0] ?? `https://picsum.photos/seed/ag-t-${t.id}/400/400`,
		caption: t.title || t.body.slice(0, 120),
		handle: `@${t.displayName.replace(/\s+/g, '').toLowerCase()}`
	}));
}
