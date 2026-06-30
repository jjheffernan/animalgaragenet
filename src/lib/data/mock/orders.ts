export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface MockOrderLine {
	productName: string;
	variantName?: string;
	quantity: number;
	unitPrice: number;
}

export interface MockOrder {
	id: string;
	orderNumber: string;
	date: string;
	status: OrderStatus;
	total: number;
	trackingNumber?: string;
	lines: MockOrderLine[];
}

export const mockOrders: MockOrder[] = [
	{
		id: 'ord-1042',
		orderNumber: 'AG-1042',
		date: '2026-06-18',
		status: 'delivered',
		total: 89.98,
		trackingNumber: '1Z999AA10123456784',
		lines: [
			{ productName: 'Garage Flag Tee', variantName: 'L / Black', quantity: 1, unitPrice: 34.99 },
			{ productName: 'Pit Crew Cap', variantName: 'One Size', quantity: 1, unitPrice: 29.99 },
			{ productName: 'Redline Sticker Pack', quantity: 1, unitPrice: 24.99 }
		]
	},
	{
		id: 'ord-1087',
		orderNumber: 'AG-1087',
		date: '2026-06-25',
		status: 'shipped',
		total: 1249.0,
		trackingNumber: '9400111899223344556677',
		lines: [
			{ productName: 'Enkei RPF1 18×9.5 +35', variantName: 'Matte Bronze', quantity: 4, unitPrice: 299.0 },
			{ productName: 'BC Racing BR Coilovers', variantName: 'FK8 Type R', quantity: 1, unitPrice: 1299.0 }
		]
	},
	{
		id: 'ord-1091',
		orderNumber: 'AG-1091',
		date: '2026-06-28',
		status: 'processing',
		total: 54.99,
		lines: [{ productName: 'Redline Hoodie', variantName: 'M / Charcoal', quantity: 1, unitPrice: 54.99 }]
	}
];

export function getOrdersForAccount(): MockOrder[] {
	return mockOrders;
}
