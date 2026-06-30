import { fail } from '@sveltejs/kit';
import {
	getFeaturedSection,
	listFeaturedSections,
	upsertFeaturedSection
} from '$lib/server/featured-sections/repository';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const sections = await listFeaturedSections();
	const hero = sections.find((s) => s.sectionKey === 'hero') ?? (await getFeaturedSection('hero'));
	return { sections, hero };
};

/**
 * @inspiration-scaffold: intentional — homepage CMS editor shell;
 * see docs/plans/active/inspiration-polish-coordination.md#IP-006
 */
export const actions: Actions = {
	saveHero: async ({ request }) => {
		const data = await request.formData();
		const headline = String(data.get('headline') ?? '').trim();
		const subheadline = String(data.get('subheadline') ?? '').trim();
		const image = String(data.get('image') ?? '').trim();
		const ctaLabel = String(data.get('ctaLabel') ?? '').trim();
		const ctaHref = String(data.get('ctaHref') ?? '').trim();

		if (!headline) {
			return fail(400, { error: 'Headline is required' });
		}

		const section = await upsertFeaturedSection('hero', {
			headline,
			subheadline,
			image,
			ctaLabel,
			ctaHref
		});

		if (!section) {
			return fail(500, { error: 'Could not save hero section' });
		}

		return { saved: true };
	}
};
