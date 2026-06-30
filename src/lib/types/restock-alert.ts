export interface RestockAlert {
	id: string;
	email: string;
	productId: string;
	productSlug: string | null;
	productName: string | null;
	variantId: string | null;
	userId: string | null;
	createdAt: string;
	notifiedAt: string | null;
}

export interface RestockAlertInput {
	email: string;
	productId: string;
	productSlug?: string;
	productName?: string;
	variantId?: string;
	userId?: string | null;
}
