export interface NewsletterSubscriber {
	id: string;
	email: string;
	locale: string;
	source: string;
	subscribedAt: string;
	unsubscribedAt: string | null;
}

export interface NewsletterSignupInput {
	email: string;
	locale?: string;
	source?: string;
}
