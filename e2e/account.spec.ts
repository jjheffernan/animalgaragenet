import { expect, test } from '@playwright/test';
import { devQuickSignIn, dismissCookieBanner, mockEmailSignIn } from './helpers';

test.describe('account', () => {
	test('sign-in page shows magic link form and OAuth options', async ({ page }) => {
		await page.goto('/auth/sign-in');
		await dismissCookieBanner(page);

		await expect(page.getByRole('heading', { level: 1, name: 'Sign In' })).toBeVisible();
		await expect(page.locator('input[name="email"]').first()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Send Magic Link' })).toBeVisible();
		await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
	});

	test('mock sign-in reaches dashboard with account nav', async ({ page }) => {
		await mockEmailSignIn(page, `e2e-account-${Date.now()}@mock.local`);

		const accountNav = page.getByRole('navigation', { name: 'Account' });
		await expect(accountNav.getByRole('link', { name: 'Overview' })).toBeVisible();
		await expect(accountNav.getByRole('link', { name: 'Orders' })).toBeVisible();
	});

	test('account sub-routes load when signed in', async ({ page }) => {
		await mockEmailSignIn(page, `e2e-routes-${Date.now()}@mock.local`);
		const accountNav = page.getByRole('navigation', { name: 'Account' });

		await accountNav.getByRole('link', { name: 'Orders' }).click();
		await expect(page).toHaveURL(/\/account\/orders/);
		await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

		await accountNav.getByRole('link', { name: 'Build Logs' }).click();
		await expect(page).toHaveURL(/\/account\/builds/);

		await accountNav.getByRole('link', { name: 'Vehicles' }).click();
		await expect(page).toHaveURL(/\/account\/vehicles/);
	});

	test('dev quick login when available', async ({ page }) => {
		const signedIn = await devQuickSignIn(page, 'Customer');
		test.skip(!signedIn, 'Local dev quick login not enabled in this environment');
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	});
});
