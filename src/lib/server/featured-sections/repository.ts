import { createAdminClient } from '$lib/server/supabase/admin';
import { trimToMax } from '$lib/server/validation/limits';
import type {
	CampaignSectionContent,
	FeaturedSection,
	HomepageSectionKey,
	UgcSectionContent
} from '$lib/types/featured-section';
import { HOMEPAGE_SECTION_KEYS as SECTION_KEYS } from '$lib/types/featured-section';
import { getActiveCampaign } from '$lib/data/mock/campaigns';

const mockSections = new Map<string, FeaturedSection>();

const STATIC_HERO_FALLBACK = {
	headline: 'Garage Culture Delivered',
	subheadline:
		'Merch, media, and the raw energy of the shop floor — Animal Garage is your automotive brand touchpoint.',
	image: 'https://picsum.photos/seed/aghero/1920/1080'
} as const;

const STATIC_UGC_FALLBACK: UgcSectionContent = {
	title: 'Community Garage',
	subtitle: 'Real builds from the squad.'
};

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

function mockUgcSection(): FeaturedSection {
	return {
		id: 'mock-ugc',
		sectionKey: 'ugc',
		content: { ...STATIC_UGC_FALLBACK },
		active: true,
		updatedAt: new Date().toISOString()
	};
}

function mockCampaignSection(): FeaturedSection {
	const campaign = getActiveCampaign();
	return {
		id: 'mock-campaign',
		sectionKey: 'campaign',
		content: {
			title: campaign?.name ?? '',
			subtitle: campaign?.description ?? '',
			badgeLabel: 'Drop Incoming',
			endDate: campaign?.availableFrom ?? ''
		} satisfies CampaignSectionContent,
		active: Boolean(campaign),
		updatedAt: new Date().toISOString()
	};
}

const DEFAULT_SECTION_FACTORIES: Record<string, () => FeaturedSection> = {
	hero: mockHeroSection,
	ugc: mockUgcSection,
	campaign: mockCampaignSection
};

function ensureMockSection(sectionKey: string): FeaturedSection | null {
	if (mockSections.has(sectionKey)) {
		return mockSections.get(sectionKey) ?? null;
	}
	const factory = DEFAULT_SECTION_FACTORIES[sectionKey];
	if (!factory) return null;
	const section = factory();
	mockSections.set(sectionKey, section);
	return section;
}

function fallbackSection(sectionKey: string): FeaturedSection | null {
	return DEFAULT_SECTION_FACTORIES[sectionKey]?.() ?? null;
}

/** Default hero when CMS row or active campaign is unavailable */
export function getDefaultHeroSection(): FeaturedSection {
	return mockHeroSection();
}

export function getDefaultUgcSection(): FeaturedSection {
	return mockUgcSection();
}

// @inspiration-scaffold: intentional — homepage CMS; see docs/plans/active/inspiration-polish-tracker.md#IP-006
export async function getFeaturedSection(sectionKey: string): Promise<FeaturedSection | null> {
	const admin = createAdminClient();
	if (!admin) {
		return ensureMockSection(sectionKey);
	}

	const { data, error } = await admin
		.from('featured_sections')
		.select('*')
		.eq('section_key', sectionKey)
		.eq('active', true)
		.maybeSingle();

	if (error || !data) return fallbackSection(sectionKey);
	return rowToSection(data);
}

/** Load all homepage section keys in one round-trip (hero always present). */
export async function getHomepageFeaturedSections(): Promise<
	Record<HomepageSectionKey, FeaturedSection>
> {
	const admin = createAdminClient();
	if (!admin) {
		const entries = await Promise.all(
			SECTION_KEYS.map(async (key) => [key, (await getFeaturedSection(key))!] as const)
		);
		return Object.fromEntries(entries) as Record<HomepageSectionKey, FeaturedSection>;
	}

	const { data, error } = await admin
		.from('featured_sections')
		.select('*')
		.in('section_key', [...SECTION_KEYS])
		.eq('active', true);

	const byKey = new Map<string, FeaturedSection>();
	if (!error && data) {
		for (const row of data) {
			const section = rowToSection(row);
			byKey.set(section.sectionKey, section);
		}
	}

	return {
		hero: byKey.get('hero') ?? getDefaultHeroSection(),
		ugc: byKey.get('ugc') ?? getDefaultUgcSection(),
		campaign: byKey.get('campaign') ?? mockCampaignSection()
	};
}

// @inspiration-scaffold: intentional — admin featured editor load
export async function listFeaturedSections(): Promise<FeaturedSection[]> {
	const admin = createAdminClient();
	if (!admin) {
		for (const key of SECTION_KEYS) {
			ensureMockSection(key);
		}
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
