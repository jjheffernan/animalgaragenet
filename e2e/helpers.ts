import { expect, type Locator, type Page } from '@playwright/test';

export function isAccountPath(url: string): boolean {
	const path = new URL(url).pathname;
	return path === '/account' || path.startsWith('/account/');
}

export async function dismissCookieBanner(page: Page) {
	const accept = page.getByRole('button', { name: 'Accept' });
	if (await accept.isVisible().catch(() => false)) {
		await accept.click();
	}
}

/** Mock magic-link sign-in via native form submit (bypasses SvelteKit enhance). */
export async function mockEmailSignIn(page: Page, email: string) {
	await page.goto('/auth/sign-in');
	await dismissCookieBanner(page);
	await page.locator('form[action="?/magicLink"] input[name="email"]').fill(email);
	await Promise.all([
		page.waitForURL(isAccountPath),
		page.locator('form[action="?/magicLink"]').evaluate((form: HTMLFormElement) => form.submit())
	]);
}

export async function devQuickSignIn(
	page: Page,
	label: 'Admin' | 'Customer' | 'Editor'
): Promise<boolean> {
	await page.goto('/auth/sign-in');
	await dismissCookieBanner(page);
	const quickLogin = page.getByText('Local dev quick login');
	if (!(await quickLogin.isVisible().catch(() => false))) {
		return false;
	}
	await page.getByRole('button', { name: label, exact: true }).click();
	await expect(page).toHaveURL(isAccountPath);
	return true;
}

export async function openCartDrawer(page: Page): Promise<Locator> {
	await page.getByRole('button', { name: 'Cart' }).click();
	const cart = page.getByLabel('Shopping cart');
	await expect(cart).toBeVisible();
	return cart;
}

export async function addProductToCartFromDetail(
	page: Page,
	slug = 'garage-flag-tee'
): Promise<Locator> {
	await page.goto(`/shop/${slug}`);
	await dismissCookieBanner(page);
	await page.getByRole('button', { name: 'Add to Cart' }).click();
	const cart = page.getByLabel('Shopping cart');
	await expect(cart).toBeVisible();
	return cart;
}
