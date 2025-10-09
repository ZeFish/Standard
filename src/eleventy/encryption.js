import { createHash } from "crypto";
import * as path from "path";
import nunjucks from "nunjucks";

/**
 * Simple encryption function to avoid pagecrypt stack overflow issue
 * @param {string} html - The HTML content to encrypt
 * @param {string} password - The password to use for encryption
 * @param {Object} customOptions - Customization options for the encrypted page
 * @returns {Promise<string>} The encrypted HTML page
 */
export async function customEncryptHTML(html, password) {
  const crypto = await import("crypto");

  // Simple XOR encryption with password
  const key = crypto.createHash("sha256").update(password).digest();
  const htmlBuffer = Buffer.from(html, "utf8");
  const encrypted = Buffer.alloc(htmlBuffer.length);

  for (let i = 0; i < htmlBuffer.length; i++) {
    encrypted[i] = htmlBuffer[i] ^ key[i % key.length];
  }

  // Use Buffer.toString('base64') to avoid stack overflow
  const encryptedData = encrypted.toString("base64");

  // Configure Nunjucks to load templates from the 'includes' directory
  nunjucks.configure(path.resolve("includes"), {
    autoescape: false, // Disable autoescaping for HTML content
  });

  // Render the Nunjucks template
  const template = nunjucks.render("layouts/encrypted.njk", {
    encryptedData,
  });
  return template;
}

/**
 * Create the Eleventy transform for protecting notes with encryption
 * @param {Function} eleventyConfig - The Eleventy configuration object
 */
export function addEncryptionTransform(eleventyConfig) {
  eleventyConfig.addTransform("protect-notes", async function (content) {
    if (!this.page.inputPath.endsWith(".md")) return content;

    // Read the original file to get frontmatter since rawInput doesn't contain it
    const fs = await import("fs/promises");
    const fileContent = await fs.readFile(this.page.inputPath, "utf8");

    // Extract frontmatter from file content
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return content;
    }

    const frontmatter = frontmatterMatch[1];

    // Look for password in frontmatter
    const passwordMatch = frontmatter.match(/^password:\s*(.+)$/m);
    if (!passwordMatch) {
      return content;
    }

    const password = passwordMatch[1].trim();

    // Safety checks before encryption
    if (!content || typeof content !== "string") {
      console.log("⚠️ Invalid content type, skipping encryption");
      return content;
    }

    if (content.length > 1000000) {
      // 1MB limit
      console.log("⚠️ Content too large, skipping encryption");
      return content;
    }

    try {
      // Encrypt the rendered HTML with our custom function
      const encryptedHtml = await customEncryptHTML(content, password);
      console.log("Successfully encrypted:", this.page.inputPath);
      return encryptedHtml;
    } catch (error) {
      console.error(
        "❌ Encryption failed for:",
        this.page.inputPath,
        error.message,
      );
      return content; // Return unencrypted content on error
    }
  });
}
