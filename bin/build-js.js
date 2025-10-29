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
 *   Falls back to sensible defaults if config is missing
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
const srcDir = path.join(projectRoot, "src/js");
let distDir = path.join(projectRoot, "dist");

const isWatch = process.argv.includes("--watch");
const isDev = process.argv.includes("--dev") || isWatch; // --dev or --watch = dev mode



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

let config = {};
const configPath = path.join(projectRoot, "site.config.yml");

if (fs.existsSync(configPath)) {
  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const fullConfig = yaml.load(configContent);
    config = fullConfig.build?.js || {};

    // Override distDir if outputDir is specified in config
    if (config.outputDir) {
      distDir = path.join(projectRoot, config.outputDir);
    }
  } catch (error) {
    console.warn(
      `${prefix}⚠️  Failed to parse site.config.yml: ${error.message}`,
    );
    console.warn(`${prefix}⚠️  Using fallback configuration`);
  }
}

// Fallback configuration if site.config.yml is missing
const JS_FILES = config.files || [
  {
    input: "standard.js",
    output: "standard.min.js",
    minify: true,
  },
  {
    input: "standard.comment.js",
    output: "standard.comment.js",
    minify: true,
  },
  {
    input: "standard.lab.js",
    output: "standard.lab.js",
    minify: false,
  },
];

const BUNDLES = config.bundles || [
  {
    name: "standard.bundle.js",
    files: [
      "node_modules/htmx.org/dist/htmx.min.js",
      "node_modules/htmx.org/dist/ext/preload.js",
      "dist/standard.min.js",
    ],
  },
  {
    name: "standard.bundle.full.js",
    files: [
      "node_modules/htmx.org/dist/htmx.min.js",
      "node_modules/htmx.org/dist/ext/preload.js",
      "dist/standard.min.js",
      "dist/standard.comment.js",
      "src/js/standard.toast.js",
    ],
  },
];


// Override distDir based on mode
if (isDev && config.devOutputDir) {
  distDir = path.join(projectRoot, config.devOutputDir);
} else if (isDev) {
  // Default dev output: straight to _site
  distDir = path.join(projectRoot, "_site/assets/standard");
} else if (config.outputDir) {
  distDir = path.join(projectRoot, config.outputDir);
}

// ========================================

async function buildJS() {
  //console.log(`${prefix}🔨 Building JavaScript files...`);

  // Ensure dist exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Step 1: Build individual files
    //console.log(`${prefix}📦 Step 1: Building individual files`);

    for (const file of JS_FILES) {
      const inputPath = path.join(srcDir, file.input);
      const outputPath = path.join(distDir, file.output);
      const source = fs.readFileSync(inputPath, "utf8");

      if (file.minify) {
        const result = await minify(source, {
          compress: true,
          mangle: true,
        });
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

    // Step 2: Create bundles
    //console.log(`${prefix}📦 Step 2: Creating bundles`);

    for (const bundle of BUNDLES) {
      const contents = bundle.files.map((filepath) => {
        // Handle both absolute and relative paths
        const fullPath = filepath.startsWith("node_modules")
          ? path.join(projectRoot, filepath)
          : path.join(projectRoot, filepath);

        return fs.readFileSync(fullPath, "utf8");
      });

      const bundled = contents.join("\n\n");
      const minified = await minify(bundled, {
        compress: true,
        mangle: true,
      });

      fs.writeFileSync(path.join(distDir, bundle.name), minified.code);

      console.log(
        `${prefix}${colors.grey}${bundle.name} ${colors.reset}(${(Buffer.byteLength(minified.code) / 1024).toFixed(2)} KB)`,
      );
    }

    if (!isWatch) console.log(`${prefix}Completed`);
  } catch (error) {
    console.error(`${prefix}❌ JavaScript build failed:`, error.message);
    process.exit(1);
  }
}

// Initial build
await buildJS();

// Trigger browser reload by touching a trigger file
function triggerBrowserReload() {
  try {
    const triggerFile = path.join(projectRoot, "_site/.trigger-reload");
    const now = new Date();

    // Create or touch the trigger file
    if (!fs.existsSync(triggerFile)) {
      fs.writeFileSync(triggerFile, now.toISOString());
    } else {
      fs.utimesSync(triggerFile, now, now);
    }
  } catch (error) {
    // Ignore errors - reload is best-effort
  }
}

// Watch mode
if (isWatch) {
  console.log(`${prefix}Watching...`);

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      console.log(`${prefix}Changed: ${filename}`);
      await buildJS();
      triggerBrowserReload();
    }
  });
}
