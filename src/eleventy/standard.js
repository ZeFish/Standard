import "dotenv/config";
import nunjucks from "nunjucks";
import * as sass from "sass";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import yaml from "js-yaml";

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
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

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
 * @param {object} options.dirs Directory configuration
 * @param {string} options.dirs.input Content directory (default: content)
 * @param {string} options.dirs.includes Layouts directory (default: ../src/layouts)
 * @param {string} options.dirs.output Build output directory (default: _site)
 * @param {string} options.publicDir Static assets directory (default: ../public)
 * @param {object} options.cloudflare Cloudflare Functions config (default: { enabled: false })
 * @param {object} options.comments GitHub Comments config
 * @param {boolean} options.comments.enabled Enable comments system (default: false)
 * @param {string} options.comments.apiEndpoint API endpoint path (default: "/api/comments")
 * @param {string} options.comments.commentsPath GitHub storage path (default: "data/comments")
 * @param {object} options.images Image optimization config
 * @param {object} options.menu Menu generation config
 * @param {boolean} options.verbose Enable verbose logging (default: false)
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
 * // Zero config (uses all defaults)
 * import Standard from "@zefish/standard";
 *
 * export default function (eleventyConfig) {
 *   eleventyConfig.addPlugin(Standard);
 * }
 *
 * // Custom directories
 * eleventyConfig.addPlugin(Standard, {
 *   dirs: {
 *     input: "src/content",
 *     includes: "../templates"
 *   },
 *   publicDir: "../assets"
 * });
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
 *     commentsPath: "data/comments"
 *   }
 * });
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  // ===== SMART DEFAULTS =====
  const config = {
    // Asset output directory (relative to build output)
    outputDir: "assets/standard",

    // Copy files from node_modules vs use CDN
    copyFiles: true,
    useCDN: false,

    // Static assets (copied as-is)
    publicDir: "../public", // 📦 Images, fonts, static files

    // Languages to escape code blocks for
    escapeCodeBlocks: [],

    // Cloudflare Functions
    cloudflare: {
      enabled: false,
      outputDir: "functions",
      environment: "production",
    },

    // GitHub Comments System
    comments: {
      enabled: false,
      apiEndpoint: "/api/comments",
      commentsPath: "data/comments",
      version: pkg.version,
    },

    // Image optimization
    images: {
      enabled: false,
      cdn: "cloudflare",
      baseUrl: "",
      sizes: [640, 960, 1280, 1920],
      quality: 85,
      format: "auto",
    },

    // Menu generation
    menu: {
      enabled: true,
    },

    // Logging
    verbose: false,

    // Merge user options (deep merge)
    ...options,
    dirs: {
      input: "content",
      includes: "src/layouts",
      output: "_site",
      ...options.dirs,
    },
    cloudflare: {
      enabled: false,
      outputDir: "functions",
      environment: "production",
      ...options.cloudflare,
    },
    comments: {
      enabled: false,
      apiEndpoint: "/api/comments",
      commentsPath: "data/comments",
      version: pkg.version,
      ...options.comments,
    },
    images: {
      enabled: false,
      cdn: "cloudflare",
      baseUrl: "",
      sizes: [640, 960, 1280, 1920],
      quality: 85,
      format: "auto",
      ...options.images,
    },
    menu: { enabled: true, ...options.menu },
  };

  // Set client library path after outputDir is merged
  if (!config.comments.clientLibrary) {
    config.comments.clientLibrary = `/${config.outputDir}/standard.comment.js`;
  }

  const ENV = process.env.ENV || "PROD";
  const logger = createLogger({ verbose: config.verbose });

  // ===== LOAD USER SITE CONFIG =====
  const userConfigPath = path.join(process.cwd(), "site.config.yml");
  let userSiteData = {};

  if (existsSync(userConfigPath)) {
    try {
      const configContent = readFileSync(userConfigPath, "utf-8");
      userSiteData = yaml.load(configContent) || {};
      logger.info("Config loaded");
    } catch (error) {
      logger.error(`Failed to parse site.config.yml: ${error.message}`);
    }
  }

  // ===== SINGLE UNIFIED SITE OBJECT =====
  // Everything in one place, properly organized
  eleventyConfig.addGlobalData("site", {
    // User's site data (title, author, url, etc.)
    ...userSiteData,

    now: new Date(),
    year: new Date().getFullYear(),

    // Environment
    env: ENV,

    // Standard Framework data (nested under standard key)
    standard: {
      // Merge entire config object at this level
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
        sitemap: path.join(__dirname, "../layouts/sitemap.xml.njk"),
      },
    },
  });
  /*
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    stylesheet: "/pretty-atom-feed.xsl",
    collection: { name: "public", limit: 10 },
    site: {
      language: userSiteData.language,
      title: userSiteData.title,
      subtitle: userSiteData.description,
      base: userSiteData.url,
      author: { name: userSiteData.author.name },
    },
  });
*/
  // ===== DIRECTORY STRUCTURE =====
  //eleventyConfig.addGlobalData("layout", "base");
  eleventyConfig.addGlobalData("visibility", "public");
  //eleventyConfig.addGlobalData("theme", "swiss");
  // ===== PASSTHROUGH COPY =====

  // Copy public/ directory to root of _site/
  // (Vite/Astro-style: public/images/logo.svg → _site/images/logo.svg)
  const publicPath = path.join(process.cwd(), config.publicDir);
  if (existsSync(publicPath)) {
    eleventyConfig.addPassthroughCopy({
      [config.publicDir]: ".", // Copy to root of output
    });
    logger.info(`Static assets: ${config.publicDir} → ${config.dirs.output}/`);
  }

  // Copy Standard Framework assets
  if (config.copyFiles && !config.useCDN) {
    eleventyConfig.addPassthroughCopy({
      [path.join(__dirname, "../../dist/standard.min.css")]:
        `${config.outputDir}/standard.min.css`,
      [path.join(__dirname, "../../dist/standard.bundle.css")]:
        `${config.outputDir}/standard.bundle.css`,
      [path.join(__dirname, "../../dist/standard.theme.min.css")]:
        `${config.outputDir}/standard.theme.min.css`,
      [path.join(__dirname, "../../dist/standard.min.js")]:
        `${config.outputDir}/standard.min.js`,
      [path.join(__dirname, "../../dist/standard.bundle.js")]:
        `${config.outputDir}/standard.bundle.js`,
      [path.join(__dirname, "../../dist/standard.bundle.full.js")]:
        `${config.outputDir}/standard.bundle.full.js`,
      [path.join(__dirname, "../../dist/standard.lab.js")]:
        `${config.outputDir}/standard.lab.js`,
    });
  }

  // ===== WATCH TARGETS =====
  // Watch src/ directories even though they're outside input
  // (Triggers rebuild when SCSS/JS/layouts change)
  const srcPath = path.join(process.cwd(), "src");
  if (existsSync(srcPath)) {
    eleventyConfig.addWatchTarget("src/scss/");
    eleventyConfig.addWatchTarget("src/js/");
    // Layouts are already watched by 11ty via includes setting
  }

  // ===== DEV SERVER OPTIONS =====
  // Hot-reload compiled assets without full rebuild
  eleventyConfig.setServerOptions({
    // Watch compiled CSS/JS in output directory
    watch: [
      `${config.dirs.output}/assets/**/*.css`,
      `${config.dirs.output}/assets/**/*.js`,
      `!${config.dirs.output}/assets/**/*.map`, // Ignore sourcemaps
    ],

    // Don't show "Connected to BrowserSync" notifications
    notify: false,

    // Show which files changed in terminal
    showVersion: true,

    // Inject CSS changes without full page reload (faster)
    injectChanges: false,

    // Custom port (optional)
    port: 8090,
  });

  // ===== REGISTER PLUGINS =====
  eleventyConfig.addPlugin(PreProcessor, {
    escapeCodeBlocks: config.escapeCodeBlocks,
  });
  eleventyConfig.addPlugin(Transform);
  eleventyConfig.addPlugin(Filter);
  eleventyConfig.addPlugin(Backlinks);
  eleventyConfig.addPlugin(Markdown);
  eleventyConfig.addPlugin(EleventyNavigationPlugin);
  eleventyConfig.addPlugin(ShortCode, {
    outputDir: config.outputDir,
    comments: config.comments,
  });
  eleventyConfig.addPlugin(MenuPlugin, config.menu);
  eleventyConfig.addPlugin(Syntax);
  eleventyConfig.addPlugin(EncryptionPlugin);

  // ===== IMAGE OPTIMIZATION =====
  if (config.images?.enabled) {
    eleventyConfig.addPlugin(Image, config.images);
  }

  // ===== CLOUDFLARE FUNCTIONS =====
  if (config.cloudflare.enabled) {
    eleventyConfig.addPlugin(CloudflarePlugin, {
      outputDir: config.cloudflare.outputDir,
      environment: config.cloudflare.environment,
      env: config.cloudflare.env || {},
    });

    // Auto-enable comments when Cloudflare is enabled
    config.comments.enabled = true;

    // Copy comments client library
    const commentsClient = path.join(
      __dirname,
      "../../dist/standard.comment.js",
    );
    eleventyConfig.addPassthroughCopy({
      [commentsClient]: `${config.outputDir}/standard.comment.js`,
    });
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
  // Store config globally so caller can access it after addPlugin
  globalThis.standardConfig = config;
}
