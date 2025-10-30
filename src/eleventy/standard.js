import "dotenv/config";
import nunjucks from "nunjucks";
import * as sass from "sass";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fs from "fs";
import yaml from "js-yaml";

import Backlinks from "./backlinks.js";
import Markdown from "./markdown.js";
import Filter from "./filter.js";
import ShortCode from "./shortcode.js";
import PreProcessor from "./preprocessor.js";
import Transform from "./transform.js";
import { OpenRouterPlugin } from "./openrouter.js";
import CloudflarePagesPlugin from "./cloudflare.js";
import MenuPlugin from "./menu.js";
import Syntax from "./syntax.js";
import { createLogger } from "./logger.js";
import EncryptionPlugin from "./encryption.js";
import Sitemap from "./sitemap.js";
import Feed from "./feed.js";
import Manifest from "./manifest.js";
import Robots from "./robots.js";
import Security from "./security.js";

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
 * - Cloudflare Pages integration (functions + image optimization)
 * - GitHub Comments System (serverless comments stored in GitHub)
 *
 * One plugin adds everything you need. Configure what you want to use.
 *
 * Configuration cascade (priority):
 * 1. Plugin defaults (lowest)
 * 2. eleventy.config.js options (middle)
 * 3. site.config.yml (highest - overrides everything)
 *
 * @param {object} eleventyConfig 11ty configuration object
 * @param {object} options Plugin options
 * @param {string} options.outputDir Output directory for Standard assets (default: assets/standard)
 * @param {boolean} options.copyFiles Copy framework files to output (default: true)
 * @param {array} options.escapeCodeBlocks Languages to escape code blocks for (default: [])
 * @param {object} options.dirs Directory configuration
 * @param {string} options.dirs.input Content directory (default: content)
 * @param {string} options.dirs.includes Layouts directory (default: src/layouts)
 * @param {string} options.dirs.output Build output directory (default: _site)
 * @param {string} options.publicDir Static assets directory (default: ../public)
 * @param {object} options.cloudflare Cloudflare Pages config
 * @param {object} options.cloudflare.functions Functions deployment config
 * @param {boolean} options.cloudflare.functions.enabled Enable functions (default: false)
 * @param {string} options.cloudflare.functions.outputDir Functions directory (default: functions)
 * @param {string} options.cloudflare.functions.environment Environment name (default: production)
 * @param {object} options.cloudflare.functions.env Environment variables for functions
 * @param {object} options.cloudflare.images Image optimization config
 * @param {boolean} options.cloudflare.images.enabled Enable image optimization (default: false)
 * @param {string} options.cloudflare.images.baseUrl Base URL for absolute paths
 * @param {number[]} options.cloudflare.images.sizes Responsive breakpoints (default: [640, 960, 1280, 1920])
 * @param {number} options.cloudflare.images.quality Image quality 1-100 (default: 85)
 * @param {string} options.cloudflare.images.format Output format (default: auto)
 * @param {object} options.comments GitHub Comments config
 * @param {boolean} options.comments.enabled Enable comments system (default: false)
 * @param {string} options.comments.apiEndpoint API endpoint path (default: /api/comments)
 * @param {string} options.comments.commentsPath GitHub storage path (default: data/comments)
 * @param {object} options.menu Menu generation config
 * @param {boolean} options.verbose Enable verbose logging (default: false)
 *
 * @example
 * // Zero config (uses all defaults)
 * import Standard from "@zefish/standard";
 *
 * export default function (eleventyConfig) {
 *   eleventyConfig.addPlugin(Standard);
 * }
 *
 * // With options in eleventy.config.js
 * eleventyConfig.addPlugin(Standard, {
 *   outputDir: "assets/framework",
 *   verbose: true
 * });
 *
 * // Override in site.config.yml (highest priority)
 * // site.config.yml:
 * // title: My Site
 * // standard:
 * //   outputDir: assets/custom
 * //   cloudflare:
 * //     images:
 * //       enabled: true
 *
 * @since 0.1.0
 */

