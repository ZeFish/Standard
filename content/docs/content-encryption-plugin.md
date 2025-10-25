---
title: Content Encryption Plugin
layout: base
permalink: /docs/content-encryption-plugin/index.html
eleventyNavigation:
  key: Content Encryption Plugin
  parent: 11ty Plugins
  title: Content Encryption Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/encryption.js
since: 0.1.0
---

# Content Encryption Plugin

Encrypts sensitive page content with password protection. Uses SHA256-based XOR encryption for client-side decryption. Supports password-protected pages via front matter configuration. Encrypted content is embedded in HTML with decryption UI.

```js
// In markdown front matter
---
title: Private Page
encrypted: true
password: mypassword123
---

This content will be encrypted and require password to view.
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `encrypted` | `frontmatter` | : true Enable encryption for page |
| `password` | `frontmatter` | Required password for decryption |
| `protect` | `transform` | -notes Automatic encryption transform |
| `encrypted` | `layout` | .njk Template for encrypted content display |

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
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
```

</details>

