import { expect, test } from '@playwright/test';
import { dismissCookieBanner } from './helpers';

test.describe('builds', () => {
	test('builds list loads with threads and detail links', async ({ page }) => {
		await page.goto('/builds');
		await dismissCookieBanner(page);

		await expect(page.getByRole('heading', { level: 1, name: 'Build Threads' })).toBeVisible();
		await expect(page.getByText(/\d+ threads/)).toBeVisible();

		const buildLink = page.locator('a[href*="/builds/"]').first();
		const count = await buildLink.count();
		test.skip(count === 0, 'No build threads in catalog');

		const href = await buildLink.getAttribute('href');
		await buildLink.click();
		await expect(page).toHaveURL(href ?? /\/builds\/.+/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('my build logs CTA requires sign-in when logged out', async ({ page }) => {
		await page.goto('/builds');
		await dismissCookieBanner(page);

		await page.getByRole('link', { name: 'My Build Logs' }).click();
		await expect(page).toHaveURL(/\/auth\/sign-in/);
	});
});
