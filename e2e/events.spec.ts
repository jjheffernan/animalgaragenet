import { expect, test } from '@playwright/test';

async function dismissCookieBanner(page: import('@playwright/test').Page) {
	const accept = page.getByRole('button', { name: 'Accept' });
	if (await accept.isVisible()) {
		await accept.click();
	}
}

test.describe('events page', () => {
	test('switches between list and calendar views', async ({ page }) => {
		await page.goto('/events', { waitUntil: 'networkidle' });
		await dismissCookieBanner(page);

		const tablist = page.getByRole('tablist', { name: 'Events view' });
		const listTab = tablist.getByRole('tab', { name: 'List' });
		const calendarTab = tablist.getByRole('tab', { name: 'Calendar' });

		await expect(listTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('grid', { name: /events calendar/i })).toHaveCount(0);

		await calendarTab.click();
		await expect(calendarTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
		await expect(page.getByRole('grid', { name: /events calendar/i })).toBeVisible();

		await listTab.click();
		await expect(listTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('grid', { name: /events calendar/i })).toHaveCount(0);
	});
});