/**
 * Deep merge helper - recursively merges nested objects
 * Ensures user options properly override defaults at any nesting level
 */
function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export default function (eleventyConfig, options = {}) {
  // ===== DEFINE DEFAULTS (ONCE) =====
  const defaults = {
    // Asset output directory (relative to build output)
    outputDir: "assets/standard",

    // Copy framework files to output directory
    copyFiles: true,

    // Static assets directory (copied as-is to root)
    publicDir: "../public",

    // Languages to escape code blocks for
    escapeCodeBlocks: [],

    // Logging
    verbose: false,

    // Directory structure
    dirs: {
      input: "content",
      includes: "src/layouts",
      output: "_site",
    },

    sitemap: {
      enabled: true,
    },

    feed: {
      enabled: true,
    },

    manifest: {
      enabled: true,
    },

    robots: {
      enabled: true,
    },
    security: {
      enabled: true,
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
      permissions: {
        geolocation: [],
        camera: [],
        microphone: [],
        payment: [],
        usb: [],
      },
      xFrameOptions: "DENY",
      referrerPolicy: "strict-origin-when-cross-origin",
      enableCaching: true,
    },

    // Cloudflare Pages (functions + images)
    cloudflare: {
      functions: {
        enabled: false,
        outputDir: "functions",
        environment: "production",
        env: {},
      },
      images: {
        enabled: false,
        baseUrl: "",
        sizes: [640, 960, 1280, 1920],
        quality: 85,
        format: "auto",
        sharpen: 0.5,
        skipExternal: true,
        skipClass: "no-cdn",
        generateSrcset: true,
        lazyLoad: true,
        fit: "scale-down",
        skipInDev: true,
      },
      verbose: false,
    },

    // GitHub Comments System
    comments: {
      enabled: false,
      apiEndpoint: "/api/comments",
      commentsPath: "data/comments",
      version: pkg.version,
      clientLibrary: "", // Set dynamically based on outputDir
    },

    // Menu generation
    menu: {
      enabled: true,
    },
  };

  // ===== MERGE WITH USER OPTIONS (DEEP MERGE) =====
  const config = deepMerge(defaults, options);

  // Special handling for verbose (can be set at root or nested)
  if (options.verbose !== undefined) {
    config.verbose = options.verbose;
    config.cloudflare.verbose = options.verbose;
  }
  if (options.cloudflare?.verbose !== undefined) {
    config.cloudflare.verbose = options.cloudflare.verbose;
  }

  // Set client library path dynamically based on outputDir
  if (!config.comments.clientLibrary) {
    config.comments.clientLibrary = `/${config.outputDir}/standard.comment.js`;
  }

  const ENV = process.env.ENV || "PROD";
  const logger = createLogger({ verbose: config.verbose });

  // ===== BUILD BASE SITE DATA OBJECT =====
  const baseSite = {
    // Dynamic values
    now: new Date(),
    year: new Date().getFullYear(),
    env: ENV,

    // Standard Framework data (nested under standard key)
    standard: {
      // Merge entire config object
      ...config,

      // Framework version
      version: pkg.version,

      // Layout paths (for includes)
      layouts: {
        base: path.join(__dirname, "../layouts/base.njk"),
        meta: path.join(__dirname, "../layouts/meta.njk"),
        encrypted: path.join(__dirname, "../layouts/encrypted.njk"),
        pageError: path.join(__dirname, "../layouts/404.njk"),
        atomFeed: path.join(__dirname, "../layouts/atomfeed.xsl"),
      },
    },
  };

  // ===== LOAD USER SITE CONFIG & MERGE =====
  const userConfigPath = path.join(process.cwd(), "site.config.yml");
  let site = { ...baseSite }; // Start with base

  if (existsSync(userConfigPath)) {
    try {
      const configContent = readFileSync(userConfigPath, "utf-8");
      const userSiteData = yaml.load(configContent) || {};

      // Deep merge YAML into site (YAML wins on conflicts)
      site = deepMerge(baseSite, userSiteData);
      eleventyConfig.addWatchTarget(userConfigPath);

      logger.info("Site config loaded from site.config.yml");
    } catch (error) {
      logger.error(`Failed to parse site.config.yml: ${error.message}`);
    }
  }

  // ===== REGISTER GLOBAL DATA =====
  eleventyConfig.addGlobalData("site", site);
  eleventyConfig.addGlobalData("visibility", "public");

  // ===== PASSTHROUGH COPY =====

  // Copy public/ directory to root of _site/
  const publicPath = path.join(process.cwd(), site.standard.publicDir);
  if (existsSync(publicPath)) {
    eleventyConfig.addPassthroughCopy({
      [site.standard.publicDir]: ".", // Copy to root of output
    });
    logger.info(
      `Static assets: ${site.standard.publicDir} → ${site.standard.dirs.output}/`,
    );
  }

  // Copy Standard Framework assets (entire dist/ directory)
  if (site.standard.copyFiles) {
    eleventyConfig.addPassthroughCopy({
      [path.join(__dirname, "../../dist")]: site.standard.outputDir,
    });
    logger.info(`Standard assets: dist/ → ${site.standard.outputDir}/`);
  }

  // ===== WATCH TARGETS =====
  const srcPath = path.join(process.cwd(), "src");
  if (existsSync(srcPath)) {
    eleventyConfig.addWatchTarget("src/scss/");
    eleventyConfig.addWatchTarget("src/js/");
  }

  // ===== DEV SERVER OPTIONS =====
  eleventyConfig.setServerOptions({
    watch: [
      `${site.standard.dirs.output}/assets/**/*.css`,
      `${site.standard.dirs.output}/assets/**/*.js`,
      `!${site.standard.dirs.output}/assets/**/*.map`,
    ],
    notify: false,
    showVersion: true,
    injectChanges: false,
    port: 8090,
  });

  // ===== REGISTER PLUGINS =====
  eleventyConfig.addPlugin(PreProcessor, {
    escapeCodeBlocks: site.standard.escapeCodeBlocks,
  });
  eleventyConfig.addPlugin(Transform);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);
  eleventyConfig.addPlugin(Feed, site);
  eleventyConfig.addPlugin(Manifest, site);
  eleventyConfig.addPlugin(Sitemap, site);
  eleventyConfig.addPlugin(Robots, site);
  eleventyConfig.addPlugin(Security, site);
  eleventyConfig.addPlugin(ShortCode, {
    outputDir: site.standard.outputDir,
    comments: site.standard.comments,
  });
  eleventyConfig.addPlugin(MenuPlugin, site.standard.menu);
  eleventyConfig.addPlugin(Syntax);
  eleventyConfig.addPlugin(EncryptionPlugin);
  eleventyConfig.addPlugin(OpenRouterPlugin, site.standard.ai);

  // ===== CLOUDFLARE PAGES PLUGIN =====
  // Handles both functions AND image optimization
  if (
    site.standard.cloudflare.functions.enabled ||
    site.standard.cloudflare.images.enabled
  ) {
    eleventyConfig.addPlugin(CloudflarePagesPlugin, site.standard.cloudflare);

    // Auto-enable comments when Cloudflare functions are enabled
    if (site.standard.cloudflare.functions.enabled) {
      site.standard.comments.enabled = true;
      // Note: standard.comment.js already copied with dist/ directory
    }
  }

  // ===== NUNJUCKS CONFIG =====
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true,
  });

  // ===== BUILD COMPLETE BANNER =====
  eleventyConfig.on("eleventy.after", () => {
    logger.banner(pkg.version, "https://standard.ffp.co/cheat-sheet");
  });

  // ===== EXPOSE CONFIG =====
  globalThis.standardConfig = site.standard;
}
