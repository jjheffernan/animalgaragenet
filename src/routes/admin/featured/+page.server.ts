import { fail } from '@sveltejs/kit';
import {
	getFeaturedSection,
	listFeaturedSections,
	upsertFeaturedSection
} from '$lib/server/featured-sections/repository';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const sections = await listFeaturedSections();
	const [hero, ugc, campaign] = await Promise.all([
		sections.find((s) => s.sectionKey === 'hero') ?? getFeaturedSection('hero'),
		sections.find((s) => s.sectionKey === 'ugc') ?? getFeaturedSection('ugc'),
		sections.find((s) => s.sectionKey === 'campaign') ?? getFeaturedSection('campaign')
	]);
	return { sections, hero, ugc, campaign };
};

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

		return { saved: true, sectionKey: 'hero' };
	},

	saveUgc: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get('title') ?? '').trim();
		const subtitle = String(data.get('subtitle') ?? '').trim();
		const active = data.get('active') === 'on';

		if (!title) {
			return fail(400, { error: 'UGC section title is required' });
		}

		const section = await upsertFeaturedSection('ugc', { title, subtitle }, active);
		if (!section) {
			return fail(500, { error: 'Could not save UGC section' });
		}

		return { saved: true, sectionKey: 'ugc' };
	},

	saveCampaign: async ({ request }) => {
		const data = await request.formData();
		const title = String(data.get('title') ?? '').trim();
		const subtitle = String(data.get('subtitle') ?? '').trim();
		const badgeLabel = String(data.get('badgeLabel') ?? '').trim();
		const endDate = String(data.get('endDate') ?? '').trim();
		const active = data.get('active') === 'on';

		if (active && !endDate) {
			return fail(400, { error: 'End date is required when campaign block is active' });
		}

		const section = await upsertFeaturedSection(
			'campaign',
			{ title, subtitle, badgeLabel: badgeLabel || 'Drop Incoming', endDate },
			active
		);
		if (!section) {
			return fail(500, { error: 'Could not save campaign section' });
		}

		return { saved: true, sectionKey: 'campaign' };
	}
};
