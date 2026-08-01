import { expect, test } from "@playwright/test";

test("demo loads and confetti canvas appears after click", async ({ page }) => {
	await page.goto("./");
	await expect(page.getByRole("button", { name: "Pop confetti" })).toBeVisible();
	await page.getByRole("button", { name: "Pop confetti" }).click();
	await page.waitForTimeout(500);
	await expect(page.locator("canvas")).toHaveCount(1);
});

test("clear button removes canvas", async ({ page }) => {
	await page.goto("./");
	await page.getByRole("button", { name: "Pop confetti" }).click();
	await page.waitForTimeout(300);
	await page.getByRole("button", { name: "Clear" }).click();
	await page.waitForTimeout(600);
	await expect(page.locator("canvas")).toHaveCount(0);
});
