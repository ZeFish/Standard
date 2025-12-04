import { test, expect } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

/**
 * Build Verification Test Suite
 * 
 * This test suite verifies that both Astro and 11ty builds:
 * 1. Complete successfully
 * 2. Include Standard CSS files
 * 3. Include Standard JS files  
 * 4. Include font files (Astro currently, 11ty coming soon)
 */

test.describe("Astro Build Verification", () => {
  const distPath = path.join(process.cwd(), "dist");
  const assetsPath = path.join(distPath, "assets");

  test("Astro build completes successfully", async () => {
    try {
      const { stdout, stderr } = await execAsync("npm run build", {
        cwd: process.cwd(),
        timeout: 120000, // 2 minutes
      });

      console.log("✓ Astro build completed");
      
      // Check that build didn't produce errors
      expect(stderr).not.toMatch(/error/i);
      expect(stdout.toLowerCase()).toMatch(/complete|success|built/);
      
      // Verify dist directory exists
      expect(fs.existsSync(distPath)).toBe(true);
    } catch (error) {
      console.error("Astro build failed:", error);
      throw error;
    }
  });

  test("Astro build includes Standard CSS files", async () => {
    const cssPath = path.join(assetsPath, "css");
    
    // Verify CSS directory exists
    expect(fs.existsSync(cssPath)).toBe(true);
    
    // Check for style.css (main CSS file)
    const styleCss = path.join(cssPath, "style.css");
    expect(fs.existsSync(styleCss)).toBe(true);
    
    // Verify it's not empty
    const stats = fs.statSync(styleCss);
    expect(stats.size).toBeGreaterThan(0);
    
    console.log(`✓ Standard CSS found: style.css (${stats.size} bytes)`);
  });

  test("Astro build includes Standard JS files", async () => {
    const jsPath = path.join(assetsPath, "js");
    
    // Verify JS directory exists
    expect(fs.existsSync(jsPath)).toBe(true);
    
    // Check for expected JS files
    const expectedFiles = [
      "standard.js",
      "standard.lab.js",
    ];
    
    for (const file of expectedFiles) {
      const filePath = path.join(jsPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
      
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
      
      console.log(`✓ Standard JS found: ${file} (${stats.size} bytes)`);
    }
  });

  test("Astro build includes font files", async () => {
    const fontsPath = path.join(assetsPath, "fonts");
    
    // Verify fonts directory exists
    expect(fs.existsSync(fontsPath)).toBe(true);
    
    // Get list of font files
    const fontFiles = fs.readdirSync(fontsPath).filter(file => {
      return file.endsWith(".woff2") || file.endsWith(".woff") || file.endsWith(".ttf");
    });
    
    // Verify we have fonts
    expect(fontFiles.length).toBeGreaterThan(0);
    
    console.log(`✓ Found ${fontFiles.length} font files in Astro build`);
    
    // Check for some specific expected fonts (based on your directory listing)
    const expectedFonts = [
      "InterVariable.woff2",
      "InstrumentSans[wdth,wght].woff2",
      "Fraunces[SOFT,WONK,opsz,wght].woff2",
    ];
    
    for (const font of expectedFonts) {
      const fontPath = path.join(fontsPath, font);
      if (fs.existsSync(fontPath)) {
        const stats = fs.statSync(fontPath);
        console.log(`  ✓ ${font} (${stats.size} bytes)`);
      }
    }
  });
});

test.describe("11ty Build Verification", () => {
  const sitePath = path.join(process.cwd(), "_site");
  const assetsPath = path.join(sitePath, "assets");

  test("11ty build completes successfully", async () => {
    try {
      const { stdout, stderr } = await execAsync("npx @11ty/eleventy", {
        cwd: process.cwd(),
        timeout: 120000, // 2 minutes
      });

      console.log("✓ 11ty build completed");
      
      // Check that build didn't produce errors
      expect(stderr).not.toMatch(/error/i);
      
      // Verify _site directory exists
      expect(fs.existsSync(sitePath)).toBe(true);
    } catch (error) {
      console.error("11ty build failed:", error);
      throw error;
    }
  });

  test("11ty build includes Standard CSS files", async () => {
    const cssPath = path.join(assetsPath, "css");
    
    // Verify CSS directory exists
    expect(fs.existsSync(cssPath)).toBe(true);
    
    // Check for style.css (main CSS file)
    const styleCss = path.join(cssPath, "style.css");
    expect(fs.existsSync(styleCss)).toBe(true);
    
    // Verify it's not empty
    const stats = fs.statSync(styleCss);
    expect(stats.size).toBeGreaterThan(0);
    
    console.log(`✓ Standard CSS found: style.css (${stats.size} bytes)`);
  });

  test("11ty build includes Standard JS files", async () => {
    const jsPath = path.join(assetsPath, "js");
    
    // Verify JS directory exists
    expect(fs.existsSync(jsPath)).toBe(true);
    
    // Check for expected JS files
    const expectedFiles = [
      "standard.js",
      "standard.lab.js",
    ];
    
    for (const file of expectedFiles) {
      const filePath = path.join(jsPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
      
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
      
      console.log(`✓ Standard JS found: ${file} (${stats.size} bytes)`);
    }
  });

  test("11ty build includes font files", async () => {
    const fontsPath = path.join(assetsPath, "fonts");
    
    // Verify fonts directory exists
    expect(fs.existsSync(fontsPath)).toBe(true);
    
    // Get list of font files
    const fontFiles = fs.readdirSync(fontsPath).filter(file => {
      return file.endsWith(".woff2") || file.endsWith(".woff") || file.endsWith(".ttf");
    });
    
    // Verify we have fonts
    expect(fontFiles.length).toBeGreaterThan(0);
    
    console.log(`✓ Found ${fontFiles.length} font files in 11ty build`);
    
    // Check for some specific expected fonts
    const expectedFonts = [
      "InterVariable.woff2",
      "InstrumentSans[wdth,wght].woff2",
      "Fraunces[SOFT,WONK,opsz,wght].woff2",
    ];
    
    for (const font of expectedFonts) {
      const fontPath = path.join(fontsPath, font);
      if (fs.existsSync(fontPath)) {
        const stats = fs.statSync(fontPath);
        console.log(`  ✓ ${font} (${stats.size} bytes)`);
      }
    }
  });

  test("11ty build has proper HTML structure", async () => {
    const indexPath = path.join(sitePath, "index.html");
    
    expect(fs.existsSync(indexPath)).toBe(true);
    
    const content = fs.readFileSync(indexPath, "utf-8");
    
    // Check that HTML includes references to CSS
    expect(content).toMatch(/href=["'].*style\.css["']/);
    
    // Check that HTML includes references to JS
    expect(content).toMatch(/src=["'].*standard.*\.js["']/);
    
    console.log("✓ 11ty HTML includes CSS and JS references");
  });
});

test.describe("Build Comparison", () => {
  test("Both builds produce similar asset structures", async () => {
    const astroAssets = path.join(process.cwd(), "dist", "assets");
    const eleventyAssets = path.join(process.cwd(), "_site", "assets");
    
    // Check both have CSS
    expect(fs.existsSync(path.join(astroAssets, "css"))).toBe(true);
    expect(fs.existsSync(path.join(eleventyAssets, "css"))).toBe(true);
    
    // Check both have JS
    expect(fs.existsSync(path.join(astroAssets, "js"))).toBe(true);
    expect(fs.existsSync(path.join(eleventyAssets, "js"))).toBe(true);
    
    // Check both have fonts
    expect(fs.existsSync(path.join(astroAssets, "fonts"))).toBe(true);
    expect(fs.existsSync(path.join(eleventyAssets, "fonts"))).toBe(true);
    
    console.log("✓ Both Astro and 11ty have consistent asset structures");
  });
});
