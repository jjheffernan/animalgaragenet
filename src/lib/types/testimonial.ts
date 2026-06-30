export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
	id: string;
	userId: string;
	displayName: string;
	vehicleSummary: string | null;
	rating: number;
	title: string;
	body: string;
	status: TestimonialStatus;
	loyaltyTier: string | null;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
	approvedAt: string | null;
	/** Resolved read URLs for linked review photos (approved/public views only). */
	photoUrls?: string[];
}

export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
	pending: 'Pending review',
	approved: 'Published',
	rejected: 'Rejected'
};
