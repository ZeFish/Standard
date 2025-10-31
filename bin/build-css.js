#!/usr/bin/env node

/**
 * Build CSS Script - From Preprocessor to Production
 *
 * @group Build Tools
 * @author Francis Fontaine
 * @since 0.14.0
 *
 * In 2006, Hampton Catlin created Sass in a moment of frustration. CSS, despite
 * being the visual backbone of the web, lacked basic programming concepts like
 * variables, nesting, and functions. Every time you needed to change a brand
 * color, you'd hunt through thousands of lines, replacing hex codes by hand.
 * Catlin's solution? A meta-language that compiles down to CSS, bringing the
 * power of programming to stylesheets.
 *
 * This build script is the bridge between human-friendly SCSS and browser-ready
 * CSS. It watches your source files, compiles them through the Sass engine,
 * optionally bundles multiple files into one, minifies the result to save bytes,
 * and outputs production-ready stylesheets. Think of it as your personal CSS
 * factory—raw materials go in one end (SCSS), finished products come out the
 * other (minified CSS).
 *
 * What makes this script special is its flexibility. Unlike rigid build tools
 * that assume your project structure, this reads configuration from site.config.yml,
 * adapting to YOUR workflow. Want to compile five different SCSS files? Bundle
 * them into one? Keep them separate? Your choice. The script handles the
 * mechanical work while you focus on design.
 *
 * It's also smart enough to know when to exit gracefully. No config file? No
 * problem—it exits silently. No CSS section in your config? Same thing. This
 * "fail quietly" philosophy means you can include this in any project without
 * breaking builds.
 *
 * ### Future Improvements
 *
 * - Add source map generation for debugging
 * - Support PostCSS plugins (autoprefixer, etc.)
 * - Add CSS linting with stylelint
 * - Implement incremental builds (only changed files)
 * - Add performance metrics (compilation time tracking)
 *
 * @see {file} site.config.yml - Configuration file structure
 * @see {package} sass - Dart Sass compiler
 * @see {package} clean-css - CSS minification engine
 *
 * @link https://sass-lang.com/documentation Sass Documentation
 * @link https://github.com/clean-css/clean-css CleanCSS Repository
 *
 * @example bash - Basic usage
 *   # Build once and exit
 *   node scripts/build-css.js
 *
 *   # Watch mode (rebuilds on file changes)
 *   node scripts/build-css.js --watch
 *
 *   # Development mode (enables watch + dev flags)
 *   node scripts/build-css.js --dev
 *
 * @example yaml - Configuration in site.config.yml
 *   build:
 *     css:
 *       srcDir: "src/styles"           # SCSS source directory
 *       outputDir: "public/assets/css" # Compiled CSS destination
 *       files:
 *         - input: "main.scss"
 *           output: "main.css"
 *         - input: "admin.scss"
 *           output: "admin.css"
 *       bundle:                        # Optional bundling
 *         files:
 *           - "main.css"
 *           - "utilities.css"
 *         output: "bundle.min.css"
 *
 * @example json - NPM script integration
 *   {
 *     "scripts": {
 *       "build:css": "node scripts/build-css.js",
 *       "watch:css": "node scripts/build-css.js --watch",
 *       "dev": "npm run watch:css"
 *     }
 *   }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "sass";
import CleanCSS from "clean-css";
import yaml from "js-yaml";
import { createLogger } from "../src/eleventy/logger.js";
const logger = createLogger({
  scope: "CSS",
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
 * In ES modules (import/export syntax), the traditional __dirname variable
 * doesn't exist. Node.js made this deliberate choice in 2015 when designing
 * the ES module system—they wanted a clean break from CommonJS. This utility
 * reconstructs __dirname using import.meta.url, which contains the full file
 * path as a file:// URL. fileURLToPath() converts that URL back to a normal
 * filesystem path, and path.dirname() extracts the directory portion.
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
 * process.cwd() returns the directory where the user ran the command. This is
 * crucial because the script might live in scripts/build-css.js, but the user
 * runs it from the project root. By using cwd() instead of __dirname, all paths
 * resolve relative to the project, not the script location. This is what allows
 * site.config.yml to live in the project root and work correctly.
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
 * Default location for SCSS source files. This can be overridden by the
 * build.css.srcDir setting in site.config.yml. The default follows Standard
 * Framework conventions (src/styles), but you're free to use any structure.
 *
 * @see {constant} destDir - Where compiled CSS goes
 */
let srcDir = path.join(projectRoot, "src/styles");

