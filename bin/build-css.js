#!/usr/bin/env node

/**
 * @component Build CSS Script (Exportable for plugin users)
 * @category Build Tools
 * @description Compiles SCSS and bundles CSS files for projects using Standard Framework.
 * Can be used by plugin users in their own projects via their package.json scripts.
 *
 * Usage:
 *   standard-build-css              # Build once
 *   standard-build-css --watch      # Watch mode
 *
 * Configuration:
 *   Read from ./site.config.yml in the project root (build.css section)
 *   Exits if no config found
 *
 * @since 0.14.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "sass";
import CleanCSS from "clean-css";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();
let srcDir = path.join(projectRoot, "src/styles");
let destDir = path.join(projectRoot, "public/assets/css");

const isWatch = process.argv.includes("--watch");
const isDev = process.argv.includes("--dev") || isWatch;

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  grey: "\x1b[90m",
  white: "\x1b[97m",
};

const prefix = `${colors.grey}::std  ${colors.reset}${colors.cyan}[CSS]${colors.reset} `;

// ========================================
// LOAD CONFIGURATION FROM site.config.yml
// ========================================

const configPath = path.join(projectRoot, "site.config.yml");

// Exit early if no config file
if (!fs.existsSync(configPath)) {
  console.log(`${prefix}No site.config.yml found. Skipping CSS build.`);
  process.exit(0);
}

let config = {};

try {
  const configContent = fs.readFileSync(configPath, "utf-8");
  const fullConfig = yaml.load(configContent);
  config = fullConfig.build?.css || {};

  // Exit early if no CSS config section exists
  if (!config || Object.keys(config).length === 0) {
    console.log(
      `${prefix}No build.css configuration found. Skipping CSS build.`,
    );
    process.exit(0);
  }

  // Override directories if specified in config
  if (config.srcDir) {
    srcDir = path.join(projectRoot, config.srcDir);
  }
  if (config.outputDir) {
    destDir = path.join(projectRoot, config.outputDir);
  }
} catch (error) {
  console.error(
    `${prefix}❌ Failed to parse site.config.yml: ${error.message}`,
  );
  process.exit(1);
}

// Validate required config
if (!config.files || !Array.isArray(config.files)) {
  console.error(
    `${prefix}❌ Missing required 'files' array in build.css config`,
  );
  process.exit(1);
}

const SCSS_FILES = config.files;

// Bundling is optional
const BUNDLE_CONFIG = config.bundle;
const shouldBundle =
  BUNDLE_CONFIG && BUNDLE_CONFIG.files && BUNDLE_CONFIG.output;

if (shouldBundle) {
  console.log(`${prefix}Bundling enabled: ${BUNDLE_CONFIG.output}`);
}

// ========================================

async function buildCSS() {
  // Ensure dest directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    // Step 1: Compile SCSS files
    for (const file of SCSS_FILES) {
      const inputPath = path.join(srcDir, file.input);

      // Check if source file exists
      if (!fs.existsSync(inputPath)) {
        console.warn(`${prefix}⚠️  Source file not found: ${file.input}`);
        continue;
      }

      const result = compile(inputPath, {
        style: "compressed",
      });

      fs.writeFileSync(path.join(destDir, file.output), result.css);

      console.log(
        `${prefix}${colors.grey}${file.output} ${colors.reset}(${(Buffer.byteLength(result.css) / 1024).toFixed(2)} KB)`,
      );
    }

    // Step 2: Bundle CSS files (optional)
    if (shouldBundle) {
      const cssContents = [];

      for (const filename of BUNDLE_CONFIG.files) {
        const filePath = path.join(destDir, filename);

        if (fs.existsSync(filePath)) {
          cssContents.push(fs.readFileSync(filePath, "utf8"));
        } else {
          console.warn(`${prefix}⚠️  Bundle file not found: ${filename}`);
        }
      }

      if (cssContents.length > 0) {
        const bundledCss = cssContents.join("\n\n");

        // Step 3: Minify bundle
        const minifier = new CleanCSS({
          level: 2,
          compatibility: "*",
        });

        const minified = minifier.minify(bundledCss);

        if (minified.errors.length > 0) {
          throw new Error(minified.errors.join("\n"));
        }

        fs.writeFileSync(
          path.join(destDir, BUNDLE_CONFIG.output),
          minified.styles,
        );

        const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
        console.log(
          `${prefix}${colors.grey}${BUNDLE_CONFIG.output} ${colors.reset}(${minifiedSize.toFixed(2)} KB)`,
        );
      }
    }

    if (!isWatch) console.log(`${prefix}Completed`);
  } catch (error) {
    console.error(`${prefix}❌ CSS build failed:`, error.message);
    process.exit(1);
  }
}

// Initial build
await buildCSS();

// Watch mode
if (isWatch) {
  console.log(`${prefix}Watching...`);

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".scss")) {
      console.log(`${prefix}Changed: ${filename}`);
      await buildCSS();
    }
  });
}
