export interface FeaturedSection {
	id: string;
	sectionKey: string;
	content: Record<string, unknown>;
	active: boolean;
	updatedAt: string;
}