/**
 * Destination Directory Path(s)
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Where compiled CSS files are written. Can be a single string or an array of strings.
 * Can be overridden via build.css.outputDir in site.config.yml. The default
 * (public/assets/css) works for most 11ty and static site projects, but adjust to
 * match your deployment structure. When an array is provided, CSS is written to all
 * specified directories simultaneously.
 *
 * @see {constant} srcDir - Where SCSS source files live
 * @example
 *   # Single destination
 *   outputDir: "public/assets/css"
 *
 *   # Multiple destinations
 *   outputDir:
 *     - "_site/assets/standard"
 *     - "dist"
 */
let destDirs = [path.join(projectRoot, "public/assets/css")];

/**
 * Command-Line Flags
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Node.js passes command-line arguments via process.argv. Index 0 is the node
 * binary, index 1 is the script path, everything after are your flags. We check
 * if --watch or --dev appear anywhere in that array. Watch mode keeps the script
 * running and rebuilds on file changes. Dev mode enables watch automatically
 * (because developers always want instant feedback).
 *
 * @example bash
 *   node build-css.js --watch  # isWatch = true, isDev = false
 *   node build-css.js --dev    # isWatch = true, isDev = true
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
 * site.config.yml is the single source of truth for build configuration. We
 * chose YAML over JSON because it's human-friendly—no comma syntax errors,
 * comments are allowed, multi-line strings work naturally. The file lives in
 * the project root, making it easy to find and edit. If it doesn't exist, the
 * script exits gracefully (no config = nothing to build).
 *
 * @see {object} config - Loaded configuration object
 *
 * @example yaml - Minimal configuration
 *   build:
 *     css:
 *       files:
 *         - input: "main.scss"
 *           output: "main.css"
 */
const configPath = path.join(projectRoot, "site.config.yml");

/**
 * Configuration Loading - Fail-Safe Architecture
 *
 * @group Configuration
 * @since 0.14.0
 *
 * This script follows the "principle of least surprise"—if there's no config
 * file, it exits with exit code 0 (success) rather than crashing. Why? Because
 * in a multi-project monorepo, some projects might not need CSS builds. By
 * exiting gracefully, you can include this script in every project's build
 * pipeline without breaking the ones that don't use it.
 *
 * The loading process has three validation layers:
 *
 * 1. File exists? If not, exit gracefully.
 * 2. Has build.css section? If not, exit gracefully.
 * 3. Has files array? If not, error (this is required for actual building).
 *
 * This layered validation provides clear error messages while avoiding false
 * positives. A missing config file isn't an error—it's intentional. A malformed
 * config IS an error—it suggests a typo or copy-paste mistake.
 *
 * @see {constant} configPath - Where configuration lives
 * @see {array} SCSS_FILES - Loaded file definitions
 *
 * @example yaml - Full configuration example
 *   build:
 *     css:
 *       srcDir: "src/styles"
 *       outputDir: "public/assets/css"
 *       files:
 *         - input: "main.scss"
 *           output: "main.css"
 *         - input: "admin.scss"
 *           output: "admin.css"
 *       bundle:
 *         files:
 *           - "main.css"
 *           - "utilities.css"
 *         output: "bundle.min.css"
 */
if (!fs.existsSync(configPath)) {
  logger.info(`No site.config.yml found. Skipping CSS build.`);
  process.exit(0);
}

let config = {};

