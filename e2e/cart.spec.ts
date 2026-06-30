import { expect, test } from '@playwright/test';
import { addProductToCartFromDetail, dismissCookieBanner, openCartDrawer } from './helpers';

test.describe('cart', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await dismissCookieBanner(page);
	});

	test('add to cart from product detail opens drawer with line item', async ({ page }) => {
		const cart = await addProductToCartFromDetail(page);
		await expect(cart.getByRole('link', { name: 'Garage Flag Tee' })).toBeVisible();
	});

	test('cart page shows added mock line item', async ({ page }) => {
		await addProductToCartFromDetail(page);
		await page.getByLabel('Shopping cart').getByRole('button', { name: 'Close cart' }).click();
		await page.waitForFunction(() => {
			const raw = localStorage.getItem('ag-cart');
			return Boolean(raw && JSON.parse(raw).length > 0);
		});

		await page.goto('/cart');
		await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible({ timeout: 10_000 });
		await expect(page.getByRole('link', { name: 'Garage Flag Tee' })).toBeVisible({ timeout: 10_000 });
	});

	test('quantity controls update line count in drawer', async ({ page }) => {
		const cart = await addProductToCartFromDetail(page);
		const qty = cart.locator('span.text-sm.text-white').first();
		await expect(qty).toHaveText('1');

		await cart.getByRole('button', { name: '+', exact: true }).click();
		await expect(qty).toHaveText('2');

		await cart.getByRole('button', { name: '−', exact: true }).click();
		await expect(qty).toHaveText('1');
	});

	test('header cart button opens drawer', async ({ page }) => {
		await addProductToCartFromDetail(page);
		await page.getByLabel('Shopping cart').getByRole('button', { name: 'Close cart' }).click();

		const cart = await openCartDrawer(page);
		await expect(cart.getByRole('link', { name: 'Garage Flag Tee' })).toBeVisible();
	});
});
