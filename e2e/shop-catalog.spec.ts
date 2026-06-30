import { expect, test } from '@playwright/test';
import { dismissCookieBanner } from './helpers';

test.describe('shop catalog', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/shop');
		await dismissCookieBanner(page);
	});

	test('shop page loads category ribbon and product grid', async ({ page }) => {
		await expect(page.getByRole('heading', { level: 1, name: 'Shop' })).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Shop categories' })).toBeVisible();
		await expect(page.locator('a[href*="/shop/"]').first()).toBeVisible();
	});

	test('category filter pill updates listing', async ({ page }) => {
		const ribbon = page.getByRole('navigation', { name: 'Shop categories' });
		await ribbon.getByRole('link', { name: 'TEES', exact: true }).click();
		await expect(page).toHaveURL(/category=tees/);
		await expect(page.getByRole('heading', { level: 2, name: 'TEES' })).toBeVisible();
	});

	test('product card navigates to product detail', async ({ page }) => {
		const productLink = page.locator('a[href*="/shop/"]').first();
		const href = await productLink.getAttribute('href');
		test.skip(!href || href === '/shop', 'No product links on shop page');

		await productLink.click();
		await expect(page).toHaveURL(/\/shop\/.+/);
		await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
	});
});
