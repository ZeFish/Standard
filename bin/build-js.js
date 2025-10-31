#!/usr/bin/env node

/**
 * Build JavaScript Script - From Source to Production
 *
 * @group Build Tools
 * @author Francis Fontaine
 * @since 0.14.0
 *
 * In 1995, Brendan Eich created JavaScript in just 10 days at Netscape. It was
 * meant to be a simple scripting language for browser interactions—nothing more.
 * But JavaScript refused to stay simple. By 2010, web applications had become
 * massive, with hundreds of kilobytes of JavaScript code. Every byte mattered
 * because users on 3G connections waited seconds for pages to load. The solution?
 * Minification—aggressively compressing JavaScript by removing whitespace,
 * shortening variable names, and eliminating dead code.
 *
 * This build script is your JavaScript optimization pipeline. It takes readable
 * source code (with descriptive variable names, comments, proper formatting) and
 * transforms it into production-ready code that's 40-70% smaller. Think of it as
 * a translator that speaks two dialects of JavaScript: "human" and "machine."
 * Humans read the source, machines execute the minified version.
 *
 * The script does three things brilliantly: First, it minifies individual files
 * using Terser, the modern successor to UglifyJS. Terser understands ES6+ syntax
 * (classes, arrow functions, async/await) and applies hundreds of micro-optimizations.
 * Second, it can bundle multiple files into one—reducing HTTP requests and enabling
 * better compression. Third, it watches for changes, rebuilding instantly so your
 * development workflow stays fluid.
 *
 * Like its CSS sibling, this script reads configuration from site.config.yml and
 * fails gracefully when not needed. No config? No problem—it exits silently. This
 * makes it safe to include in any project's build pipeline without breaking builds.
 *
 * ### Future Improvements
 *
 * - Generate source maps for debugging minified code
 * - Add tree shaking to eliminate unused exports
 * - Support ES module bundling with import/export resolution
 * - Implement code splitting for lazy-loaded modules
 * - Add transpilation with Babel for older browsers
 * - Include bundle size analysis and warnings
 *
 * @see {file} site.config.yml - Configuration file structure
 * @see {package} terser - Modern JavaScript minifier
 * @see {file} build-css.js - Companion CSS build script
 *
 * @link https://terser.org/ Terser Documentation
 * @link https://github.com/terser/terser Terser Repository
 *
 * @example bash - Basic usage
 *   # Build once and exit
 *   node scripts/build-js.js
 *
 *   # Watch mode (rebuilds on file changes)
 *   node scripts/build-js.js --watch
 *
 *   # Development mode (enables watch + dev flags)
 *   node scripts/build-js.js --dev
 *
 * @example yaml - Configuration in site.config.yml
 *   build:
 *     js:
 *       srcDir: "src/js"              # JavaScript source directory
 *       outputDir: "public/assets/js" # Compiled JS destination
 *       files:
 *         - input: "main.js"
 *           output: "main.min.js"
 *           minify: true
 *         - input: "analytics.js"
 *           output: "analytics.js"
 *           minify: false              # Copy without minifying
 *       bundles:                       # Optional bundling
 *         - name: "app.min.js"
 *           files:
 *             - "src/js/utils.js"
 *             - "src/js/components.js"
 *             - "src/js/main.js"
 *
 * @example json - NPM script integration
 *   {
 *     "scripts": {
 *       "build:js": "node scripts/build-js.js",
 *       "watch:js": "node scripts/build-js.js --watch",
 *       "dev": "npm run watch:js"
 *     }
 *   }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { minify } from "terser";
import yaml from "js-yaml";
import { createLogger } from "../src/eleventy/logger.js";
const logger = createLogger({
  scope: "JS ",
});

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

/**
 * Current Directory Resolution
 *
 * @group Utilities
 * @since 0.14.0
 *
 * ES modules require explicit __dirname reconstruction. import.meta.url provides
 * the file's URL (file:///path/to/script.js), which fileURLToPath() converts to
 * a filesystem path. path.dirname() extracts the directory portion. This pattern
 * has become standard boilerplate for ES module scripts that need to know their
 * own location.
 *
 * @see {constant} projectRoot - Uses this to resolve paths
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Project Root Directory
 *
 * @group Utilities
 * @since 0.14.0
 *
 * process.cwd() returns where the user executed the command, not where the script
 * lives. This is crucial—if this script is in scripts/build-js.js but you run
 * "npm run build" from the project root, cwd() returns the root. All paths resolve
 * relative to the user's working directory, making the script location-independent.
 *
 * @see {file} site.config.yml - Lives in this directory
 */
