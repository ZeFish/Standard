---
title: Standard Framework 11ty Plugin
layout: base
permalink: /docs/standard-framework-11ty-plugin/index.html
eleventyNavigation:
  key: Standard Framework 11ty Plugin
  parent: 11ty Plugins
  title: Standard Framework 11ty Plugin
category: 11ty Plugins
type: js
source: /Users/francisfontaine/Documents/GitHub/Standard/src/eleventy/eleventy.js
since: 0.1.0
---

# Standard Framework 11ty Plugin

Complete plugin orchestrator for Standard Framework. Includes:
 - Typography system (smart quotes, fractions, dashes, widow prevention)
 - CSS framework (grid, spacing, colors, responsive design)
 - 11ty plugins (markdown, filters, shortcodes, backlinks, encryption)
 - Cloudflare Functions integration (serverless endpoints)
 - GitHub Comments System (serverless comments stored in GitHub)

One plugin adds everything you need. Configure what you want to use.

```js
// Minimal setup (typography + CSS only)
import Standard from "./src/eleventy/eleventy.js";

export default function (eleventyConfig) {
eleventyConfig.addPlugin(Standard);
}

// With Cloudflare Functions
eleventyConfig.addPlugin(Standard, {
cloudflare: { enabled: true, outputDir: "functions" }
});

// With Comments System
eleventyConfig.addPlugin(Standard, {
comments: {
enabled: true,
apiEndpoint: "/api/comments",
commentsPath: "data/comments"  // Configurable GitHub path
}
});

// Everything included
eleventyConfig.addPlugin(Standard, {
outputDir: "assets/standard",
copyFiles: true,
cloudflare: { enabled: true },
comments: { enabled: true }
});
```

### Properties

| Name | Type | Description |
|------|------|-------------|
| `standardAssets` | `shortcode` | Include CSS and JS in template |
| `standardLab` | `shortcode` | Include lab/experimental features |
| `Markdown` | `plugin` | Enhanced markdown parsing |
| `Filter` | `plugin` | Template filters for content |
| `ShortCode` | `plugin` | Additional template shortcodes |
| `PreProcessor` | `plugin` | Markdown preprocessing |
| `Backlinks` | `plugin` | Wiki-style backlinks |
| `Encryption` | `plugin` | Content encryption |
| `Navigation` | `plugin` | Hierarchical navigation menus |
| `Cloudflare` | `passthrough` | Functions Serverless functions |
| `Comments` | `passthrough` | GitHub comments system |

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `eleventyConfig` | `object` | 11ty configuration object |
| `options` | `object` | Plugin options |
| `options` | `string` | .outputDir Output directory for Standard assets (default: assets/standard) |
| `options` | `boolean` | .copyFiles Copy files from node_modules (default: true) |
| `options` | `boolean` | .useCDN Use CDN instead of local files (default: false) |
| `options` | `array` | .escapeCodeBlocks Languages to escape code blocks for (default: []) |
| `options` | `object` | .cloudflare Cloudflare Functions config (default: { enabled: false }) |
| `options` | `object` | .comments GitHub Comments config |
| `options` | `boolean` | .comments.enabled Enable comments system (default: false) |
| `options` | `string` | .comments.apiEndpoint API endpoint path (default: "/api/comments") |
| `options` | `string` | .comments.commentsPath GitHub storage path (default: "data/comments") |

<details>
<summary><span class="button">Source Code</span></summary>

