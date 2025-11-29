import { createHash } from "crypto";
import * as path from "path";
import { fileURLToPath } from "url";
import nunjucks from "nunjucks";
import { readFile } from "fs/promises";
import Logger from "../core/logger.js";

/**
 * @component Content Encryption Plugin
 * @category 11ty Plugins
 * @description Encrypts sensitive page content with password protection.
 * Uses SHA256-based XOR encryption for client-side decryption. Supports
 * password-protected pages via front matter configuration. Encrypted content
 * is embedded in HTML with decryption UI.
 *
 * @prop {frontmatter} encrypted: true Enable encryption for page
 * @prop {frontmatter} password Required password for decryption
 * @prop {transform} protect-notes Automatic encryption transform
 * @prop {layout} encrypted.njk Template for encrypted content display
 *
 * @example
 * // In markdown front matter
 * ---
 * title: Private Page
 * encrypted: true
 * password: mypassword123
 * ---
 *
 * This content will be encrypted and require password to view.
 *
 * @since 0.1.0
 */

// Get the directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function addEncryptionTransform(eleventyConfig, site) {
  const logger = Logger({
    verbose: site.standard.verbose,
    scope: "Encryption",
  });

  eleventyConfig.addTransform("protect-notes", async function (content) {
    if (!this.page.inputPath.endsWith(".md")) return content;

    // Read the original file to get frontmatter since rawInput doesn't contain it
    let fileContent;
    try {
      fileContent = await readFile(this.page.inputPath, "utf8");
    } catch (error) {
      this.logger.error(
        "❌ Failed to read file:",
        this.page.inputPath,
        error.message,
      );
      console.error(
        "❌ Failed to read file:",
        this.page.inputPath,
        error.message,
      );
      return content;
    }

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
      logger.info("Successfully encrypted:", this.page.inputPath);
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
  logger.success();
}

export async function customEncryptHTML(html, password) {
  // Simple XOR encryption with password
  const key = createHash("sha256").update(password).digest();
  const htmlBuffer = Buffer.from(html, "utf8");
  const encrypted = Buffer.alloc(htmlBuffer.length);
  const logger = Logger({
    scope: "Encryption",
  });

  for (let i = 0; i < htmlBuffer.length; i++) {
    encrypted[i] = htmlBuffer[i] ^ key[i % key.length];
  }

  // Use Buffer.toString('base64') to avoid stack overflow
  const encryptedData = encrypted.toString("base64");

  // Configure Nunjucks to load templates from the 'includes' directory
  const includesPath = path.resolve(__dirname, "../layouts");
  nunjucks.configure(includesPath, {
    autoescape: false, // Disable autoescaping for HTML content
  });

  // Render the Nunjucks template
  const template = nunjucks.render("encrypted.njk", {
    encryptedData,
  });
  return template;
}
