import "dotenv/config";
import nunjucks from "nunjucks";
import * as sass from "sass";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Backlinks from "./backlinks.js";
import Markdown from "./markdown.js";
import Filter from "./filter.js";
import ShortCode from "./shortcode.js";
import PreProcessor from "./preprocessor.js";
import Transform from "./transform.js";
import Image from "./image.js";
import CloudflarePlugin from "./cloudflare.js";
import MenuPlugin from "./menu.js";
import Syntax from "./syntax.js";
import { createLogger } from "./logger.js";
import EncryptionPlugin from "./encryption.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
 * import Standard from "./src/eleventy/standard.js";
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
    images = {
      enabled: false,
      cdn: "cloudflare",
      baseUrl: "",
      sizes: [640, 960, 1280, 1920],
      quality: 85,
      format: "auto",
    },
    menu = { enabled: true },
    verbose = false,
  } = options;

  const ENV = process.env.ENV || "PROD";
  const logger = createLogger({ verbose });

  eleventyConfig.addGlobalData("standard", {
    layout: {
      hola: path.join(__dirname, "../layouts/standard.min.css"),
      meta: path.join(__dirname, "../layouts/meta.njk"),
      encrypted: path.join(__dirname, "../layouts/encrypted.njk"),
      pageError: path.join(__dirname, "../layouts/404.njk"),
      atomFeed: path.join(__dirname, "../layouts/atomfeed.xsl"),
      sitemap: path.join(__dirname, "../layouts/sitemap.xml.njk"),
    },
    options: options,
    comments: comments,
  });

  logger.info("Plugin Loading...");
  eleventyConfig.addPlugin(PreProcessor, { escapeCodeBlocks });
  eleventyConfig.addPlugin(Transform);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);
  eleventyConfig.addPlugin(ShortCode, { outputDir, comments });
  eleventyConfig.addPlugin(MenuPlugin, options.menu);
  eleventyConfig.addPlugin(Syntax);
  eleventyConfig.addPlugin(EncryptionPlugin);

  //const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Register Images Plugin
  if (options.image && options.image.enabled) {
    //eleventyConfig.addPlugin(Image, options.image);
  }
  logger.info("Plugin Loaded.");

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
      [path.join(__dirname, "../../dist/standard.bundle.css")]:
        `${outputDir}/standard.bundle.css`,
      [path.join(__dirname, "../../dist/standard.theme.min.css")]:
        `${outputDir}/standard.theme.min.css`,
      [path.join(__dirname, "../../dist/standard.min.js")]:
        `${outputDir}/standard.min.js`,
      [path.join(__dirname, "../../dist/standard.bundle.js")]:
        `${outputDir}/standard.bundle.js`,
      [path.join(__dirname, "../../dist/standard.bundle.full.js")]:
        `${outputDir}/standard.bundle.full.js`,
      [path.join(__dirname, "../../dist/standard.lab.js")]:
        `${outputDir}/standard.lab.js`,
    });
  }

  // ===== CLOUDFLARE FUNCTIONS INTEGRATION =====
  if (cloudflare.enabled) {
    // Add the Cloudflare plugin with the config
    /*
    eleventyConfig.addPlugin(CloudflarePlugin, {
      outputDir: cloudflare.outputDir,
      environment: cloudflare.environment,
      env: cloudflare.env || {},
    });
  */

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

  // Log plugin initialization after build completes
  eleventyConfig.on("eleventy.after", () => {
    logger.banner(pkg.version, "https://standard.ffp.co/cheat-sheet");
  });

  /*
  eleventyConfig.addGlobalData("eleventyComputed", {
    theme: (data) => data.theme || "default",
    visibility: (data) => data.visibility || "public",
  });
  */
  logger.info("Returning configuration");
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
