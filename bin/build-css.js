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
 *   Falls back to sensible defaults if config is missing
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

const prefix = `${colors.grey}::std  ${colors.reset}${colors.cyan}[CSS]${colors.reset} `;

// ========================================
// LOAD CONFIGURATION FROM site.config.yml
// ========================================

let config = {};
const configPath = path.join(projectRoot, "site.config.yml");

if (fs.existsSync(configPath)) {
  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const fullConfig = yaml.load(configContent);
    config = fullConfig.build?.css || {};

    // Override distDir if outputDir is specified in config
    if (config.srcDir) {
      srcDir = path.join(projectRoot, config.srcDir);
    }
    // Override distDir if outputDir is specified in config
    if (config.outputDir) {
      destDir = path.join(projectRoot, config.outputDir);
    }
  } catch (error) {
    console.warn(
      `${prefix}⚠️  Failed to parse site.config.yml: ${error.message}`,
    );
    console.warn(`${prefix}⚠️  Using fallback configuration`);
  }
}

// Fallback configuration if site.config.yml is missing
const SCSS_FILES = config.files || [
  {
    input: "standard.scss",
    output: "standard.min.css",
  },
  {
    input: "standard.theme.scss",
    output: "standard.theme.min.css",
  },
];

const BUNDLE_CONFIG = config.bundle || {
  files: ["standard.min.css", "standard.theme.min.css"],
  output: "standard.bundle.css",
};

const BUNDLE_FILES = BUNDLE_CONFIG.files;
const BUNDLE_OUTPUT = BUNDLE_CONFIG.output;

// Override distDir based on mode
if (isDev && config.devOutputDir) {
  destDir = path.join(projectRoot, config.devOutputDir);
} else if (isDev) {
  // Default dev output: straight to _site
  destDir = path.join(projectRoot, "_site/assets/standard");
} else if (config.outputDir) {
  destDir = path.join(projectRoot, config.outputDir);
}

// ========================================

async function buildCSS() {
  //console.log(`${prefix}🎨 Building CSS files...`);

  // Ensure dist exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    // Step 1: Compile SCSS files
    //console.log(`${prefix}📦 Step 1: Compiling SCSS`);

    for (const file of SCSS_FILES) {
      const result = compile(path.join(srcDir, file.input), {
        style: "compressed",
      });

      fs.writeFileSync(path.join(destDir, file.output), result.css);

      console.log(
        `${prefix}${colors.grey}${file.output} ${colors.reset}(${(Buffer.byteLength(result.css) / 1024).toFixed(2)} KB)`,
      );
    }

    // Step 2: Bundle CSS files
    //console.log(`${prefix}📦 Step 2: Bundling CSS`);

    const cssContents = BUNDLE_FILES.map((filename) => {
      return fs.readFileSync(path.join(destDir, filename), "utf8");
    });

    const bundledCss = cssContents.join("\n\n");

    // Step 3: Minify bundle
    //console.log(`${prefix}📦 Step 3: Minifying bundle`);

    const minifier = new CleanCSS({
      level: 2,
      compatibility: "*",
    });

    const minified = minifier.minify(bundledCss);

    if (minified.errors.length > 0) {
      throw new Error(minified.errors.join("\n"));
    }

    fs.writeFileSync(path.join(destDir, BUNDLE_OUTPUT), minified.styles);

    const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
    console.log(
      `${prefix}${colors.grey}${BUNDLE_OUTPUT} ${colors.reset}(${minifiedSize.toFixed(2)} KB)`,
    );

    if (!isWatch) console.log(`${prefix}Completed`);
  } catch (error) {
    console.error(`${prefix}❌ CSS build failed:`, error.message);
    process.exit(1);
  }
}

// Initial build
await buildCSS();

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
    if (filename && filename.endsWith(".scss")) {
      console.log(`${prefix}Changed: ${filename}`);
      await buildCSS();
      triggerBrowserReload();
    }
  });
}
