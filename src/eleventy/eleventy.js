import nunjucks from "nunjucks";
import * as sass from "sass";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fs from "fs";

import Backlinks from "./backlinks.js";
import Markdown from "./markdown.js";
import Filter from "./filter.js";
import ShortCode from "./shortcode.js";
import PreProcessor from "./preprocessor.js";
import { addEncryptionTransform } from "./encryption.js";
import { generateWranglerConfig } from "./cloudflare.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
};

// Read package.json for version
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, "../../package.json"), "utf-8"),
);

/**
 * @component Standard Framework 11ty Plugin
 * @category 11ty Plugins
 * @description Complete plugin orchestrator for Standard Framework. Includes:
 * - Typography system (smart quotes, fractions, dashes, widow prevention)
 * - CSS framework (grid, spacing, colors, responsive design)
 * - 11ty plugins (markdown, filters, shortcodes, backlinks, encryption)
 * - Cloudflare Functions integration (serverless endpoints)
 * - GitHub Comments System (serverless comments stored in GitHub)
 *
 * One plugin adds everything you need. Configure what you want to use.
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for Standard assets (default: assets/standard)
 * @param {boolean} options.copyFiles Copy files from node_modules (default: true)
 * @param {boolean} options.useCDN Use CDN instead of local files (default: false)
 * @param {array} options.escapeCodeBlocks Languages to escape code blocks for (default: [])
 * @param {object} options.cloudflare Cloudflare Functions config (default: { enabled: false })
 * @param {object} options.comments GitHub Comments config (default: { enabled: false })
 *
 * @prop {shortcode} standardAssets Include CSS and JS in template
 * @prop {shortcode} standardLab Include lab/experimental features
 * @prop {plugin} Markdown Enhanced markdown parsing
 * @prop {plugin} Filter Template filters for content
 * @prop {plugin} ShortCode Additional template shortcodes
 * @prop {plugin} PreProcessor Markdown preprocessing
 * @prop {plugin} Backlinks Wiki-style backlinks
 * @prop {plugin} Encryption Content encryption
 * @prop {plugin} Navigation Hierarchical navigation menus
 * @prop {passthrough} Cloudflare Functions Serverless functions
 * @prop {passthrough} Comments GitHub comments system
 *
 * @example
 * // Minimal setup (typography + CSS only)
 * import Standard from "./src/eleventy/eleventy.js";
 *
 * export default function (eleventyConfig) {
 *   eleventyConfig.addPlugin(Standard);
 * }
 *
 * // With Cloudflare Functions
 * eleventyConfig.addPlugin(Standard, {
 *   cloudflare: { enabled: true, outputDir: "functions" }
 * });
 *
 * // With Comments System
 * eleventyConfig.addPlugin(Standard, {
 *   comments: { enabled: true, outputDir: "functions/api" }
 * });
 *
 * // Everything included
 * eleventyConfig.addPlugin(Standard, {
 *   outputDir: "assets/standard",
 *   copyFiles: true,
 *   cloudflare: { enabled: true },
 *   comments: { enabled: true }
 * });
 *
 * @since 0.1.0
 */

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
    // GitHub Comments System configuration
    comments: userComments = {},
  } = options;

  const comments = {
    enabled: false,
    outputDir: "functions/api",
    copyClientLibrary: true,
    ...userComments,
  };

  eleventyConfig.addPlugin(PreProcessor, { escapeCodeBlocks });
  eleventyConfig.addPlugin(ShortCode);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(addEncryptionTransform);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true,
  });

  //eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  //
  eleventyConfig.addGlobalData("standard", {
    layout: {
      meta: "node_modules/@zefish/standard/src/layouts/meta.njk",
      encrypted: "node_modules/@zefish/standard/src/layouts/encrypted.njk",
    },
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardAssets", function () {
    let html = "";

    if (useCDN) {
      html = `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
    } else {
      html = `<link rel="stylesheet" href="/${outputDir}/standard.min.css">
<script src="/${outputDir}/standard.min.js" type="module"></script>`;
    }

    // Add comments client library if comments are enabled
    if (comments.enabled) {
      html += `\n<script src="/assets/js/comments-client.js"></script>`;
    }

    return html;
  });

  // Shortcode to include Standard CSS local files
  eleventyConfig.addShortcode("standardCss", function () {
    if (useCDN) {
      return `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">`;
    } else {
      return `<link rel="stylesheet" href="/${outputDir}/standard.min.css">`;
    }
  });

  // Shortcode to include Standard JS from local files
  eleventyConfig.addShortcode("standardJs", function () {
    if (useCDN) {
      return `<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
    } else {
      return `<script src="/${outputDir}/standard.min.js" type="module"></script>`;
    }
  });

  // Shortcode to include only CSS
  eleventyConfig.addShortcode("standardLab", function () {
    if (useCDN) {
      return `<script type="module" src="https://unpkg.com/@zefish/standard/lab"></script>`;
    }
    return `<script type="module" src="/${outputDir}/standard.lab.js"></script>`;
  });

  // Add passthrough copy from node_modules using relative path
  if (copyFiles && !useCDN) {
    eleventyConfig.addPassthroughCopy({
      "node_modules/@zefish/standard/dist/standard.min.css": `${outputDir}/standard.min.css`,
      "node_modules/@zefish/standard/dist/standard.min.js": `${outputDir}/standard.min.js`,
      "node_modules/@zefish/standard/dist/standard.lab.js": `${outputDir}/standard.lab.js`,
    });
  }

  // ===== CLOUDFLARE FUNCTIONS INTEGRATION =====
  if (cloudflare.enabled) {
    const cloudflareDir = path.join(__dirname, "../cloudflare");


    eleventyConfig.addGlobalData("cloudflare", {
      environment: cloudflare.environment || "production",
      outputDir: cloudflare.outputDir,
      version: pkg.version,
    });

    console.log(
      `[Standard] Cloudflare Functions enabled → ${cloudflare.outputDir}/`,
    );
  }

  // ===== GITHUB COMMENTS SYSTEM INTEGRATION =====
  if (comments.enabled) {
    generateWranglerConfig({ environment: cloudflare.environment });


    // Optionally copy client library to assets
    if (comments.copyClientLibrary) {
      const commentsClient = path.join(
        __dirname,
        "../cloudflare/comments-client.js",
      );
      if (fs.existsSync(commentsClient)) {
        eleventyConfig.addPassthroughCopy({
          [commentsClient]: "assets/js/comments-client.js",
        });
      }
    }

    eleventyConfig.addGlobalData("comments", {
      enabled: true,
      apiEndpoint: "/api/comments",
      clientLibrary: comments.copyClientLibrary
        ? "/assets/js/comments-client.js"
        : null,
      version: pkg.version,
    });

    console.log(
      `[Standard] GitHub Comments System enabled → ${comments.outputDir}/comments.js`,
    );
    if (comments.copyClientLibrary)
      console.log(
        `[Standard] Comments client library → assets/js/comments-client.js`,
      );
  }

  // Log plugin initialization after build completes
  eleventyConfig.on("eleventy.after", () => {
    console.log(
      `${colors.cyan}📦 Standard Framework${colors.reset} | ${colors.green}${pkg.version}${colors.reset} | https://standard.ffp.co/cheet-sheat`,
    );
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
