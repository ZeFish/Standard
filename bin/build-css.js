#!/usr/bin/env node

/**
 * Build CSS Script - From Preprocessor to Production
 *
 * @group Build Tools
 * @author Francis Fontaine
 * @since 0.14.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "sass";
import CleanCSS from "clean-css";
import yaml from "js-yaml";
import Logger from "../core/logger.js";
import { generateTokens } from "./generate-tokens.js";

const logger = Logger({
  scope: "CSS",
});

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();

/**
 * Command-Line Flags
 */
const isWatch = process.argv.includes("--watch");
const isDev = process.argv.includes("--dev") || isWatch;
const shouldInjectVersion =
  process.argv.includes("--inject-version") || process.env.INJECT_VERSION;

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================

const configPath = path.join(projectRoot, "standard.config.yml");

if (!fs.existsSync(configPath)) {
  logger.info(`No standard.config.yml found. Skipping CSS build.`);
  process.exit(0);
}

let config = {};
let version = "0.0.0";

try {
  const configContent = fs.readFileSync(configPath, "utf-8");
  const fullConfig = yaml.load(configContent);
  config = fullConfig.build?.css || {};

  // Get version from package.json if injection is needed
  if (shouldInjectVersion || config.injectVersion) {
    try {
      const pkgPath = path.join(projectRoot, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        version = pkg.version;
      }
    } catch (e) {
      logger.warn(`Could not read package.json version: ${e.message}`);
    }
  }

  // Exit early if no CSS config section exists
  if (!config || Object.keys(config).length === 0) {
    logger.info(`No build.css configuration found. Skipping CSS build.`);
    process.exit(0);
  }
} catch (error) {
  logger.error(`Failed to parse standard.config.yml: ${error.message}`);
  process.exit(0);
}

// Validate required config
if (!config.files || !Array.isArray(config.files)) {
  logger.error(`Missing required 'files' array in build.css config`);
  process.exit(1);
}

const SCSS_FILES = config.files;
const BUNDLE_CONFIG = config.bundle;
const shouldBundle =
  BUNDLE_CONFIG && BUNDLE_CONFIG.files && BUNDLE_CONFIG.output;

if (shouldBundle) {
  logger.debug(
    `Bundling enabled: ${Array.isArray(BUNDLE_CONFIG.output) ? BUNDLE_CONFIG.output.join(", ") : BUNDLE_CONFIG.output}`,
  );
}

const colors = {
  reset: "\x1b[0m",
  grey: "\x1b[90m",
};

// ============================================================================
// BUILD FUNCTION
// ============================================================================