const projectRoot = process.cwd();

/**
 * Source Directory Path
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Default location for JavaScript source files. Overridable via build.js.srcDir
 * in site.config.yml. The src/js convention matches most modern project structures,
 * but you can use any directory (lib/, scripts/, client/, etc.).
 *
 * @see {constant} destDirs - Where compiled JavaScript goes
 */
let srcDir = path.join(projectRoot, "src/js");

/**
 * Destination Directory Path(s)
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Where minified/bundled JavaScript files are written. Can be a single string or
 * an array of strings. Can be overridden via build.js.outputDir in site.config.yml.
 * The default (public/assets/js) works for most static site generators and CDN
 * deployments. When an array is provided, JavaScript is written to all specified
 * directories simultaneously—useful for parallel builds or multi-target deployments
 * (e.g., both _site/assets/standard and dist/).
 *
 * @see {constant} srcDir - Where JavaScript source files live
 * @example
 *   # Single destination
 *   outputDir: "public/assets/js"
 *
 *   # Multiple destinations
 *   outputDir:
 *     - "_site/assets/standard"
 *     - "dist"
 */
let destDirs = [path.join(projectRoot, "public/assets/js")];

/**
 * Command-Line Flags
 *
 * @group Configuration
 * @since 0.14.0
 *
 * process.argv contains all command-line arguments. We check for --watch (keep
 * running and rebuild on changes) and --dev (development mode, which implies watch).
 * In the future, these flags could control minification level, source map generation,
 * or other build options.
 *
 * @example bash
 *   node build-js.js --watch  # isWatch = true, isDev = false
 *   node build-js.js --dev    # isWatch = true, isDev = true
 */
const isWatch = process.argv.includes("--watch");
const isDev = process.argv.includes("--dev") || isWatch;

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================

/**
 * Configuration File Path
 *
 * @group Configuration
 * @since 0.14.0
 *
 * site.config.yml is the single source of truth. We chose YAML because it's more
 * forgiving than JSON—no missing comma syntax errors, comments work naturally,
 * multi-line values are clean. The file lives in the project root, making it
 * discoverable and editable. If it doesn't exist, we exit gracefully (some projects
 * might not need JavaScript builds).
 *
 * @see {object} config - Loaded configuration object
 *
 * @example yaml - Minimal configuration
 *   build:
 *     js:
 *       files:
 *         - input: "main.js"
 *           output: "main.min.js"
 *           minify: true
 */
const configPath = path.join(projectRoot, "site.config.yml");

/**
 * Configuration Loading - Graceful Degradation
 *
 * @group Configuration
 * @since 0.14.0
 *
 * This script follows the "principle of least surprise." If there's no config file,
 * it exits with code 0 (success) instead of crashing. Why success? Because in a
 * monorepo or multi-project setup, some projects might not need JavaScript builds.
 * By exiting gracefully, you can include this script in every project's pipeline
 * without breaking the ones that don't use it.
 *
 * The validation has three layers:
 *
 * **Layer 1: File Existence** - No site.config.yml? Exit quietly. This isn't an
 * error—it's intentional absence. Maybe this is a pure HTML site, or maybe JS is
 * handled elsewhere. We respect that choice.
 *
 * **Layer 2: Section Existence** - Config file exists but no build.js section?
 * Exit quietly. Maybe this project only builds CSS. Again, not an error—just
 * not relevant to this script.
 *
 * **Layer 3: Required Fields** - Has build.js section but missing the 'files'
 * array? NOW it's an error. If you defined build.js, you intended to build
 * JavaScript. A missing files array suggests a typo, incomplete config, or
 * copy-paste error. We exit with code 1 (failure) and show an error message.
 *
 * This layered approach provides clear feedback while avoiding false positives.
 * The script is lenient about absence but strict about malformed presence.
 *
 * @see {constant} configPath - Where configuration lives
 * @see {array} JS_FILES - Loaded file definitions
 *
 * @example yaml - Full configuration example
 *   build:
 *     js:
 *       srcDir: "src/js"
 *       outputDir: "public/assets/js"
 *       files:
 *         - input: "app.js"
 *           output: "app.min.js"
 *           minify: true
 *         - input: "worker.js"
 *           output: "worker.js"
 *           minify: false
 *       bundles:
 *         - name: "bundle.min.js"
 *           files:
 *             - "src/js/utils.js"
 *             - "src/js/components.js"
 *             - "src/js/app.js"
 */