try {
  const configContent = fs.readFileSync(configPath, "utf-8");
  const fullConfig = yaml.load(configContent);
  config = fullConfig.build?.css || {};

  // Exit early if no CSS config section exists
  if (!config || Object.keys(config).length === 0) {
    logger.info(`No build.css configuration found. Skipping CSS build.`);
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
  logger.error(`Missing required 'files' array in build.css config`);
  process.exit(1);
}

/**
 * SCSS Files to Compile
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Array of {input, output} objects defining which SCSS files to compile and
 * where to write the results. Each entry is processed independently, allowing
 * different entry points for different purposes (main site styles, admin panel,
 * print stylesheet, email templates, etc.). Order doesn't matter—they're
 * compiled in parallel conceptually (though JavaScript executes them sequentially).
 *
 * @see {object} config - Source of this data
 * @see {function} buildCSS - Uses this array to process files
 *
 * @example yaml
 *   files:
 *     - input: "main.scss"
 *       output: "main.css"
 *     - input: "print.scss"
 *       output: "print.css"
 */
const SCSS_FILES = config.files;

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

/**
 * Bundle Configuration
 *
 * @group Configuration
 * @since 0.14.0
 *
 * Optional bundling combines multiple CSS files into one. This is useful when
 * you compile several SCSS files independently (for modularity during development)
 * but want a single file in production (for fewer HTTP requests). The bundle
 * step concatenates files, then minifies the result with CleanCSS level 2
 * optimization.
 *
 * Bundling is entirely optional. If you don't define build.css.bundle in your
 * config, this step is skipped. This flexibility lets you optimize for your
 * specific deployment scenario (HTTP/2 might prefer separate files, CDNs might
 * prefer bundled).
 *
 * @see {array} SCSS_FILES - Files available for bundling
 * @see {function} buildCSS - Performs bundling step
 *
 * @example yaml
 *   bundle:
 *     files:
 *       - "main.css"
 *       - "utilities.css"
 *       - "print.css"
 *     output: "bundle.min.css"
 */
const BUNDLE_CONFIG = config.bundle;
const shouldBundle =
  BUNDLE_CONFIG && BUNDLE_CONFIG.files && BUNDLE_CONFIG.output;

if (shouldBundle) {
  logger.debug(`Bundling enabled: ${BUNDLE_CONFIG.output}`);
}

// ============================================================================
// BUILD FUNCTION
// ============================================================================

/**
 * Build CSS - The Main Compilation Pipeline
 *
 * @group Core Functions
 * @since 0.14.0
 *
 * This is where the magic happens. The function orchestrates three distinct
 * phases, each solving a different problem:
 *
 * **Phase 1: Compilation** - Sass transforms SCSS (with variables, nesting,
 * mixins, functions) into plain CSS that browsers understand. The Dart Sass
 * engine (Sass's official implementation since 2016) parses your source files,
 * resolves @import/@use statements, evaluates functions, applies mixins, and
 * outputs pure CSS. We use 'compressed' style, which removes whitespace and
 * comments—smaller files mean faster page loads.
 *
 * **Phase 2: Bundling** (optional) - Concatenates multiple CSS files into one.
 * Why? In HTTP/1.1, browsers could only download 6 files simultaneously per
 * domain. Bundling reduced requests, speeding up load times. HTTP/2 removed
 * this limitation, but bundling still helps with caching (one cache key instead
 * of many) and simplifies HTML (one <link> tag).
 *
 * **Phase 3: Minification** - CleanCSS performs aggressive optimization. It
 * removes redundant rules, merges duplicate selectors, shortens color values
 * (#ffffff → #fff), removes unnecessary units (0px → 0), and more. Level 2
 * optimization is safe for all browsers—it restructures rules but never changes
 * behavior. A typical stylesheet shrinks 20-40% after minification.
 *
 * The function runs asynchronously (async/await) because file I/O is slow—we
 * don't want to block the event loop. In watch mode, this function is called
 * repeatedly as files change. Each run is independent; there's no state carried
 * between builds.
 *
 * ### Future Improvements
 *
 * - Add source map generation for debugging minified CSS
 * - Implement partial recompilation (only rebuild changed files)
 * - Add PostCSS integration for autoprefixing
 * - Support custom Sass importers for npm packages
 * - Generate CSS bundle analysis report
 *
 * @see {array} SCSS_FILES - Files to compile
 * @see {object} BUNDLE_CONFIG - Bundling configuration
 * @see {constant} srcDir - Source file location
 * @see {constant} destDir - Output file location
 *
 * @link https://sass-lang.com/documentation/js-api/modules#compile Sass Compile API
 * @link https://github.com/clean-css/clean-css#constructor-options CleanCSS Options
 *
 * @example bash - Build output
 *   ::std  [CSS] main.css (24.52 KB)
 *   ::std  [CSS] admin.css (12.34 KB)
 *   ::std  [CSS] Bundling enabled: bundle.min.css
 *   ::std  [CSS] bundle.min.css (35.67 KB)
 *   ::std  [CSS] Completed
 *
 * @returns {Promise<void>} Resolves when build completes
 */
async function buildCSS() {
  // Ensure all dest directories exist
  for (const destDir of destDirs) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
  }

  try {
    // ========================================================================
    // PHASE 1: SCSS COMPILATION
    // ========================================================================
    for (const file of SCSS_FILES) {
      const inputPath = path.join(srcDir, file.input);

      // Check if source file exists
      if (!fs.existsSync(inputPath)) {
        logger.error(`Source file not found: ${file.input}`);
        continue;
      }

      const result = compile(inputPath, {
        style: "compressed",
      });

      // Write to all destination directories
      for (const destDir of destDirs) {
        fs.writeFileSync(path.join(destDir, file.output), result.css);
      }

      logger.info(
        `${file.output} ${colors.grey}(${(Buffer.byteLength(result.css) / 1024).toFixed(2)} KB)${destDirs.length > 1 ? ` → ${destDirs.length} destinations` : ""}`,
      );
    }

    // ========================================================================
    // PHASE 2: CSS BUNDLING (OPTIONAL)
    // ========================================================================
    if (shouldBundle) {
      const cssContents = [];

      for (const filename of BUNDLE_CONFIG.files) {
        const filePath = path.join(destDirs[0], filename);

        if (fs.existsSync(filePath)) {
          cssContents.push(fs.readFileSync(filePath, "utf8"));
        } else {
          logger.error(`Bundle file not found: ${filename}`);
        }
      }

      if (cssContents.length > 0) {
        const bundledCss = cssContents.join("\n\n");

        // ====================================================================
        // PHASE 3: MINIFICATION
        // ====================================================================
        const minifier = new CleanCSS({
          level: 2, // Advanced optimizations (safe)
          compatibility: "*", // All browsers
        });

        const minified = minifier.minify(bundledCss);

        if (minified.errors.length > 0) {
          throw new Error(minified.errors.join("\n"));
        }

        // Write bundle to all destination directories
        for (const destDir of destDirs) {
          fs.writeFileSync(
            path.join(destDir, BUNDLE_CONFIG.output),
            minified.styles,
          );
        }

        const minifiedSize = Buffer.byteLength(minified.styles) / 1024;
        logger.info(
          `${BUNDLE_CONFIG.output} ${colors.grey}(${minifiedSize.toFixed(2)} KB)${destDirs.length > 1 ? ` → ${destDirs.length} destinations` : ""}`,
        );
      }
    }

    if (!isWatch) logger.info(`Completed`);
  } catch (error) {
    logger.error(`CSS build failed:`, error.message);
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
 * The script always performs one build immediately upon starting. This ensures
 * output files exist before watch mode begins (important if you're running this
 * alongside a dev server that expects CSS files to be present). Using await at
 * the top level requires Node.js 14.8+ and ES modules—both requirements we've
 * already committed to by using import syntax.
 *
 * @see {function} buildCSS - The function being executed
 */
await buildCSS();

/**
 * Watch Mode - File System Monitoring
 *
 * @group Core Functions
 * @since 0.14.0
 *
 * When --watch flag is present, this keeps the script running and monitors the
 * source directory for changes. Node.js fs.watch() uses native OS file system
 * events (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows),
 * making it extremely efficient—it doesn't poll, it reacts instantly.
 *
 * The { recursive: true } option monitors the entire directory tree, catching
 * changes in subdirectories (like src/styles/components/). We filter events to
 * only trigger on .scss files—ignoring changes to other files prevents wasteful
 * rebuilds. Each change triggers a full rebuild; there's no incremental
 * compilation (a potential future improvement for large projects).
 *
 * Watch mode is the developer's best friend. Save your SCSS file, alt-tab to
 * the browser, refresh—your changes are there. It's the feedback loop that
 * makes iterative design possible. Without it, you'd spend half your day running
 * build commands manually.
 *
 * ### Future Improvements
 *
 * - Debounce rapid file changes (avoid multiple rebuilds for one logical change)
 * - Implement smart rebuilds (only recompile affected files)
 * - Add browser auto-refresh via LiveReload or WebSocket
 * - Show compilation time metrics in watch mode
 *
 * @see {function} buildCSS - Called on each file change
 * @see {constant} isWatch - Controls whether this runs
 * @see {constant} srcDir - Directory being monitored
 *
 * @link https://nodejs.org/api/fs.html#fswatchfilename-options-listener Node.js fs.watch()
 *
 * @example bash - Watch mode output
 *   ::std  [CSS] main.css (24.52 KB)
 *   ::std  [CSS] Watching...
 *   ::std  [CSS] Changed: components/_button.scss
 *   ::std  [CSS] main.css (24.54 KB)
 *   ::std  [CSS] Changed: _variables.scss
 *   ::std  [CSS] main.css (24.58 KB)
 */
if (isWatch) {
  logger.info(`Watching...`);

  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith(".scss")) {
      logger.info(`Changed: ${filename}`);
      await buildCSS();
    }
  });
}
