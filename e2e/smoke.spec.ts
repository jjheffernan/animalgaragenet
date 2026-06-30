import { expect, test } from '@playwright/test';

async function dismissCookieBanner(page: import('@playwright/test').Page) {
	const accept = page.getByRole('button', { name: 'Accept' });
	if (await accept.isVisible()) {
		await accept.click();
	}
}

test.describe('smoke', () => {
	test('homepage loads with main navigation', async ({ page }) => {
		await page.goto('/');
		await dismissCookieBanner(page);
		await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Shop', exact: true })).toBeVisible();
	});

	test('shop page loads products', async ({ page }) => {
		await page.goto('/shop');
		await dismissCookieBanner(page);
		await expect(page.getByRole('navigation', { name: 'Shop categories' })).toBeVisible();
		await expect(page.locator('a[href*="shop/"]').first()).toBeVisible();
	});

	test('parts page loads', async ({ page }) => {
		await page.goto('/parts');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Parts' })).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Parts shopping' })).toBeVisible();
	});

	test('search modal opens from header', async ({ page }) => {
		await page.goto('/');
		await dismissCookieBanner(page);
		await page.getByRole('button', { name: 'Search' }).click();
		await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();
	});

	test('add to cart from product detail opens cart drawer', async ({ page }) => {
		await page.goto('/shop/garage-flag-tee');
		await dismissCookieBanner(page);
		await page.getByRole('button', { name: 'Add to Cart' }).click();
		const cart = page.getByLabel('Shopping cart');
		await expect(cart).toBeVisible();
		await expect(cart.getByRole('link', { name: 'Garage Flag Tee' })).toBeVisible();
	});
});