```javascript
export default function (eleventyConfig, options = {}) {
  // Options with defaults
  const {
    // Output directory for copied files (relative to output folder)
    outputDir = "assets/standard",
    // Whether to copy files from node_modules
    copyFiles = true,
    // Whether to use CDN instead of local files
    useCDN = false,
    // Languages to escape code blocks for globally
    escapeCodeBlocks = [],
    // Cloudflare Functions configuration
    cloudflare = {
      enabled: false,
      outputDir: "functions",
      environment: "production",
    },
    comments = {
      enabled: false,
      apiEndpoint: "/api/comments",
      clientLibrary: `/${outputDir}/standard.comment.js`,
      commentsPath: "data/comments",
      version: pkg.version,
    },
  } = options;

  eleventyConfig.addGlobalData("standard", {
    layout: {
      hola: [path.join(__dirname, "../layouts/standard.min.css")],
      meta: "node_modules/@zefish/standard/src/layouts/meta.njk",
      encrypted: "node_modules/@zefish/standard/src/layouts/encrypted.njk",
      pageError: "node_modules/@zefish/standard/src/layouts/404.njk",
      atomFeed: "node_modules/@zefish/standard/src/layouts/atomfeed.xsl",
      sitemap: "node_modules/@zefish/standard/src/layouts/sitemap.xml.njk",
    },
    option: options,
    comments: comments,
  });

  eleventyConfig.addPlugin(PreProcessor, { escapeCodeBlocks });
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(addEncryptionTransform);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);
  eleventyConfig.addPlugin(ShortCode);

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true,
  });

  // Add passthrough copy from node_modules using relative path
  if (copyFiles && !useCDN) {
    eleventyConfig.addPassthroughCopy({
      [path.join(__dirname, "../../dist/standard.min.css")]:
        `${outputDir}/standard.min.css`,
      [path.join(__dirname, "../../dist/standard.theme.min.css")]:
        `${outputDir}/standard.theme.min.css`,
      [path.join(__dirname, "../../dist/standard.min.js")]:
        `${outputDir}/standard.min.js`,
      [path.join(__dirname, "../../dist/standard.lab.js")]:
        `${outputDir}/standard.lab.js`,
      "node_modules/htmx.org/dist/htmx.min.js": `${outputDir}/htmx.min.js`,
    });
  }

  // ===== CLOUDFLARE FUNCTIONS INTEGRATION =====
  if (cloudflare.enabled) {
    // Add the Cloudflare plugin with the config
    eleventyConfig.addPlugin(CloudflarePlugin, {
      outputDir: cloudflare.outputDir,
      environment: cloudflare.environment,
      env: cloudflare.env || {},
    });

    // When Cloudflare is enabled, automatically enable comments system
    comments.enabled = true;

    // Copy comments client library to assets
    const commentsClient = path.join(
      __dirname,
      "../../dist/standard.comment.js",
    );
    eleventyConfig.addPassthroughCopy({
      [commentsClient]: `${outputDir}/standard.comment.js`,
    });
  }

  // ===== SHORTCODES =====
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardAssets", function () {
    let html = "";

    html = `<link rel="stylesheet" href="/${outputDir}/standard.min.css"><link rel="stylesheet" href="/${outputDir}/standard.theme.min.css">
<script src="/${outputDir}/standard.min.js" type="module"></script></script>
<script src="/${outputDir}/htmx.min.js"></script>`;

    // Add comments client library if comments are enabled
    if (comments.enabled) {
      html += `\n<script src="/${outputDir}/standard.comment.js"></script>`;
    }

    return html;
  });

  // ===== SHORTCODES =====
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardCss", function () {
    let html = "";

    html = `<link rel="stylesheet" href="/${outputDir}/standard.min.css">`;

    // Add comments client library if comments are enabled
    if (comments.enabled) {
      html += `\n<script src="/${outputDir}/standard.comment.js"></script>`;
    }

    return html;
  });

  eleventyConfig.addShortcode("standardLab", function (options = {}) {
    const { attributes = "" } = options;

    return `<script src="/${outputDir}/standard.lab.js" ${attributes}><\/script>`;
  });

  // Log plugin initialization after build completes
  eleventyConfig.on("eleventy.after", () => {
    console.log(
      `${colors.red}⚡⚡ Standard${colors.grey} | ${colors.reset}${pkg.version}${colors.grey} | ${colors.green}https://standard.ffp.co/cheet-sheat ⚡⚡${colors.reset}`,
    );
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
```

</details>

