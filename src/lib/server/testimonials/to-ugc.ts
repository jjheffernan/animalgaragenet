import type { UGCItem } from '$lib/types/domain';
import type { Testimonial } from '$lib/types/testimonial';

/** Map approved testimonials to UGC wall tiles until review photo URLs exist. */
export function testimonialsToUgcItems(testimonials: Testimonial[]): UGCItem[] {
	return testimonials.map((t) => ({
		id: t.id,
		image: `https://picsum.photos/seed/ag-t-${t.id}/400/400`,
		caption: t.title || t.body.slice(0, 120),
		handle: `@${t.displayName.replace(/\s+/g, '').toLowerCase()}`
	}));
}