function stripCssComments(css) {
  return css.replace(/\/\*![\s\S]*?\*\/|\/\*[\s\S]*?\*\//g, "");
}

function removeEmptyRuleSets(css) {
  let prev;
  do {
    prev = css;
    css = css.replace(/[^{}]+\{\s*\}/g, "");
    css = css.replace(/@(?:media|supports|layer|keyframes)[^{]*\{\s*\}/g, "");
  } while (css !== prev);
  return css;
}

function injectVersion(css) {
  if (!shouldInjectVersion && !config.injectVersion) return css;
  const versionString = `/*! Standard::Framework v${version} */`;
  // Prepend the version banner
  return `${versionString}\n${css}`;
}

async function buildCSS() {
  try {
    // ========================================================================
    // PHASE 0: GENERATE DESIGN TOKENS
    // ========================================================================
    await generateTokens();

    // ========================================================================
    // PHASE 1: SCSS COMPILATION
    // ========================================================================
    for (const file of SCSS_FILES) {
      const inputPath = path.join(projectRoot, file.input);

      // Check if source file exists
      if (!fs.existsSync(inputPath)) {
        logger.error(`Source file not found: ${file.input}`);
        continue;
      }

      let result;
      // Handle simple CSS files vs SCSS compilation
      if (inputPath.endsWith(".scss")) {
        try {
          const compiled = compile(inputPath, {
            style: "expanded",
            loadPaths: ["node_modules"], // Added basic load path support
          });
          result = compiled.css;
        } catch (e) {
          logger.error(`Sass compilation failed for ${file.input}: ${e.message}`);
          continue;
        }
      } else {
        // Just read CSS file
        result = fs.readFileSync(inputPath, "utf8");
      }

      // Normalize
      result = result.replace(/^\uFEFF/, ""); // BOM
      result = result.replace(/@charset\s+("[^"]+"|'[^']+');?/gi, ""); // mid-file charset
      result = stripCssComments(result); // remove comments
      result = removeEmptyRuleSets(result); // remove empty blocks
      result = result.trim();
      result = injectVersion(result);

      // Determine output paths (normalize to array)
      const outputs = Array.isArray(file.output) ? file.output : [file.output];

      // Write to all destination directories
      for (const output of outputs) {
        const destPath = path.join(projectRoot, output);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.writeFileSync(destPath, result);
      }

      logger.success(
        `${file.input} ${colors.grey}(${(Buffer.byteLength(result) / 1024).toFixed(2)} KB)${outputs.length > 1 ? ` → ${outputs.length} dests` : ""}`,
      );
    }

    // ========================================================================
    // PHASE 2: CSS BUNDLING (OPTIONAL)
    // ========================================================================
    if (shouldBundle) {
      const cssContents = [];

      // Bundle config now likely points to outputs we just generated if paths are correct in config.
      // Or it might point to source files.
      // In standard.config.yml for bundle we have: "lib/modern-normalize.min.css", etc.
      // These are explicit paths relative to root.

      for (const filename of BUNDLE_CONFIG.files) {
        const filePath = path.join(projectRoot, filename);

        if (fs.existsSync(filePath)) {
          cssContents.push(fs.readFileSync(filePath, "utf8"));
        } else {
          logger.error(`Bundle file not found: ${filename}`);
        }
      }

      if (cssContents.length > 0) {
        let bundledCss = cssContents.join("\n\n");
        // Inject version in bundle too if not already present?
        bundledCss = injectVersion(bundledCss);

        // ====================================================================
        // PHASE 3: MINIFICATION
        // ====================================================================
        const minifier = new CleanCSS({
          level: 0, // Advanced optimizations (safe)
          compatibility: "*", // All browsers
        });

        const minified = minifier.minify(bundledCss);

        if (minified.errors.length > 0) {
          throw new Error(minified.errors.join("\n"));
        }

        const outputs = Array.isArray(BUNDLE_CONFIG.output)
          ? BUNDLE_CONFIG.output
          : [BUNDLE_CONFIG.output];

        // Write bundle to all destination directories
        for (const output of outputs) {
          const destPath = path.join(projectRoot, output);
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.writeFileSync(destPath, minified.styles);
        }

        const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
        logger.success(
          `Bundle ${colors.grey}(${minifiedSize.toFixed(2)} KB)${outputs.length > 1 ? ` → ${outputs.length} dests` : ""}`,
        );
      }
    }

    if (!isWatch) logger.info(`Completed`);
  } catch (error) {
    logger.error(`Build failed:`, error.message);
    process.exit(1);
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

await buildCSS();

if (isWatch) {
  logger.info(`Watching...`);

  // Simple watch on input files directories
  const distinctDirs = new Set();
  SCSS_FILES.forEach((f) =>
    distinctDirs.add(path.dirname(path.join(projectRoot, f.input))),
  );

  // Watch bundle sources if different?
  // Usually bundle sources are output of SCSS steps or explicit libs
  // Watch SCSS source dirs is usually enough.

  for (const dir of distinctDirs) {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, async (eventType, filename) => {
        if (
          filename &&
          (filename.endsWith(".scss") || filename.endsWith(".css"))
        ) {
          logger.info(`Changed: ${filename}`);
          await buildCSS();
        }
      });
    }
  }
}
