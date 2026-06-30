import { resolveUserIdByEmail } from '$lib/server/supabase/admin-users';
import { upsertOrderSnapshot } from '$lib/server/orders/snapshots';
import type { OrderLineSnapshot, OrderStatus } from '$lib/types/order';

export interface ParsedSaleorOrder {
	saleorOrderId: string;
	orderNumber: string;
	status: OrderStatus;
	totalCents: number;
	currency: string;
	trackingNumber: string | null;
	lines: OrderLineSnapshot[];
	orderedAt: string;
	userEmail: string | null;
}

type MirrorResult =
	| { ok: true; orderNumber: string; skipped?: false }
	| { ok: true; skipped: true; reason: string }
	| { ok: false; reason: string };

function readAmount(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function readMoney(value: unknown): { amount: number; currency: string } | null {
	if (!value || typeof value !== 'object') return null;
	const record = value as Record<string, unknown>;
	const gross = record.gross;
	if (gross && typeof gross === 'object') {
		const amount = readAmount((gross as Record<string, unknown>).amount);
		const currency = String((gross as Record<string, unknown>).currency ?? 'USD');
		if (amount != null) return { amount, currency };
	}
	const amount = readAmount(record.amount);
	if (amount == null) return null;
	return { amount, currency: String(record.currency ?? 'USD') };
}

function readLines(value: unknown): OrderLineSnapshot[] {
	if (!Array.isArray(value)) return [];

	return value
		.map((line) => {
			if (!line || typeof line !== 'object') return null;
			const record = line as Record<string, unknown>;
			const quantity = Number(record.quantity ?? 0);
			const productName = String(record.productName ?? record.product_name ?? '').trim();
			if (!productName || !Number.isFinite(quantity) || quantity <= 0) return null;

			const unitPrice =
				readAmount(record.unitPrice) ??
				readMoney(record.unitPrice)?.amount ??
				readMoney(record.unit_price)?.amount ??
				0;

			const variantNameRaw = record.variantName ?? record.variant_name;
			return {
				productName,
				variantName: variantNameRaw ? String(variantNameRaw) : undefined,
				quantity,
				unitPrice
			};
		})
		.filter((line): line is OrderLineSnapshot => line != null);
}

function readTrackingNumber(fulfillments: unknown): string | null {
	if (!Array.isArray(fulfillments)) return null;
	for (const fulfillment of fulfillments) {
		if (!fulfillment || typeof fulfillment !== 'object') continue;
		const tracking = (fulfillment as Record<string, unknown>).trackingNumber;
		if (typeof tracking === 'string' && tracking.trim()) return tracking.trim();
	}
	return null;
}

export function mapSaleorOrderStatus(saleorStatus: string, fulfillments?: unknown): OrderStatus {
	const normalized = saleorStatus.toUpperCase();
	if (normalized === 'CANCELED' || normalized === 'CANCELLED') return 'cancelled';

	const tracking = readTrackingNumber(fulfillments);
	if (normalized === 'FULFILLED') return tracking ? 'shipped' : 'delivered';
	if (normalized === 'PARTIALLY_FULFILLED') return tracking ? 'shipped' : 'processing';
	return 'processing';
}

function formatOrderNumber(number: unknown): string {
	const raw = String(number ?? '').trim();
	if (!raw) return 'AG-UNKNOWN';
	return raw.startsWith('AG-') ? raw : `AG-${raw}`;
}

function extractOrderRecord(payload: unknown): Record<string, unknown> | null {
	if (!payload || typeof payload !== 'object') return null;
	const root = payload as Record<string, unknown>;

	if (root.order && typeof root.order === 'object') {
		return root.order as Record<string, unknown>;
	}

	if (typeof root.id === 'string' && (root.number != null || root.orderNumber != null)) {
		return root;
	}

	return null;
}

/** Parse Saleor ORDER_CREATED / fulfillment webhook subscription payload. */
export function extractSaleorOrderFromPayload(payload: unknown): ParsedSaleorOrder | null {
	const order = extractOrderRecord(payload);
	if (!order) return null;

	const saleorOrderId = String(order.id ?? '').trim();
	if (!saleorOrderId) return null;

	const total = readMoney(order.total) ?? readMoney(order.totalPrice);
	const totalCents = Math.max(0, Math.round((total?.amount ?? 0) * 100));
	const currency = total?.currency ?? 'USD';
	const fulfillments = order.fulfillments;
	const status = mapSaleorOrderStatus(String(order.status ?? 'UNFULFILLED'), fulfillments);
	const orderedAt = String(order.created ?? order.createdAt ?? new Date().toISOString());
	const userEmailRaw = order.userEmail ?? order.user_email ?? order.email;
	const userEmail =
		typeof userEmailRaw === 'string' && userEmailRaw.trim() ? userEmailRaw.trim() : null;

	return {
		saleorOrderId,
		orderNumber: formatOrderNumber(order.number ?? order.orderNumber),
		status,
		totalCents,
		currency,
		trackingNumber: readTrackingNumber(fulfillments),
		lines: readLines(order.lines),
		orderedAt,
		userEmail
	};
}

export async function resolveOrderUserId(email: string | null): Promise<string | null> {
	return resolveUserIdByEmail(email);
}

const ORDER_MIRROR_EVENTS = new Set([
	'ORDER_CREATED',
	'ORDER_FULFILLED',
	'ORDER_UPDATED',
	'FULFILLMENT_CREATED',
	'FULFILLMENT_UPDATED'
]);

export function isOrderMirrorEvent(event: string): boolean {
	return ORDER_MIRROR_EVENTS.has(event.toUpperCase());
}

export async function mirrorSaleorOrderPayload(payload: unknown): Promise<MirrorResult> {
	const parsed = extractSaleorOrderFromPayload(payload);
	if (!parsed) {
		return { ok: false, reason: 'unrecognized_order_payload' };
	}

	const userId = await resolveOrderUserId(parsed.userEmail);
	if (!userId) {
		return { ok: true, skipped: true, reason: 'no_matching_user' };
	}

	const saved = await upsertOrderSnapshot({
		userId,
		saleorOrderId: parsed.saleorOrderId,
		orderNumber: parsed.orderNumber,
		status: parsed.status,
		totalCents: parsed.totalCents,
		currency: parsed.currency,
		trackingNumber: parsed.trackingNumber,
		lines: parsed.lines,
		orderedAt: parsed.orderedAt
	});

	if (!saved) {
		return { ok: false, reason: 'upsert_failed' };
	}

	return { ok: true, orderNumber: saved.orderNumber };
}
