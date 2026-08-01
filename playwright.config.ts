import { defineConfig, devices } from "@playwright/test";

const DEMO_BASE = "/micro-canvas-confetti-physics/";

export default defineConfig({
	testDir: "tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: `http://localhost:4173${DEMO_BASE}`,
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: "npm run build:demo && node scripts/serve-pages.mjs",
		url: `http://localhost:4173${DEMO_BASE}`,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