if (!fs.existsSync(configPath)) {
  logger.info(`No site.config.yml found. Skipping JS build.`);
  process.exit(0);
}

let config = {};

try {
  const configContent = fs.readFileSync(configPath, "utf-8");
  const fullConfig = yaml.load(configContent);
  config = fullConfig.build?.js || {};

  // Exit early if no JS config section exists
  if (!config || Object.keys(config).length === 0) {
    logger.info(`No build.js configuration found. Skipping JS build.`);
    process.exit(0);
  }

  // Override directories if specified in config
  if (config.srcDir) {
    srcDir = path.join(projectRoot, config.srcDir);
  }
  if (config.outputDir) {
    // Support both single string and array of strings
    if (Array.isArray(config.outputDir)) {
      destDirs = config.outputDir.map((dir) => path.join(projectRoot, dir));
    } else {
      destDirs = [path.join(projectRoot, config.outputDir)];
    }
  }
} catch (error) {
  logger.error(`Failed to parse site.config.yml: ${error.message}`);
  process.exit(0);
}

// Validate required config
if (!config.files || !Array.isArray(config.files)) {
  logger.error(`Missing required 'files' array in build.js config`);
  process.exit(1);
}

/**
 * JavaScript Files to Process
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Array of {input, output, minify} objects defining which JavaScript files to
 * process. Each entry controls one file transformation. The 'minify' boolean is
 * crucial—set it to false for files that are already minified (third-party
 * libraries) or that need debugging (like error tracking scripts). Set it to true
 * for your application code that benefits from compression.
 *
 * Files are processed independently in sequence. Each one is a separate minification
 * pass, which means errors in one file don't prevent others from building. This
 * isolation is valuable during development when you're actively breaking things.
 *
 * @see {object} config - Source of this data
 * @see {function} buildJS - Uses this array to process files
 *
 * @example yaml
 *   files:
 *     - input: "app.js"
 *       output: "app.min.js"
 *       minify: true
 *     - input: "vendor/library.min.js"
 *       output: "library.min.js"
 *       minify: false
 */
const JS_FILES = config.files;

/**
 * Bundle Configurations
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Bundling concatenates multiple JavaScript files into one. This was essential in
 * the HTTP/1.1 era when browsers could only download 6 files simultaneously per
 * domain—every request had latency overhead. Bundling reduced requests from 20
 * to 1, dramatically improving load times. HTTP/2 multiplexing removed this limit,
 * but bundling still helps: it enables better compression (gzip works better on
 * larger files), simplifies HTML (one <script> tag), and reduces cache keys.
 *
 * Each bundle defines a name (output filename) and files (source files to combine).
 * Files are concatenated in the order specified, then minified as one unit. This
 * means the bundle minifier can optimize across file boundaries—removing duplicate
 * function definitions, inlining cross-file constants, etc.
 *
 * The files array accepts three path styles:
 * - Relative to project root: "src/js/utils.js"
 * - Absolute paths: "/absolute/path/to/file.js"
 * - Node modules: "node_modules/library/dist/lib.js"
 *
 * Bundling is entirely optional. If you don't define bundles in your config, this
 * step is skipped. Modern deployment (HTTP/2, CDN edge caching) often works better
 * with separate files—they cache independently, allowing users to skip re-downloading
 * unchanged files.
 *
 * @see {array} JS_FILES - Individual files available for bundling
 * @see {function} buildJS - Performs bundling step
 *
 * @example yaml
 *   bundles:
 *     - name: "app.bundle.min.js"
 *       files:
 *         - "src/js/polyfills.js"
 *         - "src/js/utils.js"
 *         - "src/js/components/button.js"
 *         - "src/js/components/modal.js"
 *         - "src/js/main.js"
 *     - name: "admin.bundle.min.js"
 *       files:
 *         - "src/js/admin/dashboard.js"
 *         - "src/js/admin/settings.js"
 */
const BUNDLES = config.bundles || [];
const shouldBundle = BUNDLES.length > 0;

if (shouldBundle) {
  logger.debug(`Bundling enabled: ${BUNDLES.length} bundle(s)`);
}

