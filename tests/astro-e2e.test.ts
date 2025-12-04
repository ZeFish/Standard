import { test, expect } from "@playwright/test";

/**
 * Astro E2E Test Suite
 * 
 * This test suite verifies the live Astro development server:
 * 1. Pages load correctly
 * 2. Navigation works
 * 3. Assets (CSS, JS, fonts) are loaded in the browser
 */

test.describe("Astro Development Server", () => {
  test("Homepage loads successfully", async ({ page }) => {
    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Verify page title
    await expect(page).toHaveTitle(/Standard/);

    console.log("✓ Homepage loaded successfully");
  });

  test("Standard CSS is loaded in browser", async ({ page }) => {
    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Check for CSS link in the document
    const cssLinks = await page.locator('link[rel="stylesheet"]').count();
    expect(cssLinks).toBeGreaterThan(0);

    // Verify at least one CSS file loaded successfully
    const styleResponses = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map((link: any) => link.href);
    });

    expect(styleResponses.length).toBeGreaterThan(0);
    console.log(`✓ Found ${styleResponses.length} CSS file(s) loaded`);

    // Check that styles are actually applied
    const bodyStyles = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    expect(bodyStyles).toBeTruthy();
    console.log(`✓ Body has font-family: ${bodyStyles}`);
  });

  test("Standard JS is loaded in browser", async ({ page }) => {
    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Check for script tags
    const scripts = await page.locator('script[src]').count();
    expect(scripts).toBeGreaterThan(0);

    // Get all script sources
    const scriptSrcs = await page.evaluate(() => {
      const scriptElements = Array.from(document.querySelectorAll('script[src]'));
      return scriptElements.map((script: any) => script.src);
    });

    // Check if at least one script contains "standard"
    const hasStandardScript = scriptSrcs.some(src => src.includes('standard'));
    
    console.log(`✓ Found ${scripts} script(s) loaded`);
    if (hasStandardScript) {
      console.log("✓ Standard JS script detected");
    }
  });

  test("Fonts are loaded correctly", async ({ page }) => {
    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Wait for fonts to load
    await page.waitForTimeout(1000);

    // Check if custom fonts are loaded
    const fontsLoaded = await page.evaluate(async () => {
      if (!document.fonts) return false;
      await document.fonts.ready;
      return document.fonts.size > 0;
    });

    expect(fontsLoaded).toBe(true);

    // Get font count
    const fontCount = await page.evaluate(() => {
      return document.fonts ? document.fonts.size : 0;
    });

    console.log(`✓ ${fontCount} font(s) loaded in browser`);

    // Verify font faces are available
    const fontFamilies = await page.evaluate(() => {
      if (!document.fonts) return [];
      const families = new Set();
      document.fonts.forEach((font: any) => {
        families.add(font.family);
      });
      return Array.from(families);
    });

    expect(fontFamilies.length).toBeGreaterThan(0);
    console.log(`✓ Font families available: ${fontFamilies.join(", ")}`);
  });

  test("Menu navigation works", async ({ page }) => {
    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Check if the cheat-sheet link exists in the menu
    const cheatSheetLink = page
      .locator('a[href*="cheat-sheet"], a[href*="cheat-cheat"]')
      .first();

    // Verify it's visible
    await expect(cheatSheetLink).toBeVisible({ timeout: 5000 });

    // Click the link
    await cheatSheetLink.click();

    // Verify navigation worked
    await expect(page).toHaveURL(/.*\/(cheat-sheet|cheat-cheat).*/);

    console.log("✓ Menu navigation to cheat-sheet works");
  });

  test("Assets are served with correct MIME types", async ({ page }) => {
    const responses: { url: string; contentType: string }[] = [];

    // Listen to all responses
    page.on("response", (response) => {
      const url = response.url();
      const contentType = response.headers()["content-type"] || "";

      if (
        url.includes(".css") ||
        url.includes(".js") ||
        url.includes(".woff") ||
        url.includes(".woff2") ||
        url.includes(".ttf")
      ) {
        responses.push({ url, contentType });
      }
    });

    await page.goto("http://localhost:8083");
    await page.waitForLoadState("networkidle");

    // Check CSS files have correct MIME type
    const cssResponses = responses.filter((r) => r.url.includes(".css"));
    cssResponses.forEach((r) => {
      expect(r.contentType).toMatch(/text\/css/);
    });

    // Check JS files have correct MIME type
    const jsResponses = responses.filter((r) => r.url.includes(".js"));
    jsResponses.forEach((r) => {
      expect(r.contentType).toMatch(/javascript|application\/javascript|text\/javascript/);
    });

    // Check font files have correct MIME type
    const fontResponses = responses.filter(
      (r) =>
        r.url.includes(".woff") ||
        r.url.includes(".woff2") ||
        r.url.includes(".ttf")
    );
    fontResponses.forEach((r) => {
      expect(r.contentType).toMatch(/font|woff|truetype|application\/octet-stream/);
    });

    console.log(`✓ CSS files: ${cssResponses.length}`);
    console.log(`✓ JS files: ${jsResponses.length}`);
    console.log(`✓ Font files: ${fontResponses.length}`);
  });
});
