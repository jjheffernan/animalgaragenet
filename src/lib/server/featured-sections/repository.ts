import { createAdminClient } from '$lib/server/supabase/admin';
import { trimToMax } from '$lib/server/validation/limits';
import type { FeaturedSection } from '$lib/types/featured-section';
import { getActiveCampaign } from '$lib/data/mock/campaigns';

const mockSections = new Map<string, FeaturedSection>();

const STATIC_HERO_FALLBACK = {
	headline: 'Garage Culture Delivered',
	subheadline:
		'Merch, media, and the raw energy of the shop floor — Animal Garage is your automotive brand touchpoint.',
	image: 'https://picsum.photos/seed/aghero/1920/1080'
} as const;

function rowToSection(row: Record<string, unknown>): FeaturedSection {
	return {
		id: String(row.id),
		sectionKey: String(row.section_key),
		content: (row.content as Record<string, unknown>) ?? {},
		active: Boolean(row.active),
		updatedAt: String(row.updated_at)
	};
}

function mockHeroSection(): FeaturedSection {
	const campaign = getActiveCampaign();
	return {
		id: 'mock-hero',
		sectionKey: 'hero',
		content: {
			headline: campaign?.name ?? STATIC_HERO_FALLBACK.headline,
			subheadline: campaign?.description ?? STATIC_HERO_FALLBACK.subheadline,
			image: campaign?.heroImage ?? STATIC_HERO_FALLBACK.image,
			ctaLabel: 'Shop Now',
			ctaHref: '/shop'
		},
		active: true,
		updatedAt: new Date().toISOString()
	};
}

/** Default hero when CMS row or active campaign is unavailable */
export function getDefaultHeroSection(): FeaturedSection {
	return mockHeroSection();
}

// @inspiration-scaffold: intentional — homepage CMS; see docs/plans/active/inspiration-polish-tracker.md#IP-006
export async function getFeaturedSection(sectionKey: string): Promise<FeaturedSection | null> {
	const admin = createAdminClient();
	if (!admin) {
		if (!mockSections.has(sectionKey) && sectionKey === 'hero') {
			mockSections.set('hero', mockHeroSection());
		}
		return mockSections.get(sectionKey) ?? null;
	}

	const { data, error } = await admin
		.from('featured_sections')
		.select('*')
		.eq('section_key', sectionKey)
		.eq('active', true)
		.maybeSingle();

	if (error || !data) return sectionKey === 'hero' ? mockHeroSection() : null;
	return rowToSection(data);
}

// @inspiration-scaffold: intentional — admin featured editor load
export async function listFeaturedSections(): Promise<FeaturedSection[]> {
	const admin = createAdminClient();
	if (!admin) {
		if (!mockSections.has('hero')) mockSections.set('hero', mockHeroSection());
		return [...mockSections.values()].sort((a, b) => a.sectionKey.localeCompare(b.sectionKey));
	}

	const { data, error } = await admin
		.from('featured_sections')
		.select('*')
		.order('section_key', { ascending: true });

	if (error || !data) return [];
	return data.map(rowToSection);
}

export async function upsertFeaturedSection(
	sectionKey: string,
	content: Record<string, unknown>,
	active = true
): Promise<FeaturedSection | null> {
	const key = trimToMax(sectionKey, 80);
	const admin = createAdminClient();
	if (!admin) {
		const section: FeaturedSection = {
			id: crypto.randomUUID(),
			sectionKey: key,
			content,
			active,
			updatedAt: new Date().toISOString()
		};
		mockSections.set(key, section);
		return section;
	}

	const { data, error } = await admin
		.from('featured_sections')
		.upsert({ section_key: key, content, active }, { onConflict: 'section_key' })
		.select('*')
		.single();

	if (error || !data) {
		console.error('featured_sections upsert failed:', error?.message);
		return null;
	}
	return rowToSection(data);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockSections.clear();
}
