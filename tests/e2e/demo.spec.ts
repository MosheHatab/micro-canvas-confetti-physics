import { expect, test } from "@playwright/test";

test("demo loads and confetti canvas appears after click", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("button", { name: "Launch confetti" })).toBeVisible();
	await page.getByRole("button", { name: "Launch confetti" }).click();
	await page.waitForTimeout(500);
	const canvas = page.locator("canvas");
	await expect(canvas).toHaveCount(1);
});

test("reset button clears canvas", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Launch confetti" }).click();
	await page.waitForTimeout(300);
	await page.getByRole("button", { name: "Reset" }).click();
	await page.waitForTimeout(600);
	const canvas = page.locator("canvas");
	await expect(canvas).toHaveCount(0);
});
