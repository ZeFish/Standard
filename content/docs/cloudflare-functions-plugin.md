---
title: Cloudflare Functions Plugin
layout: base
permalink: /docs/cloudflare-functions-plugin/index.html
eleventyNavigation:
  key: Cloudflare Functions Plugin
  parent: 11ty Plugins
  title: Cloudflare Functions Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/cloudflare.js
since: 0.10.52
---

# Cloudflare Functions Plugin

Plugin to integrate Cloudflare Workers/Functions with 11ty websites. Automatically copies function files and generates configuration for serverless deployment.

```js
// In eleventy.config.js
import Standard from "./src/eleventy/eleventy.js";
import CloudflarePlugin from "./src/eleventy/cloudflare.js";

export default function (eleventyConfig) {
eleventyConfig.addPlugin(Standard);
eleventyConfig.addPlugin(CloudflarePlugin, {
outputDir: "functions",
environment: "production"
});
}
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `eleventy` | `hook` | .before Copies function files from `src/cloudflare` to the project root. |
| `cloudflare` | `global` | Cloudflare configuration data available in templates |

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `eleventyConfig` | `object` | 11ty configuration object |
| `options` | `object` | Plugin options |
| `options` | `string` | .outputDir Output directory for function files (default: functions) |
| `options` | `string` | .environment Environment name (default: production) |
| `options` | `object` | .env Environment variables to pass to functions |

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
export default function (eleventyConfig, options = {}) {
  const {
    outputDir = "functions",
    environment = "production",
    env = {},
  } = options;

  // Copy Cloudflare functions to project root (not _site output directory)
  // Functions are in src/cloudflare/ in the Standard package
  const cloudflareDir = path.join(__dirname, "../cloudflare");
  const projectRoot = process.cwd();
  const functionsOutputPath = path.join(projectRoot, outputDir);

  // Copy functions before build starts
  eleventyConfig.on("eleventy.before", async () => {
    if (fs.existsSync(cloudflareDir)) {
      // Ensure output directory exists
      if (!fs.existsSync(functionsOutputPath)) {
        fs.mkdirSync(functionsOutputPath, { recursive: true });
      }

      // Recursively copy all files from cloudflare source to project root
      const copyRecursive = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);
        files.forEach((file) => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          const stat = fs.statSync(srcPath);

          if (stat.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        });
      };

      copyRecursive(cloudflareDir, functionsOutputPath);
      console.log(
        `[Cloudflare Plugin] Copied functions to ${path.relative(projectRoot, functionsOutputPath)}`
      );
    }
  });

  // Add global data for Cloudflare configuration
  eleventyConfig.addGlobalData("cloudflare", {
    environment,
    outputDir,
    env,
    version: "0.10.52",
  });

  console.log(`[Cloudflare Plugin] Configured for ${environment} environment`);
  console.log(`[Cloudflare Plugin] Functions output directory: ${outputDir}`);
}
```

</details>

