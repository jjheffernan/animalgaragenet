export interface FeaturedSection {
	id: string;
	sectionKey: string;
	content: Record<string, unknown>;
	active: boolean;
	updatedAt: string;
}

/** Homepage CMS section keys loaded by `+page.server.ts`. */
export const HOMEPAGE_SECTION_KEYS = ['hero', 'ugc', 'campaign'] as const;
export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

export interface UgcSectionContent {
	title: string;
	subtitle: string;
}

export interface CampaignSectionContent {
	title: string;
	subtitle: string;
	badgeLabel: string;
	/** ISO date string for CountdownTimer */
	endDate: string;
}
