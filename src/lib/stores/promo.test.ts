import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { isPromoDismissed, setPromoDismissed } = vi.hoisted(() => ({
	isPromoDismissed: vi.fn(() => false),
	setPromoDismissed: vi.fn()
}));

vi.mock('$lib/cookies/client', () => ({
	isPromoDismissed,
	setPromoDismissed
}));

import { promo } from './promo.svelte';

describe('promo store', () => {
	beforeEach(() => {
		Object.defineProperty(globalThis, 'window', {
			value: {},
			configurable: true
		});
		vi.mocked(isPromoDismissed).mockReturnValue(false);
		vi.mocked(setPromoDismissed).mockClear();
		(promo as { dismissed: boolean; visible: boolean }).dismissed = false;
		(promo as { initialized?: boolean }).initialized = false;
	});

	afterEach(() => {
		Reflect.deleteProperty(globalThis, 'window');
		vi.restoreAllMocks();
	});

	it('starts visible until dismissed', () => {
		promo.init();
		expect(promo.visible).toBe(true);
	});

	it('reads dismissed state from cookie on init', () => {
		vi.mocked(isPromoDismissed).mockReturnValue(true);

		promo.init();

		expect(promo.dismissed).toBe(true);
		expect(promo.visible).toBe(false);
	});

	it('dismisses and persists to cookie', () => {
		promo.dismiss();

		expect(promo.dismissed).toBe(true);
		expect(promo.visible).toBe(false);
		expect(setPromoDismissed).toHaveBeenCalledOnce();
	});
});
