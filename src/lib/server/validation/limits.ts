/** Shared max field lengths for server-side validation (DB + abuse). */
export const LIMITS = {
	buildLog: {
		title: 120,
		make: 60,
		model: 60,
		description: 8000,
		descriptionMin: 20,
		modList: 4000,
		email: 254
	},
	testimonial: {
		displayName: 80,
		vehicleSummary: 120,
		title: 100,
		body: 2000,
		bodyMin: 20,
		loyaltyTier: 40
	},
	contact: {
		name: 120,
		email: 254,
		subject: 200,
		message: 5000,
		messageMin: 10
	},
	wholesale: {
		businessName: 120,
		contactName: 120,
		email: 254,
		phone: 40,
		website: 200,
		message: 5000,
		messageMin: 20
	},
	promoCode: 64,
	bugReport: {
		email: 254,
		description: 4000,
		descriptionMin: 10,
		steps: 4000,
		stepsMin: 10,
		pageUrl: 2000
	}
} as const;

export function trimToMax(value: string, max: number): string {
	return value.trim().slice(0, max);
}
