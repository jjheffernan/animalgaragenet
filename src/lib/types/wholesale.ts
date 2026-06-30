export type WholesaleInquiryStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface WholesaleInquiry {
	id: string;
	businessName: string;
	contactName: string;
	email: string;
	phone: string | null;
	website: string | null;
	message: string;
	status: WholesaleInquiryStatus;
	createdAt: string;
}

export interface WholesaleInquiryInput {
	businessName: string;
	contactName: string;
	email: string;
	phone?: string;
	website?: string;
	message: string;
}
