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
		await expect(
			page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shop', exact: true })
		).toBeVisible();
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

	test('build threads page loads', async ({ page }) => {
		await page.goto('/builds');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Build Threads' })).toBeVisible();
	});

	test('blog index loads', async ({ page }) => {
		await page.goto('/blog');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();
	});

	test('about page loads', async ({ page }) => {
		await page.goto('/about');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Our Story' })).toBeVisible();
	});

	test('contact page loads', async ({ page }) => {
		await page.goto('/contact');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
	});

	test('support page loads', async ({ page }) => {
		await page.goto('/support');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Support' })).toBeVisible();
	});

	test('gift cards page loads', async ({ page }) => {
		await page.goto('/gift-cards');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Gift Cards' })).toBeVisible();
	});

	test('sign-in page loads', async ({ page }) => {
		await page.goto('/auth/sign-in');
		await dismissCookieBanner(page);
		await expect(page.getByRole('heading', { level: 1, name: 'Sign In' })).toBeVisible();
	});

	test('sitemap.xml returns urlset', async ({ request }) => {
		const response = await request.get('/sitemap.xml');
		expect(response.ok()).toBeTruthy();
		const body = await response.text();
		expect(body).toContain('<urlset');
		expect(body).toContain('<loc>');
	});

	test('robots.txt includes Sitemap directive', async ({ request }) => {
		const response = await request.get('/robots.txt');
		expect(response.ok()).toBeTruthy();
		expect(await response.text()).toMatch(/Sitemap:/i);
	});
});
