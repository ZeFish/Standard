import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import yaml from "js-yaml";
import EleventyNavigationPlugin from "@11ty/eleventy-navigation";

import Backlinks from "./backlinks.js";
import Markdown from "./markdown.js";
import Filter from "./eleventy/filter.js";
import ShortCode from "./eleventy/shortcode.js";
import PreProcessor from "./eleventy/preprocessor.js";
import Transform from "./eleventy/transform.js";
import OpenRouter from "./openrouter.js";
import CloudflarePages from "./cloudflare.js";
import MenuPlugin from "./menu.js";
import Syntax from "./syntax.js";
import Logger from "./logger.js";
import Encryption from "./encryption.js";
import Sitemap from "./meta/sitemap.js";
import Feed from "./meta/feed.js";
import Manifest from "./meta/manifest.js";
import Robots from "./meta/robots.js";
import Security from "./meta/security.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, "../../package.json"), "utf-8"),
);

// Helpers
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      output[key] = isObject(source[key])
        ? key in target
          ? deepMerge(target[key], source[key])
          : source[key]
        : source[key];
    });
  }
  return output;
}

// Defaults (unchanged)
const defaults = {
  outputDir: "assets/standard",
  publicDir: "../public",
  escapeCodeBlocks: [],
  verbose: false,
  dirs: {
    input: "content",
    includes: "src/layouts",
    output: "_site",
  },
  sitemap: { enabled: true },
  feed: { enabled: true },
  manifest: { enabled: true },
  robots: { enabled: true },
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
  },
  comments: {
    enabled: false,
    apiEndpoint: "/api/comments",
    commentsPath: "data/comments",
    version: pkg.version,
    clientLibrary: "",
  },
  menu: { enabled: true },
};

export default function (eleventyConfig, options = {}) {
  // 1) Normalize standard config (defaults + options)
  const standard = deepMerge(defaults, options);

  // Derived fields
  if (!standard.comments.clientLibrary) {
    standard.comments.clientLibrary = `/${standard.outputDir}/standard.comment.js`;
  }
  standard.version = pkg.version;

  standard.layouts = {
    base: path.join(__dirname, "../layouts/base.njk"),
    meta: path.join(__dirname, "../layouts/meta.njk"),
    encrypted: path.join(__dirname, "../layouts/encrypted.njk"),
    pageError: path.join(__dirname, "../layouts/404.njk"),
    atomFeed: path.join(__dirname, "../layouts/atomfeed.xsl"),
  };

  const ENV = process.env.ENV || "PROD";

  // 2) Build initial site object once
  let site = {
    now: new Date(),
    year: new Date().getFullYear(),
    env: ENV,
    standard,
  };
  let logger = Logger({ verbose: site.standard.verbose });
  // 3) Merge site.config.yml over it (highest priority)
  const userConfigPath = path.join(process.cwd(), "site.config.yml");
  if (existsSync(userConfigPath)) {
    try {
      const userSiteData =
        yaml.load(readFileSync(userConfigPath, "utf-8")) || {};
      site = deepMerge(site, userSiteData);
      logger = Logger({ verbose: site.standard?.verbose === true });
      eleventyConfig.addWatchTarget(userConfigPath);
      logger.debug("Config loaded");
    } catch (error) {
      logger.error(`Failed to parse site.config.yml: ${error.message}`);
    }
  }

  // 4) Global data
  eleventyConfig.addGlobalData("site", site);
  eleventyConfig.addGlobalData("visibility", "public");

  // 5) Passthrough copy (public)
  const publicPath = path.join(process.cwd(), site.standard.publicDir);
  if (existsSync(publicPath)) {
    eleventyConfig.addPassthroughCopy({ [site.standard.publicDir]: "." });
    logger.debug(
      `Static assets: ${site.standard.publicDir} → ${site.standard.dirs.output}/`,
    );
  }

  // 6) Passthrough copy (dist -> outputDir)
  eleventyConfig.addPassthroughCopy({
    [path.join(__dirname, "../../dist")]: site.standard.outputDir,
  });
  logger.debug(`Standard assets: dist/ → ${site.standard.outputDir}/`);

  // 7) Watch targets
  const srcPath = path.join(process.cwd(), "src");
  if (existsSync(srcPath)) {
    eleventyConfig.addWatchTarget("src/scss/");
    eleventyConfig.addWatchTarget("src/js/");
  }

  // 8) Plugins
  eleventyConfig.addPlugin(OpenRouter, site);
  eleventyConfig.addPlugin(PreProcessor, site);
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
  eleventyConfig.addPlugin(ShortCode, site);
  eleventyConfig.addPlugin(MenuPlugin, site);
  eleventyConfig.addPlugin(Syntax, site);
  eleventyConfig.addPlugin(Encryption);

  eleventyConfig.addPlugin(CloudflarePages, site); // self-guarded

  // 9) Nunjucks
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true,
  });

  // 10) Banner
  eleventyConfig.on("eleventy.after", () => {
    logger.banner(pkg.version, "https://standard.ffp.co/cheat-sheet");
  });

  // Optional: expose config
  globalThis.standardConfig = site.standard;
}
