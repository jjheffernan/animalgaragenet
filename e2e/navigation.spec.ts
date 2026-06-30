import { expect, test } from '@playwright/test';
import { dismissCookieBanner } from './helpers';

test.describe('navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await dismissCookieBanner(page);
	});

	test('desktop header links resolve to shop, parts, and builds', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });

		const mainNav = page.getByRole('navigation', { name: 'Main' });
		await expect(mainNav).toBeVisible();

		await mainNav.getByRole('link', { name: 'Shop', exact: true }).click();
		await expect(page).toHaveURL(/\/shop/);
		await expect(page.getByRole('heading', { level: 1, name: 'Shop' })).toBeVisible();

		await page.goto('/parts');
		await expect(page.getByRole('heading', { level: 1, name: 'Parts' })).toBeVisible();

		await page.goto('/builds');
		await expect(page.getByRole('heading', { level: 1, name: 'Build Threads' })).toBeVisible();
	});

	test('mobile drawer opens and links to shop', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });

		await page.getByRole('button', { name: 'Open menu' }).click();
		const drawer = page.getByLabel('Mobile navigation');
		await expect(drawer).toBeVisible();
		await expect(drawer.getByRole('navigation', { name: 'Mobile' })).toBeVisible();

		await drawer.getByRole('button', { name: /^Shop/ }).click();
		await drawer.getByRole('link', { name: 'All Shop' }).click();
		await expect(page).toHaveURL(/\/shop/);
	});

	test('footer community links resolve', async ({ page }) => {
		await page.getByRole('link', { name: 'Builds', exact: true }).last().click();
		await expect(page).toHaveURL(/\/builds/);

		await page.goto('/');
		await page.getByRole('link', { name: 'Contact', exact: true }).click();
		await expect(page).toHaveURL(/\/contact/);
		await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
	});

	test('mobile header keeps account icon-only (IP-BUG-002)', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });

		const header = page.locator('header');
		await expect(header.getByRole('button', { name: 'Account menu' })).toBeVisible();
		await expect(header.getByText('Account', { exact: true })).toHaveCount(0);
	});

	test('desktop nav does not overlap header actions (IP-BUG-002)', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });

		const mainNav = page.getByRole('navigation', { name: 'Main' });
		const dealsLink = mainNav.getByRole('link', { name: /Pit Lane Deals/i });
		const notifications = page.getByRole('button', { name: 'Notifications' });

		if (await notifications.isVisible()) {
			const dealsBox = await dealsLink.boundingBox();
			const bellBox = await notifications.boundingBox();
			expect(dealsBox).not.toBeNull();
			expect(bellBox).not.toBeNull();
			expect(dealsBox!.x + dealsBox!.width).toBeLessThanOrEqual(bellBox!.x);
		}
	});
});
