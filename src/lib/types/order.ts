export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLineSnapshot {
	productName: string;
	variantName?: string;
	quantity: number;
	unitPrice: number;
}

export interface OrderSnapshot {
	id: string;
	userId: string;
	saleorOrderId: string;
	orderNumber: string;
	status: OrderStatus;
	totalCents: number;
	currency: string;
	trackingNumber: string | null;
	lines: OrderLineSnapshot[];
	orderedAt: string;
	syncedAt: string;
}
