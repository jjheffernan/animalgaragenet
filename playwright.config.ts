import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4174);
const baseURL = `http://localhost:${port}`;

/** Force mock auth/cart for deterministic e2e (no live Supabase/Saleor required). */
const e2eEnv = {
	PUBLIC_SUPABASE_URL: '',
	PUBLIC_SUPABASE_ANON_KEY: '',
	PUBLIC_SALEOR_API_URL: '',
	LOCAL_DEV_AUTH: 'true'
};

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'list' : 'html',
	use: {
		...devices['Desktop Chrome'],
		baseURL,
		trace: 'on-first-retry'
	},
	webServer: {
		command: [
			`PUBLIC_SUPABASE_URL= PUBLIC_SUPABASE_ANON_KEY= PUBLIC_SALEOR_API_URL= npm run build`,
			`npm run preview -- --port ${port}`
		].join(' && '),
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		env: { ...process.env, ...e2eEnv }
	}
});
