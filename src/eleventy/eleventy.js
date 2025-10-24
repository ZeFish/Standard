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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  pink: "\x1b[35m",
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
  } = options;

  eleventyConfig.addPlugin(PreProcessor, { escapeCodeBlocks });
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(addEncryptionTransform);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);

  let commentsConfig = {
    enabled: false,
    apiEndpoint: "/api/comments",
    clientLibrary: `/${outputDir}/standard.comment.js`,
    version: pkg.version,
  };

  eleventyConfig.addPlugin(ShortCode, { comments: commentsConfig });

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true,
  });

  // ===== CLOUDFLARE FUNCTIONS INTEGRATION =====
  if (cloudflare.enabled) {
    const cloudflareDir = path.join(__dirname, "../cloudflare");

    // Optionally copy client library to assets
    const commentsClient = path.join(__dirname, "../js/standard.comment.js");
    if (fs.existsSync(commentsClient)) {
      eleventyConfig.addPassthroughCopy({
        [commentsClient]: `${outputDir}/standard.comment.js`,
      });
    }

    commentsConfig.enabled = true;

    eleventyConfig.addGlobalData("comments", commentsConfig);

    console.log(
      `[Standard] Cloudflare Functions enabled → ${cloudflare.outputDir}/`,
    );
    console.log(
      `[Standard] GitHub Comments System enabled via Cloudflare plugin → /api/comments`,
    );
    console.log(
      `[Standard] Comments client library → ${commentsConfig.clientLibrary}`,
    );
  }

  console.log(
    `[Standard] Comments client library → ${commentsConfig.clientLibrary}`,
  );

  // ===== SHORTCODES =====
  eleventyConfig.addNunjucksShortcode(
    "standardAssets",
    function (options = {}) {
      const {
        css = !useCDN,
        js = !useCDN,
        cdn = useCDN,
        attributes = "",
      } = options;

      let html = "";

      if (css && !cdn) {
        html += `<link rel="stylesheet" href="/${outputDir}/standard.min.css" ${attributes}>`;
      } else if (css && cdn) {
        html += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@zefish/standard@${pkg.version}/dist/standard.min.css" ${attributes}>`;
      }

      if (js && !cdn) {
        html += `<script src="/${outputDir}/standard.min.js"></script>`;
      } else if (js && cdn) {
        html += `<script src="https://cdn.jsdelivr.net/npm/@zefish/standard@${pkg.version}/dist/standard.min.js"><\/script>`;
      }

      return html;
    },
  );

  eleventyConfig.addNunjucksShortcode("standardLab", function (options = {}) {
    const { attributes = "" } = options;
    if (useCDN) {
      return `<script src="https://cdn.jsdelivr.net/npm/@zefish/standard@${pkg.version}/dist/standard.lab.js" ${attributes}><\/script>`;
    }
    return `<script src="/${outputDir}/standard.lab.js" ${attributes}><\/script>`;
  });

  eleventyConfig.addGlobalData("standard", {
    layout: {
      meta: "node_modules/@zefish/standard/src/layouts/meta.njk",
      encrypted: "node_modules/@zefish/standard/src/layouts/encrypted.njk",
      pageError: "node_modules/@zefish/standard/src/layouts/404.njk",
      atomFeed: "node_modules/@zefish/standard/src/layouts/atomfeed.xsl",
      sitemap: "node_modules/@zefish/standard/src/layouts/sitemap.xml.njk",
    },
    comments: commentsConfig,
  });
}
