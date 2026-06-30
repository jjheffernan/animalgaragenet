import { expect, test, type Page } from '@playwright/test';
import { devQuickSignIn, dismissCookieBanner, isAccountPath } from './helpers';

async function fillBuildLogForm(page: Page, title: string) {
	await page.getByRole('textbox', { name: 'Build Title' }).fill(title);
	await page.getByRole('spinbutton', { name: 'Year' }).fill('2019');
	await page.getByRole('textbox', { name: 'Make' }).fill('Honda');
	await page.getByRole('textbox', { name: 'Model' }).fill('Civic');
	await page.getByRole('textbox', { name: 'Description' }).fill('E2E test build description.');
	await page.getByRole('textbox', { name: 'Mod List' }).fill('Coilovers\nExhaust');
}

test.describe('auth', () => {
	test('local dev quick login shows on sign-in and signs in admin', async ({ page }) => {
		await page.goto('/auth/sign-in');
		await expect(page.getByText('Local dev quick login')).toBeVisible();
		await devQuickSignIn(page, 'Admin');
		await expect(page).toHaveURL(isAccountPath);
	});

	test('mock OAuth Google redirects to account', async ({ page }) => {
		await page.goto('/auth/sign-in?redirect=/account');
		await dismissCookieBanner(page);
		await page.getByRole('button', { name: /google/i }).click();
		await page.waitForURL(isAccountPath, { timeout: 10_000 });
	});
});

test.describe('build log CRUD', () => {
	test.describe.configure({ mode: 'serial' });

	const buildTitle = `E2E Build ${Date.now()}`;

	test('customer creates draft, reads, updates, submits', async ({ page }) => {
		const signedIn = await devQuickSignIn(page, 'Customer');
		test.skip(!signedIn, 'Local dev quick login not enabled');
		await page.goto('/account/builds/new');
		await fillBuildLogForm(page, buildTitle);
		await page.getByRole('button', { name: 'Save draft' }).click();
		await expect(page).toHaveURL(/\/account\/builds\//);

		await page.goto('/account/builds');
		await expect(page.getByText(buildTitle)).toBeVisible();

		await page.getByRole('link', { name: 'Edit' }).click();
		await page.getByRole('textbox', { name: 'Build Title' }).fill(`${buildTitle} Updated`);
		await page.getByRole('button', { name: 'Save draft' }).click();
		await expect(page.getByText('Draft saved.')).toBeVisible();

		await page.getByRole('button', { name: 'Submit for review' }).click();
		await expect(page.getByText(/submitted for review/i)).toBeVisible();
	});

	test('admin approves pending build log', async ({ page }) => {
		const signedIn = await devQuickSignIn(page, 'Admin');
		test.skip(!signedIn, 'Local dev quick login not enabled');
		await page.goto('/admin/builds');
		await expect(page.getByText(`${buildTitle} Updated`)).toBeVisible();
		await page
			.getByRole('listitem')
			.filter({ hasText: `${buildTitle} Updated` })
			.getByRole('button', { name: 'Approve' })
			.click();
		await expect(page.getByText('No build logs awaiting review.')).toBeVisible();
	});
});

test.describe('testimonial CRUD', () => {
	test.describe.configure({ mode: 'serial' });

	const reviewTitle = `E2E Review ${Date.now()}`;

	test('customer submits loyalty review', async ({ page }) => {
		const signedIn = await devQuickSignIn(page, 'Customer');
		test.skip(!signedIn, 'Local dev quick login not enabled');
		await page.goto('/loyalty#reviews');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { name: 'Share Your Review' })).toBeVisible();
		await page.locator('input[name="title"]').fill(reviewTitle);
		await page.locator('textarea[name="body"]').fill('E2E loyalty review body text.');
		await page.getByRole('button', { name: 'Submit for review' }).click();
		await expect(page.getByText(/moderation queue/i)).toBeVisible();
		await expect(page.getByText(reviewTitle)).toBeVisible();
	});

	test('admin approves pending testimonial', async ({ page }) => {
		const signedIn = await devQuickSignIn(page, 'Admin');
		test.skip(!signedIn, 'Local dev quick login not enabled');
		await page.goto('/admin/testimonials');
		await expect(page.getByText(reviewTitle)).toBeVisible();
		await page
			.getByRole('listitem')
			.filter({ hasText: reviewTitle })
			.getByRole('button', { name: 'Approve' })
			.click();
		await expect(page.getByText('No testimonials awaiting review.')).toBeVisible();
	});

	test('approved review appears on loyalty page', async ({ page }) => {
		await page.goto('/loyalty#reviews');
		await expect(page.getByText(reviewTitle)).toBeVisible();
	});
});
