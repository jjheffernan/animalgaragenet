export interface MockPromoCode {
	code: string;
	label: string;
	/** Percent off cart subtotal (mock localStorage cart only). */
	percentOff: number;
}

const CODES: Record<string, MockPromoCode> = {
	GARAGE10: { code: 'GARAGE10', label: '10% off your order', percentOff: 10 },
	PITLANE15: { code: 'PITLANE15', label: '15% off Pit Lane members', percentOff: 15 },
	WELCOME5: { code: 'WELCOME5', label: '$5 welcome credit (mock)', percentOff: 0 }
};

export function normalizePromoCode(raw: string): string {
	return raw.trim().toUpperCase();
}

export function findMockPromoCode(raw: string): MockPromoCode | null {
	const key = normalizePromoCode(raw);
	return CODES[key] ?? null;
}

export const MOCK_PROMO_CODES = Object.values(CODES);
