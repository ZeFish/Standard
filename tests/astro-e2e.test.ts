import { test, expect } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

test("Astro site builds and menu navigation works", async ({ page }) => {
  // Go to the homepage
  await page.goto("http://localhost:8083");

  // Wait for page to fully load
  await page.waitForLoadState("networkidle");

  // Check if the cheat-sheet link exists in the menu
  // Try different selectors since we don't know the exact structure
  const cheatSheetLink = page
    .locator('a[href*="cheat-sheet"], a[href*="cheat-cheat"]')
    .first();

  // Verify it's visible
  await expect(cheatSheetLink).toBeVisible({ timeout: 5000 });

  // Click the link
  await cheatSheetLink.click();

  // Verify navigation worked (URL should contain cheat-sheet or cheat-cheat)
  await expect(page).toHaveURL(/.*\/(cheat-sheet|cheat-cheat).*/);

  console.log("✓ Menu navigation to cheat-sheet works!");
});

test("Astro build completes successfully", async () => {
  // This test just verifies the build can complete
  try {
    const { stdout, stderr } = await execAsync("npm run build", {
      cwd: process.cwd(),
      timeout: 60000,
    });

    console.log("Build output:", stdout);
    expect(stderr).not.toContain("error");
    expect(stdout.toLowerCase()).toMatch(/complete|success/);
  } catch (error) {
    console.error("Build failed:", error);
    throw error;
  }
});
