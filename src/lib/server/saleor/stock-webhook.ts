import {
	listPendingRestockAlerts,
	markRestockAlertsNotified
} from '$lib/server/restock/repository';
import type { RestockAlert } from '$lib/types/restock-alert';

export interface ParsedStockWebhook {
	productId: string;
	productSlug: string | null;
	productName: string | null;
	variantId: string | null;
	quantity: number;
}

type NotifyResult =
	| { ok: true; notified: number; productId: string }
	| { ok: true; skipped: true; reason: string }
	| { ok: false; reason: string };

const STOCK_EVENTS = new Set([
	'PRODUCT_VARIANT_BACK_IN_STOCK',
	'PRODUCT_VARIANT_STOCK_UPDATED'
]);

export function isStockRestockEvent(event: string): boolean {
	return STOCK_EVENTS.has(event.toUpperCase());
}

function readQuantity(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function extractVariantRecord(payload: unknown): Record<string, unknown> | null {
	if (!payload || typeof payload !== 'object') return null;
	const root = payload as Record<string, unknown>;

	if (root.productVariant && typeof root.productVariant === 'object') {
		return root.productVariant as Record<string, unknown>;
	}

	if (typeof root.id === 'string' && (root.product || root.quantity != null)) {
		return root;
	}

	return null;
}

/** Parse Saleor stock webhook payload (variant back-in-stock / stock updated). */
export function extractStockWebhookFromPayload(payload: unknown): ParsedStockWebhook | null {
	const variant = extractVariantRecord(payload);
	if (!variant) return null;

	const product =
		variant.product && typeof variant.product === 'object'
			? (variant.product as Record<string, unknown>)
			: null;

	const productId = String(product?.id ?? variant.productId ?? '').trim();
	if (!productId) return null;

	const quantity =
		readQuantity(variant.quantity) ??
		readQuantity(variant.stocks) ??
		readQuantity((variant.stocks as Record<string, unknown> | undefined)?.quantity) ??
		0;

	return {
		productId,
		productSlug: product?.slug ? String(product.slug) : null,
		productName: product?.name ? String(product.name) : null,
		variantId: variant.id ? String(variant.id) : null,
		quantity
	};
}

// ponytail: log-only notify — wire transactional email when provider is chosen
function dispatchRestockNotifications(alerts: RestockAlert[]): void {
	for (const alert of alerts) {
		console.info(
			`restock_alert pending dispatch: ${alert.email} product=${alert.productId} slug=${alert.productSlug ?? '—'}`
		);
	}
}

export async function processStockRestockPayload(payload: unknown): Promise<NotifyResult> {
	const parsed = extractStockWebhookFromPayload(payload);
	if (!parsed) {
		return { ok: false, reason: 'unrecognized_stock_payload' };
	}

	if (parsed.quantity <= 0) {
		return { ok: true, skipped: true, reason: 'not_in_stock' };
	}

	const pending = await listPendingRestockAlerts(parsed.productId);
	if (pending.length === 0) {
		return { ok: true, skipped: true, reason: 'no_pending_alerts' };
	}

	dispatchRestockNotifications(pending);
	const ids = pending.map((alert) => alert.id);
	const marked = await markRestockAlertsNotified(ids);
	if (!marked) {
		return { ok: false, reason: 'mark_notified_failed' };
	}

	return { ok: true, notified: pending.length, productId: parsed.productId };
}
