import { expect, test } from '@playwright/test';
import { dismissCookieBanner } from './helpers';

test.describe('content smoke', () => {
	test('guides page loads with article cards', async ({ page }) => {
		await page.goto('/guides');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Guides' })).toBeVisible();
		await expect(page.locator('a[href*="/guides/"]').first()).toBeVisible();
	});

	test('blog page loads with post cards', async ({ page }) => {
		await page.goto('/blog');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();
		await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible();
	});
});
