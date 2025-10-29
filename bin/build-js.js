#!/usr/bin/env node

/**
 * @component Build JavaScript Script (Exportable for plugin users)
 * @category Build Tools
 * @description Minifies and bundles JavaScript files for projects using Standard Framework.
 * Can be used by plugin users in their own projects via their package.json scripts.
 *
 * Usage:
 *   standard-build-js              # Build once
 *   standard-build-js --watch      # Watch mode
 *
 * Configuration:
 *   Read from ./site.config.yml in the project root (build.js section)
 *   Exits if no config found
 *
 * @since 0.14.0
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();
let srcDir = path.join(projectRoot, "src/js");
let destDir = path.join(projectRoot, "public/assets/js");

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

const prefix = `${colors.grey}::std  ${colors.reset}${colors.cyan}[JS ]${colors.reset} `;

// ========================================
// LOAD CONFIGURATION FROM site.config.yml
// ========================================

const configPath = path.join(projectRoot, "site.config.yml");

// Exit early if no config file
if (!fs.existsSync(configPath)) {
  console.log(`${prefix}No site.config.yml found. Skipping JS build.`);
  process.exit(0);
}

let config = {};

try {
  const configContent = fs.readFileSync(configPath, "utf-8");
  const fullConfig = yaml.load(configContent);
  config = fullConfig.build?.js || {};

  // Exit early if no JS config section exists
  if (!config || Object.keys(config).length === 0) {
    console.log(`${prefix}No build.js configuration found. Skipping JS build.`);
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
    `${prefix}❌ Missing required 'files' array in build.js config`,
  );
  process.exit(1);
}

const JS_FILES = config.files;

// Bundling is optional
const BUNDLES = config.bundles || [];
const shouldBundle = BUNDLES.length > 0;

if (shouldBundle) {
  console.log(`${prefix}Bundling enabled: ${BUNDLES.length} bundle(s)`);
}

// ========================================

async function buildJS() {
  // Ensure dest directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    // Step 1: Build individual files
    for (const file of JS_FILES) {
      const inputPath = path.join(srcDir, file.input);
      const outputPath = path.join(destDir, file.output);

      // Check if source file exists
      if (!fs.existsSync(inputPath)) {
        console.warn(`${prefix}⚠️  Source file not found: ${file.input}`);
        continue;
      }

      const source = fs.readFileSync(inputPath, "utf8");

      if (file.minify) {
        const result = await minify(source, {
          compress: true,
          mangle: true,
        });

        if (result.error) {
          console.error(
            `${prefix}❌ Minification failed for ${file.input}:`,
            result.error,
          );
          continue;
        }

        fs.writeFileSync(outputPath, result.code);
        console.log(
          `${prefix}${colors.grey}${file.output} ${colors.reset}(${(Buffer.byteLength(result.code) / 1024).toFixed(2)} KB)`,
        );
      } else {
        fs.copyFileSync(inputPath, outputPath);
        console.log(
          `${prefix}${colors.grey}${file.output} ${colors.reset}(copied)`,
        );
      }
    }

    // Step 2: Create bundles (optional)
    if (shouldBundle) {
      for (const bundle of BUNDLES) {
        const contents = [];

        for (const filepath of bundle.files) {
          // Handle both absolute and relative paths
          const fullPath = path.isAbsolute(filepath)
            ? filepath
            : filepath.startsWith("node_modules")
              ? path.join(projectRoot, filepath)
              : path.join(projectRoot, filepath);

          if (!fs.existsSync(fullPath)) {
            console.warn(`${prefix}⚠️  Bundle file not found: ${filepath}`);
            continue;
          }

          contents.push(fs.readFileSync(fullPath, "utf8"));
        }

        if (contents.length === 0) {
          console.warn(
            `${prefix}⚠️  No files found for bundle: ${bundle.name}`,
          );
          continue;
        }

        const bundled = contents.join("\n\n");
        const minified = await minify(bundled, {
          compress: true,
          mangle: true,
        });

        if (minified.error) {
          console.error(
            `${prefix}❌ Bundle minification failed for ${bundle.name}:`,
            minified.error,
          );
          continue;
        }

        fs.writeFileSync(path.join(destDir, bundle.name), minified.code);

        console.log(
          `${prefix}${colors.grey}${bundle.name} ${colors.reset}(${(Buffer.byteLength(minified.code) / 1024).toFixed(2)} KB)`,
        );
      }
    }

    if (!isWatch) console.log(`${prefix}Completed`);
  } catch (error) {
    console.error(`${prefix}❌ JavaScript build failed:`, error.message);
    process.exit(1);
  }
}

// Initial build
await buildJS();

// Watch mode
if (isWatch) {
  console.log(`${prefix}Watching...`);

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      console.log(`${prefix}Changed: ${filename}`);
      await buildJS();
    }
  });
}
