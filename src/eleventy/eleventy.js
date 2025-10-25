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
import CloudflarePlugin from "./cloudflare.js";

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
  grey: "\x1b[90m",
  orange: "\x1b[38;5;208m",
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
 * @param {object} options.comments GitHub Comments config
 * @param {boolean} options.comments.enabled Enable comments system (default: false)
 * @param {string} options.comments.apiEndpoint API endpoint path (default: "/api/comments")
 * @param {string} options.comments.commentsPath GitHub storage path (default: "data/comments")
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
 *   comments: {
 *     enabled: true,
 *     apiEndpoint: "/api/comments",
 *     commentsPath: "data/comments"  // Configurable GitHub path
 *   }
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