/**
 * ANSI Color Codes
 *
 * @group Utilities
 * @since 0.14.0
 *
 * In 1970, the ANSI X3.64 standard defined escape sequences for controlling
 * terminal displays. These special character sequences (starting with \x1b)
 * tell terminals to change text color, move the cursor, clear lines, and more.
 * Despite being 50+ years old, they still power modern terminal UIs—including
 * npm's colored output, git's diff highlighting, and this build script's logs.
 *
 * We use them here to make build output scannable. Grey for metadata, cyan for
 * labels, green for success, red for errors. Your eyes can instantly spot what
 * matters without reading every word. It's the difference between a wall of
 * monochrome text and a well-designed interface.
 *
 * @see {constant} prefix - Uses these colors for log formatting
 *
 * @link https://en.wikipedia.org/wiki/ANSI_escape_code ANSI Escape Codes
 */
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

// ============================================================================
// BUILD FUNCTION
// ============================================================================

/**
 * Build JavaScript - The Main Processing Pipeline
 *
 * @group Core Functions
 * @since 0.14.0
 *
 * This is where JavaScript transforms from readable source code into production-
 * optimized bytecode. The function orchestrates two distinct phases, each solving
 * a different problem:
 *
 * **Phase 1: Individual File Processing** - Each file goes through Terser, a
 * JavaScript parser and minifier. Terser is the modern successor to UglifyJS,
 * rewritten from scratch in 2018 to handle ES6+ syntax (classes, destructuring,
 * async/await, optional chaining). It performs hundreds of micro-optimizations:
 *
 * - Removes whitespace, comments, and unnecessary semicolons
 * - Shortens variable names (myDescriptiveVariableName → a)
 * - Inlines single-use functions and constants
 * - Removes dead code (unreachable branches, unused functions)
 * - Simplifies boolean expressions (!!(x) → !!x)
 * - Joins consecutive var statements
 * - Removes redundant else branches after return
 *
 * The result? Typical compression of 40-70%. A 100KB source file becomes 30-60KB
 * minified. Enable gzip compression on your server and it shrinks another 60-80%.
 * That 100KB file ends up as ~10-20KB on the wire—a 5-10x improvement.
 *
 * Files with minify: false bypass Terser entirely. They're just copied. This is
 * useful for third-party libraries that are pre-minified, or for files you need
 * to debug in production (error tracking, analytics).
 *
 * **Phase 2: Bundling** (optional) - Concatenates multiple files into one, then
 * minifies the combined result. This is different from minifying separately then
 * concatenating—the bundled minifier can optimize ACROSS file boundaries. If
 * utils.js defines a function and app.js calls it once, the bundler can inline it.
 * This cross-file optimization is why bundling often beats separate minification.
 *
 * The function runs asynchronously because minification is CPU-intensive. Terser
 * parses JavaScript into an Abstract Syntax Tree (AST), transforms the tree, then
 * generates code from the transformed tree. For large files (500KB+), this can take
 * seconds. Using async/await prevents blocking the event loop, keeping the process
 * responsive.
 *
 * ### Future Improvements
 *
 * - Generate source maps for debugging minified production code
 * - Add tree shaking to eliminate unused exports from modules
 * - Implement code splitting (bundle.main.js, bundle.vendor.js)
 * - Support Babel transpilation for older browser targets
 * - Add import/export resolution for ES modules
 * - Show before/after compression ratios in output
 * - Detect circular dependencies in bundles
 *
 * @see {array} JS_FILES - Files to process
 * @see {array} BUNDLES - Bundle configurations
 * @see {constant} srcDir - Source file location
 * @see {constant} destDirs - Output file locations
 *
 * @link https://terser.org/docs/api-reference Terser API Reference
 * @link https://github.com/terser/terser/blob/master/README.md Terser Options
 *
 * @example bash - Build output
 *   ::std  [JS ] app.min.js (45.23 KB)
 *   ::std  [JS ] utils.min.js (12.34 KB)
 *   ::std  [JS ] library.js (copied)
 *   ::std  [JS ] Bundling enabled: 1 bundle(s)
 *   ::std  [JS ] bundle.min.js (52.67 KB)
 *   ::std  [JS ] Completed
 *
 * @example javascript - Before minification
 *   // Beautiful, readable code
 *   function calculateFibonacci(number) {
 *     if (number <= 1) return number;
 *     return calculateFibonacci(number - 1) +
 *            calculateFibonacci(number - 2);
 *   }
 *   const result = calculateFibonacci(10);
 *   logger.info('Fibonacci result:', result);
 *
 * @example javascript - After minification
 *   function c(n){return n<=1?n:c(n-1)+c(n-2)}const r=c(10);logger.info("Fibonacci result:",r);
 *
 * @returns {Promise<void>} Resolves when build completes
 */
async function buildJS() {
  // Ensure all dest directories exist
  for (const destDir of destDirs) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
  }

  try {
    // ========================================================================
    // PHASE 1: INDIVIDUAL FILE PROCESSING
    // ========================================================================
    for (const file of JS_FILES) {
      const inputPath = path.join(srcDir, file.input);

      // Check if source file exists
      if (!fs.existsSync(inputPath)) {
        logger.error(`Source file not found: ${file.input}`);
        continue;
      }

      const source = fs.readFileSync(inputPath, "utf8");

      if (file.minify) {
        /**
         * Terser Minification
         *
         * @group Core Functions
         * @since 0.14.0
         *
         * minify() is Terser's main API. It takes source code as a string and
         * returns a promise resolving to {code, map, error}. We use two options:
         *
         * **compress: true** - Enables all safe compression transformations.
         * This includes dead code elimination, constant folding, boolean
         * simplification, and hundreds of other micro-optimizations. "Safe"
         * means it never changes behavior—the minified code is functionally
         * identical to the source.
         *
         * **mangle: true** - Enables variable name shortening. Terser builds
         * a scope tree, identifies which variables are local (safe to rename),
         * and replaces long names with short ones. It uses a, b, c, ..., z, aa,
         * ab, ... ensuring no collisions. This accounts for ~30% of size savings.
         *
         * We don't enable mangle.properties because it's dangerous—renaming
         * object properties can break code if those properties are accessed via
         * strings or from external code.
         *
         * @see {function} buildJS - Caller
         *
         * @link https://terser.org/docs/api-reference#minify-options Minify Options
         */
        const result = await minify(source, {
          compress: true,
          mangle: true,
        });

        if (result.error) {
          logger.error(`Minification failed for ${file.input}:`, result.error);
          continue;
        }

        // Write to all destination directories
        for (const destDir of destDirs) {
          fs.writeFileSync(path.join(destDir, file.output), result.code);
        }

        logger.success(
          `${file.output} ${colors.grey}(${(Buffer.byteLength(result.code) / 1024).toFixed(2)} KB)${destDirs.length > 1 ? ` → ${destDirs.length} destinations` : ""}`,
        );
      } else {
        /**
         * File Copying (No Minification)
         *
         * @group Core Functions
         * @since 0.14.0
         *
         * When minify: false, we copy the file unchanged. This is useful for:
         *
         * - Third-party libraries already minified (no benefit to re-minify)
         * - Files you need to debug in production (error handlers, analytics)
         * - Files with eval() or other dynamic code (minification might break)
         * - Files that are generated by other tools
         *
         * We read once and write to all destinations to avoid multiple disk reads.
         *
         * @see {function} buildJS - Caller
         */
        // Write to all destination directories
        for (const destDir of destDirs) {
          fs.writeFileSync(path.join(destDir, file.output), source);
        }

        logger.success(
          `${file.output} ${colors.grey}(copied)${destDirs.length > 1 ? ` → ${destDirs.length} destinations` : ""}`,
        );
      }
    }

    // ========================================================================
    // PHASE 2: BUNDLING (OPTIONAL)
    // ========================================================================
    if (shouldBundle) {
      for (const bundle of BUNDLES) {
        const contents = [];

        /**
         * Bundle Path Resolution
         *
         * @group Core Functions
         * @since 0.14.0
         *
         * Bundle files can be specified three ways:
         *
         * 1. **Relative paths** - "src/js/utils.js" resolves relative to
         *    project root. This is the most common pattern.
         *
         * 2. **Absolute paths** - "/absolute/path/to/file.js" is used as-is.
         *    Rare, but useful for files outside the project.
         *
         * 3. **Node modules** - "node_modules/library/dist/lib.js" resolves
         *    relative to project root. This lets you bundle third-party code
         *    directly from npm packages.
         *
         * The path.isAbsolute() check determines which resolution strategy to
         * use. Everything else is treated as relative to projectRoot.
         *
         * @see {array} BUNDLES - Bundle definitions
         */
        for (const filepath of bundle.files) {
          // Handle both absolute and relative paths
          const fullPath = path.isAbsolute(filepath)
            ? filepath
            : filepath.startsWith("node_modules")
              ? path.join(projectRoot, filepath)
              : path.join(projectRoot, filepath);

          if (!fs.existsSync(fullPath)) {
            logger.warn(`Bundle file not found: ${filepath}`);
            continue;
          }

          contents.push(fs.readFileSync(fullPath, "utf8"));
        }

        if (contents.length === 0) {
          logger.warn(`No files found for bundle: ${bundle.name}`);
          continue;
        }

        /**
         * Bundle Concatenation & Minification
         *
         * @group Core Functions
         * @since 0.14.0
         *
         * Files are joined with double newlines (\\n\\n) for readability if you
         * ever need to inspect the bundle before minification. The minifier
         * removes these anyway, so it doesn't affect output size.
         *
         * The combined code is then minified as one unit. This is where bundling
         * shines—the minifier can optimize across file boundaries. If file A
         * exports a function and file B uses it once, the minifier can inline it.
         * If both files define similar helper functions, one can be eliminated.
         *
         * The result is often smaller than the sum of individually minified files
         * because the minifier sees the full picture and can make global
         * optimizations.
         *
         * @see {array} BUNDLES - Bundle definitions
         */
        const bundled = contents.join("\n\n");
        const minified = await minify(bundled, {
          compress: true,
          mangle: true,
        });

        if (minified.error) {
          logger.error(
            `Bundle minification failed for ${bundle.name}:`,
            minified.error,
          );
          continue;
        }

        // Write bundle to all destination directories
        for (const destDir of destDirs) {
          fs.writeFileSync(path.join(destDir, bundle.name), minified.code);
        }

        logger.success(
          `${bundle.name} ${colors.grey}(${(Buffer.byteLength(minified.code) / 1024).toFixed(2)} KB)${destDirs.length > 1 ? ` → ${destDirs.length} destinations` : ""}`,
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

/**
 * Initial Build Execution
 *
 * @group Core Functions
 * @since 0.14.0
 *
 * Every run performs one immediate build. This ensures output files exist before
 * watch mode begins—important if your dev server expects files to be present at
 * startup. Top-level await requires Node.js 14.8+ and ES modules (import/export
 * syntax), both of which we're already using.
 *
 * @see {function} buildJS - The function being executed
 */
await buildJS();

/**
 * Watch Mode - File System Monitoring
 *
 * @group Core Functions
 * @since 0.14.0
 *
 * When --watch is present, the script stays alive and monitors srcDir for changes.
 * Node.js fs.watch() uses native OS APIs for file system events—it doesn't poll,
 * it reacts instantly when the OS notifies it of changes. This makes it extremely
 * efficient even when watching thousands of files.
 *
 * The { recursive: true } option watches the entire directory tree, catching
 * changes in subdirectories (src/js/components/, src/js/utils/, etc.). We filter
 * events to only trigger on .js files—ignoring changes to README.md, .DS_Store,
 * and other non-JavaScript files prevents wasteful rebuilds.
 *
 * Each detected change triggers a full rebuild. There's no incremental compilation
 * or smart diffing—the entire build runs again. For most projects (dozens of files,
 * hundreds of KB), this completes in under a second. For truly massive projects
 * (thousands of files, megabytes of source), consider implementing incremental
 * builds as a future improvement.
 *
 * Watch mode is the developer's force multiplier. Save your JavaScript file, switch
 * to the browser, refresh—your changes are live. This tight feedback loop enables
 * rapid iteration and experimentation. Without it, you'd spend significant mental
 * energy remembering to run the build command, breaking your flow state.
 *
 * ### Future Improvements
 *
 * - Debounce rapid successive changes (avoid rebuilding 5 times for one edit)
 * - Implement smart rebuilds (only reprocess changed files)
 * - Add browser auto-refresh via LiveReload/WebSocket
 * - Track and display build time metrics
 * - Show diff of changed files that triggered rebuild
 *
 * @see {function} buildJS - Called on each file change
 * @see {constant} isWatch - Controls whether this runs
 * @see {constant} srcDir - Directory being monitored
 *
 * @link https://nodejs.org/api/fs.html#fswatchfilename-options-listener Node.js fs.watch()
 *
 * @example bash - Watch mode output
 *   ::std  [JS ] app.min.js (45.23 KB)
 *   ::std  [JS ] Watching...
 *   ::std  [JS ] Changed: components/button.js
 *   ::std  [JS ] app.min.js (45.28 KB)
 *   ::std  [JS ] Changed: utils/helpers.js
 *   ::std  [JS ] app.min.js (45.31 KB)
 */
if (isWatch) {
  logger.info(`Watching...`);

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      logger.info(`Changed: ${filename}`);
      await buildJS();
    }
  });
}
