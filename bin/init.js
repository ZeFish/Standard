#!/usr/bin/env node

/**
 * Standard Framework Init - Project Scaffolding Command
 *
 * @group Build Tools
 * @author Francis Fontaine
 * @since 0.14.0
 *
 * In 2012, the Ruby on Rails community introduced a concept that revolutionized
 * web development: "Convention over Configuration." Instead of spending hours
 * setting up project structures, configuring build tools, and wiring dependencies,
 * developers could run `rails new myapp` and get a fully-functional project
 * instantly. Every directory in its right place, every tool pre-configured,
 * every convention established. This single command removed the friction that
 * prevented beginners from starting and freed experts from repetitive setup work.
 *
 * The idea spread like wildfire. Yeoman brought it to JavaScript in 2012. Angular
 * adopted it with `ng new`. React followed with `create-react-app` in 2016. Vue
 * introduced `vue create`. The pattern was clear—great frameworks provide great
 * scaffolding. Starting a project should be delightful, not daunting.
 *
 * This script brings that philosophy to Standard Framework. Run `standard-init`,
 * answer a single question (or accept the default), and get a complete website
 * structure: content directories, build configurations, sample files, layouts,
 * and a development workflow that just works. It creates 15+ files across 7
 * directories, each one carefully positioned to follow best practices learned
 * from thousands of real projects.
 *
 * But this isn't just file creation—it's opinionated architecture. The script
 * establishes a separation of concerns: content/ for writing, src/ for code,
 * public/ for compiled assets, _site/ for output. It wires together three build
 * systems (CSS, JavaScript, 11ty) into one unified workflow. It configures watch
 * modes, pass-through copying, and live reload. Most importantly, it gets out of
 * your way—every file it creates is meant to be edited, customized, or deleted.
 *
 * The genius of scaffolding isn't eliminating configuration—it's providing
 * intelligent defaults. You can still customize everything, but you start from
 * a working baseline instead of a blank canvas. This reduces decision fatigue
 * ("Where should CSS files go?"), prevents common mistakes (misconfigured build
 * scripts), and teaches best practices through example (well-structured files).
 *
 * ### Future Improvements
 *
 * - Add interactive prompts for site metadata (title, author, etc.)
 * - Support project templates (blog, documentation, portfolio)
 * - Offer TypeScript option for advanced users
 * - Include sample content (blog posts, about page, contact form)
 * - Add deployment configurations (Netlify, Vercel, GitHub Pages)
 * - Generate favicon and social media meta tags
 * - Create VS Code workspace settings for optimal DevX
 *
 * @see {file} site.config.yml - Main configuration file created
 * @see {file} eleventy.config.js - 11ty configuration created
 * @see {file} build-css.js - CSS build script that reads the config
 * @see {file} build-js.js - JavaScript build script that reads the config
 *
 * @link https://rubyonrails.org/ Ruby on Rails (convention over configuration)
 * @link https://yeoman.io/ Yeoman (web scaffolding tool)
 * @link https://create-react-app.dev/ Create React App (inspiration)
 *
 * @example bash - Basic usage
 *   # Interactive setup (uses default name "standard-site")
 *   standard-init
 *
 *   # Create project with custom name
 *   standard-init my-awesome-site
 *
 *   # Full workflow
 *   standard-init my-site
 *   cd my-site
 *   npm install
 *   npm start
 *
 * @example bash - Created project structure
 *   my-site/
 *   ├── content/              # Your content (Markdown, HTML)
 *   │   └── index.md          # Sample homepage
 *   ├── src/
 *   │   ├── styles/
 *   │   │   └── custom.scss   # Your custom styles
 *   │   ├── js/
 *   │   │   └── custom.js     # Your custom scripts
 *   │   └── layouts/
 *   │       └── base.njk      # Base HTML template
 *   ├── public/               # Compiled assets (generated)
 *   │   └── assets/
 *   │       ├── css/
 *   │       └── js/
 *   ├── _site/                # Built site (generated)
 *   ├── site.config.yml       # Site & build configuration
 *   ├── eleventy.config.js    # 11ty configuration
 *   ├── package.json          # Dependencies & scripts
 *   ├── README.md             # Project documentation
 *   └── .gitignore            # Git exclusions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

/**
 * Script Directory Resolution
 *
 * @group Utilities
 * @since 0.14.0
 *
 * In ES modules, we must manually reconstruct __dirname. import.meta.url gives
 * us the file's URL (file:///path/to/init.js), which fileURLToPath() converts
 * to a filesystem path. path.dirname() extracts the directory. This tells us
 * where the script lives, which is useful for locating template files or the
 * framework's installation directory.
 *
 * @see {constant} frameworkRoot - Uses this to locate framework files
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Framework Root Directory
 *
 * @group Utilities
 * @since 0.14.0
 *
 * This points to Standard Framework's installation directory (one level up from
 * scripts/). We don't currently use this for copying template files (we generate
 * them as strings), but it's available for future enhancements—like copying
 * example content, images, or more complex starter templates.
 *
 * @see {constant} __dirname - Derived from this
 */
const frameworkRoot = path.join(__dirname, "..");

/**
 * Project Configuration
 *
 * @group Configuration
 * @since 0.14.0
 *
 * The project name comes from command-line arguments (process.argv[2]) or defaults
 * to "standard-site". process.argv is an array: [0] is the node binary path, [1]
 * is the script path, [2] is the first user argument. We use this name for the
 * directory, package.json name field, and README title.
 *
 * projectPath is the absolute filesystem location where we'll create the project.
 * path.resolve() converts the name into an absolute path relative to the current
 * working directory. If you run `standard-init my-site` from /home/user/projects,
 * projectPath becomes /home/user/projects/my-site.
 *
 * @see {function} main - Uses these values throughout
 *
 * @example bash
 *   # Uses default name "standard-site"
 *   standard-init
 *
 *   # Creates "blog" directory
 *   standard-init blog
 *
 *   # Creates "my-awesome-site" directory
 *   standard-init my-awesome-site
 */
const projectName = process.argv[2] || "standard-site";
const projectPath = path.resolve(process.cwd(), projectName);

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log("🚀 Standard Framework - Project Initializer\n");

/**
 * Directory Existence Check - Preventing Accidental Overwrites
 *
 * @group Safety Checks
 * @since 0.14.0
 *
 * Before doing anything, we verify the target directory doesn't already exist.
 * This prevents accidentally overwriting an existing project—imagine running
 * `standard-init blog` when you already have a blog/ directory with months of
 * work. This check catches that before any damage occurs.
 *
 * If the directory exists, we print an error and exit with code 1 (failure).
 * The user can then choose a different name or manually delete the existing
 * directory if they truly want to start fresh.
 *
 * @see {constant} projectPath - Directory being checked
 *
 * @example bash - Error scenario
 *   $ standard-init my-site
 *   ❌ Directory "my-site" already exists!
 *   # Process exits, nothing is created
 */
if (fs.existsSync(projectPath)) {
  console.error(`❌ Directory "${projectName}" already exists!`);
  process.exit(1);
}

console.log(`📁 Creating project: ${projectName}\n`);

try {
  // ==========================================================================
  // DIRECTORY STRUCTURE CREATION
  // ==========================================================================

  /**
   * Directory Structure - The Foundation of Organization
   *
   * @group Project Structure
   * @since 0.14.0
   *
   * Every great building starts with a solid foundation. In web projects, that
   * foundation is the directory structure—it defines where things live, how they
   * relate, and how they flow through the build process. This structure follows
   * the "separation of concerns" principle established by Unix in the 1970s:
   * each directory has one clear purpose.
   *
   * **content/** - This is where writers work. Markdown files, HTML snippets,
   * data files—anything that represents the site's content lives here. It's
   * deliberately separate from code (src/) and compiled assets (public/). This
   * separation means content editors never accidentally break the build system,
   * and developers never accidentally delete content.
   *
   * **src/styles/** - Source SCSS files. These are human-readable, with variables,
   * mixins, comments, and proper formatting. They compile to public/assets/css/.
   * The "src" (source) vs "public" (compiled) distinction is crucial—source is
   * what you edit, public is what the browser downloads.
   *
   * **src/js/** - Source JavaScript files. Like styles, these are readable with
   * descriptive variable names and comments. They compile (minify/bundle) to
   * public/assets/js/. Never edit the public/ files directly—they're generated
   * and overwritten on every build.
   *
   * **src/layouts/** - Nunjucks templates that define HTML structure. These are
   * the skeletons that content gets inserted into. Separating layouts from content
   * means you can redesign the entire site without touching a single content file.
   *
   * **public/assets/** - Compiled, production-ready assets. This directory is
   * generated by build scripts and watched by 11ty. When CSS/JS changes, only the
   * browser reloads (fast). When content changes, 11ty rebuilds (slower but
   * necessary). This separation optimizes the development workflow.
   *
   * **_site/** - The final built website. This is what you deploy to production.
   * It contains HTML files, copied assets, and everything needed to serve the site.
   * It's completely generated—never edit files here, always regenerate.
   *
   * The { recursive: true } option means parent directories are created automatically.
   * If public/ doesn't exist when we create public/assets/css/, fs.mkdirSync() creates
   * all three levels (public/, public/assets/, public/assets/css/). This prevents
   * the "ENOENT: no such file or directory" errors that plague manual directory creation.
   *
   * ### Future Improvements
   *
   * - Add data/ directory for JSON/YAML data files
   * - Create public/images/ for static images
   * - Add tests/ directory for future testing setup
   * - Include .vscode/ with recommended extensions
   *
   * @see {constant} projectPath - Base path for all directories
   *
   * @link https://en.wikipedia.org/wiki/Separation_of_concerns Separation of Concerns
   *
   * @example bash - Created structure
   *   standard-site/
   *   ├── content/              ✅ Created
   *   ├── src/
   *   │   ├── styles/           ✅ Created
   *   │   ├── js/               ✅ Created
   *   │   └── layouts/          ✅ Created
   *   ├── public/
   *   │   └── assets/
   *   │       ├── css/          ✅ Created
   *   │       └── js/           ✅ Created
   *   └── _site/                ✅ Created
   */
  const dirs = [
    "content",
    "src/styles",
    "src/js",
    "src/layouts",
    "public/assets/css",
    "public/assets/js",
    "_site",
  ];

  for (const dir of dirs) {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    console.log(`   ✅ Created ${dir}/`);
  }

  console.log();

  // ==========================================================================
  // CONFIGURATION FILE GENERATION
  // ==========================================================================

  /**
   * Site Configuration File - The Central Source of Truth
   *
   * @group Configuration
   * @since 0.14.0
   *
   * site.config.yml is where everything begins. It defines site metadata (title,
   * URL, author), social connections, and—most importantly—build configuration.
   * Both build-css.js and build-js.js read this file to know what to compile,
   * what to bundle, and where to put the results.
   *
   * We chose YAML over JSON because it's human-friendly: no trailing comma syntax
   * errors, comments work naturally, multi-line strings are clean, and the
   * structure is visually clear. YAML was designed for configuration files—JSON
   * was designed for data interchange. Use the right tool for the job.
   *
   * **Site Metadata Section** - Basic information about the site. Used in meta
   * tags, feeds, sitemaps, and templates. The URL should be the production URL
   * (used for generating absolute URLs in canonical tags and RSS feeds).
   *
   * **Build Section** - This is the magic. It tells build scripts exactly what to
   * compile and how. The CSS section defines which SCSS files to process and how
   * to bundle them with Standard Framework's CSS. The JS section does the same
   * for JavaScript. This unified configuration means you never have multiple build
   * configs drifting out of sync.
   *
   * **Bundle Configuration** - Notice we bundle Standard Framework's CSS with your
   * custom CSS into site.min.css. This creates a single HTTP request for all styles.
   * Same with JavaScript—we bundle htmx (for interactivity), Standard Framework's
   * typography engine, and your custom scripts into one file. This follows the
   * "progressive enhancement" philosophy: the core bundle is small (<50KB), loads
   * fast, and provides full functionality.
   *
   * **Why htmx?** - Htmx enables rich interactivity without complex JavaScript
   * frameworks. Need to load content dynamically? Add `hx-get="/content"` to any
   * element. No build step, no compilation, no framework lock-in. It's optional—
   * remove it from the bundle if you don't need it.
   *
   * ### Future Improvements
   *
   * - Add navigation structure configuration
   * - Include SEO settings (meta tags, social cards)
   * - Add deployment configuration (Netlify, Vercel)
   * - Support environment-specific configs (dev vs production)
   *
   * @see {file} build-css.js - Reads this configuration
   * @see {file} build-js.js - Reads this configuration
   *
   * @link https://yaml.org/ YAML Specification
   * @link https://htmx.org/ htmx - High Power Tools for HTML
   *
   * @example yaml - Example customization
   *   title: "My Awesome Blog"
   *   url: "https://blog.example.com"
   *   description: "Thoughts on web development and design"
   *   language: "en"
   *   author:
   *     name: "Jane Developer"
   *     email: "jane@example.com"
   *   social:
   *     twitter: "@janedev"
   *     github: "janedev"
   */
  const siteConfig = `title: "${projectName}"
url: "https://example.com"
description: "A beautiful site built with Standard Framework"
language: "en"
author:
  name: "Your Name"
  email: "your.email@example.com"
social:
  twitter: "@yourhandle"

# Build configuration (read by build-css and build-js scripts)
# Outputs to public/assets which is watched by 11ty for browser reload
build:
  css:
    outputDir: "public/assets/css"
    files:
      - input: "custom.scss"
        output: "custom.min.css"
    bundle:
      files:
        - "node_modules/@zefish/standard/dist/standard.min.css"
        - "public/assets/css/custom.min.css"
      output: "site.min.css"

  js:
    outputDir: "public/assets/js"
    files:
      - input: "custom.js"
        output: "custom.min.js"
        minify: true
    bundles:
      - name: "site.bundle.js"
        files:
          - "node_modules/htmx.org/dist/htmx.min.js"
          - "node_modules/@zefish/standard/dist/standard.min.js"
          - "public/assets/js/custom.min.js"
`;

  fs.writeFileSync(path.join(projectPath, "site.config.yml"), siteConfig);
  console.log("✅ Created site.config.yml");

  // ==========================================================================
  // 11TY CONFIGURATION
  // ==========================================================================

  /**
   * Eleventy Configuration - Static Site Generator Setup
   *
   * @group Configuration
   * @since 0.14.0
   *
   * This file configures 11ty (Eleventy), the static site generator that powers
   * Standard Framework sites. 11ty is like a printing press for the web—it takes
   * content (Markdown, HTML, data) and templates (Nunjucks, Liquid) and produces
   * static HTML files. Static sites are fast (no server processing), secure (no
   * database attacks), and cheap to host (just files on a CDN).
   *
   * **Directory Configuration** - We tell 11ty where things live. Input comes from
   * content/, templates from src/layouts/, and output goes to _site/. This matches
   * the directory structure we created earlier. The "../src/layouts" path is
   * relative to the input directory (content/), going up one level then into src/.
   *
   * **Standard Framework Plugin** - eleventyConfig.addPlugin(Standard) integrates
   * the entire Standard Framework plugin system: enhanced Markdown, template
   * filters, shortcodes, backlinks, and more. It's a single line that unlocks
   * dozens of features.
   *
   * **Default Layout** - addGlobalData("layout", "base") means every Markdown file
   * automatically uses base.njk layout unless it specifies otherwise. This "convention
   * over configuration" saves you from adding `layout: base` to every file's
   * frontmatter. Just write content, get properly formatted pages.
   *
   * **Pass-Through Copy** - The public/ directory is copied directly to output
   * without processing. This is where compiled CSS/JS lives, so they appear in
   * _site/assets/css/ and _site/assets/js/ without transformation. The `{ "public": "." }`
   * syntax means "copy contents of public/ to root of _site/" (flattening the structure).
   *
   * **Watch Ignores** - Critical for performance. We tell 11ty NOT to watch src/js/
   * and src/styles/ because those are handled by build-css.js and build-js.js. If
   * 11ty watched them, it would trigger full rebuilds (slow) instead of just browser
   * reloads (fast). We also ignore public/ because it's the output of build scripts—
   * 11ty watches _site/ instead.
   *
   * **Template Engines** - Nunjucks (njk) is powerful and flexible. It supports
   * includes, macros, filters, and inheritance—everything needed for complex layouts.
   * We use it for both Markdown (via markdownTemplateEngine) and HTML files.
   *
   * ### Future Improvements
   *
   * - Add collections configuration (blog posts, pages, projects)
   * - Configure pagination for blog archives
   * - Set up RSS feed generation
   * - Add sitemap generation
   * - Configure image optimization pipeline
   *
   * @see {file} site.config.yml - Site metadata used in templates
   * @see {package} @zefish/standard - Plugin being loaded
   * @see {file} src/layouts/base.njk - Default layout template
   *
   * @link https://www.11ty.dev/ Eleventy Documentation
   * @link https://mozilla.github.io/nunjucks/ Nunjucks Template Engine
   *
   * @example javascript - Extended configuration
   *   eleventyConfig.addPlugin(Standard, {
   *     // Custom Standard Framework options
   *     markdown: {
   *       highlight: true,
   *       footnotes: true
   *     }
   *   });
   *
   *   // Add collections
   *   eleventyConfig.addCollection("posts", collection => {
   *     return collection.getFilteredByGlob("content/blog/*.md");
   *   });
   */
  const eleventyConfig = `import Standard from "@zefish/standard";

export default function (eleventyConfig) {

  // Add Standard Framework plugin
  eleventyConfig.addPlugin(Standard, {
  });

  // Add default layout
  eleventyConfig.addGlobalData("layout", "base");

  // Copy assets to output
  eleventyConfig.addPassthroughCopy({ "public": "." });

  // Ignore src/js and src/styles - they are watched by build scripts
  eleventyConfig.watchIgnores.add("src/js/**");
  eleventyConfig.watchIgnores.add("src/styles/**");
  eleventyConfig.watchIgnores.add("public/**");

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../src/layouts",
      output: "_site",
    },
  };
};
`;

  fs.writeFileSync(
    path.join(projectPath, "eleventy.config.js"),
    eleventyConfig,
  );
  console.log("✅ Created eleventy.config.js");

  // ==========================================================================
  // PACKAGE.JSON GENERATION
  // ==========================================================================

  /**
   * Package Configuration - Dependency Management & Scripts
   *
   * @group Configuration
   * @since 0.14.0
   *
   * package.json is the heart of every Node.js project. It defines dependencies
   * (which libraries to install), scripts (command shortcuts), and metadata
   * (name, version, author). NPM reads this file to manage your project.
   *
   * **Type: "module"** - This enables ES modules (import/export) instead of
   * CommonJS (require). ES modules are the future—they're the JavaScript standard,
   * they enable tree shaking (removing unused code), and they work in browsers
   * without transpilation. All Standard Framework code uses ES modules.
   *
   * **Scripts Section** - These are command shortcuts. Run `npm run build:css`
   * and NPM executes `standard-build-css`. These scripts compose beautifully:
   * the `build` script runs three commands in sequence (&&), while `dev` runs
   * three in parallel (concurrently).
   *
   * **The Development Workflow** - `npm start` (alias for `npm run dev`) does
   * something magical. It starts three processes simultaneously:
   *
   * 1. **watch:css** - Monitors SCSS files, recompiles on changes, writes to public/
   * 2. **watch:js** - Monitors JavaScript files, recompiles on changes, writes to public/
   * 3. **eleventy --serve** - Watches content/ and public/, serves site with live reload
   *
   * This creates an optimized feedback loop: Change CSS → recompile (0.1s) →
   * browser reload (instant). Change content → 11ty rebuild (0.5s) → browser reload.
   * The key insight: CSS/JS changes don't trigger 11ty rebuilds because 11ty only
   * watches public/, not src/. This separation makes development feel instant.
   *
   * **concurrently** - Runs multiple npm scripts in parallel with a unified output.
   * The `--kill-others` flag means if one process crashes, all stop—preventing
   * orphaned processes. Without concurrently, you'd need three terminal windows.
   *
   * **Dependencies** - Standard Framework is the only runtime dependency. Everything
   * else (11ty, build tools) is pulled in as transitive dependencies. This keeps
   * your package.json clean and ensures version compatibility.
   *
   * ### Future Improvements
   *
   * - Add `test` script for future testing setup
   * - Include `lint` script for code quality checks
   * - Add `preview` script for production build preview
   * - Include `deploy` scripts for various platforms
   *
   * @see {file} site.config.yml - Configuration read by build scripts
   * @see {package} concurrently - Parallel script execution
   * @see {package} @zefish/standard - Main framework package
   *
   * @link https://docs.npmjs.com/cli/v10/configuring-npm/package-json Package.json Docs
   * @link https://github.com/open-cli-tools/concurrently Concurrently
   *
   * @example bash - Script usage
   *   npm run build:css    # Build CSS only
   *   npm run build:js     # Build JavaScript only
   *   npm run build        # Build everything
   *   npm run watch:css    # Watch CSS files
   *   npm run watch:js     # Watch JavaScript files
   *   npm start            # Full development mode
   *   npm run dev          # Same as npm start
   */
  const packageJson = {
    name: projectName,
    version: "0.1.0",
    description: "A beautiful site built with Standard Framework",
    type: "module",
    scripts: {
      "build:css": "standard-build-css",
      "build:js": "standard-build-js",
      build: "npm run build:css && npm run build:js && eleventy",
      check: "npm run build && standard-check",
      "watch:css": "standard-build-css --watch",
      "watch:js": "standard-build-js --watch",
      dev: 'rm -rf _site/ && npm run clean:ports && concurrently --kill-others "npm run watch:css" "npm run watch:js" "eleventy --serve --port=8080"',
      "clean:ports": "lsof -ti:8080 | xargs kill -9 2>/dev/null || true",
      "kill-node": "killall node || taskkill /F /IM node.exe",
      start: "npm run dev",
    },
    keywords: ["standard-framework", "typography", "11ty"],
    author: "Your Name",
    license: "MIT",
    dependencies: {
      "@zefish/standard": "latest",
      "@11ty/eleventy": "^3.1.0",
      dotenv: "^17.0.0",
    },
    devDependencies: {
      concurrently: "^8.2.2",
    },
  };

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
  console.log("✅ Created package.json");

  // ==========================================================================
  // SOURCE FILE GENERATION
  // ==========================================================================

  /**
   * Custom SCSS File - Your Style Starting Point
   *
   * @group Source Files
   * @since 0.14.0
   *
   * This is where you add site-specific styles. Standard Framework provides the
   * foundation (typography, grid, colors, rhythm), and this file is where you
   * build on top of that foundation. Want different brand colors? Define them here.
   * Need custom components? Style them here. Want to override framework defaults?
   * This is the place.
   *
   * The commented-out @import line shows how to access Standard Framework variables
   * and mixins. Uncomment it to use $flow-space, color variables, grid mixins, and
   * more. This gives you the full power of the framework's design system while
   * writing your custom code.
   *
   * We keep this file minimal intentionally—it's a blank canvas. Some scaffolding
   * tools generate hundreds of lines of boilerplate. We give you three comments
   * and a body selector. Your project, your styles, your choices.
   *
   * @see {file} site.config.yml - Compilation configuration
   * @see {file} build-css.js - Compiles this file
   *
   * @example scss - Common customizations
   *   // Import Standard Framework variables
   *   @import "@zefish/standard/css";
   *
   *   // Override brand colors
   *   :root {
   *     --color-accent: #e63946;
   *     --color-background: #f8f9fa;
   *   }
   *
   *   // Custom component
   *   .hero {
   *     padding: calc(var(--flow-space) * 4);
   *     background: var(--color-accent);
   *     color: white;
   *   }
   */
  const scssFile = `/**
 * Custom Styles for Your Site
 * This file will be compiled and bundled with Standard Framework CSS
 */

// Import Standard Framework variables
// @import "@zefish/standard/css";

// Add your custom styles below
body {
  // Customize as needed
}
`;

  fs.writeFileSync(path.join(projectPath, "src/styles/custom.scss"), scssFile);
  console.log("✅ Created src/styles/custom.scss");

  /**
   * Custom JavaScript File - Your Script Starting Point
   *
   * @group Source Files
   * @since 0.14.0
   *
   * This is where you add site-specific JavaScript. Standard Framework's typography
   * engine runs automatically (smart quotes, widow prevention, etc.), but this is
   * where YOU control behavior. Need form validation? Add it here. Want to track
   * analytics? Initialize it here. Building interactive components? Script them here.
   *
   * The single console.log demonstrates the file works and helps debugging. When
   * you open the browser console after running `npm start`, you'll see "Standard
   * Framework initialized!"—confirmation that JavaScript loaded and executed.
   *
   * Like the SCSS file, we keep this minimal. It's your project—we provide the
   * foundation, you build the features.
   *
   * @see {file} site.config.yml - Compilation configuration
   * @see {file} build-js.js - Minifies and bundles this file
   *
   * @example javascript - Common additions
   *   console.log("Standard Framework initialized!");
   *
   *   // Form validation
   *   document.querySelector('form').addEventListener('submit', (e) => {
   *     e.preventDefault();
   *     // Validation logic
   *   });
   *
   *   // Analytics
   *   if (typeof gtag !== 'undefined') {
   *     gtag('config', 'GA_MEASUREMENT_ID');
   *   }
   *
   *   // Custom Standard Framework options
   *   if (window.standard) {
   *     window.standard.updateOptions({
   *       enableSmartQuotes: true,
   *       locale: 'fr'
   *     });
   *   }
   */
  const jsFile = `/**
 * Custom JavaScript for Your Site
 * This file will be minified and bundled with Standard Framework JS
 */

console.log("Standard Framework initialized!");

// Add your custom scripts below
`;

  fs.writeFileSync(path.join(projectPath, "src/js/custom.js"), jsFile);
  console.log("✅ Created src/js/custom.js");

  // ==========================================================================
  // TEMPLATE GENERATION
  // ==========================================================================

  /**
   * Base Layout Template - HTML Structure Foundation
   *
   * @group Templates
   * @since 0.14.0
   *
   * This is the HTML skeleton that wraps all content. Every page on your site
   * (unless it specifies a different layout) uses this template. It defines the
   * <head>, <body>, header, main, and footer structure. Content gets injected
   * into the {{ content | safe }} section.
   *
   * **Nunjucks Syntax** - The {{ }} brackets are Nunjucks template tags. They
   * output variables: {{ title }} becomes the page's title, {{ site.title }}
   * becomes the site title from site.config.yml. The `or` keyword provides
   * fallbacks: use page title if it exists, otherwise use site title.
   *
   * **The `| safe` Filter** - By default, Nunjucks escapes HTML to prevent XSS
   * attacks. But content is HTML (generated from Markdown), so we need to output
   * it raw. The `| safe` filter says "this is trusted HTML, don't escape it."
   * Never use `| safe` on user input—only on content you control.
   *
   * **Semantic HTML** - We use <header>, <main>, and <footer> elements for
   * semantic meaning. Screen readers use these landmarks to navigate. Search
   * engines understand page structure better. CSS can target them easily. This
   * is modern, accessible HTML.
   *
   * **Asset Loading** - CSS in <head> (render-blocking, but necessary for styled
   * initial paint), JavaScript at end of <body> (non-blocking, runs after DOM
   * loads). Both are bundles—one request each instead of multiple.
   *
   * **Copyright Year** - {{ now.getFullYear() }} uses JavaScript's Date object
   * to show the current year. This updates automatically—no manual changes needed
   * every January 1st.
   *
   * ### Future Improvements
   *
   * - Add navigation component
   * - Include meta tags for social sharing (Open Graph, Twitter Cards)
   * - Add favicon links
   * - Include skip-to-content link for accessibility
   * - Add dark mode toggle
   *
   * @see {file} content/index.md - Example content using this layout
   * @see {file} eleventy.config.js - Sets this as default layout
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element HTML Elements
   * @link https://mozilla.github.io/nunjucks/templating.html Nunjucks Templating
   *
   * @example njk - Extended layout
   *   <!DOCTYPE html>
   *   <html lang="{{ site.language or 'en' }}" class="no-js">
   *   <head>
   *     <meta charset="UTF-8">
   *     <meta name="viewport" content="width=device-width, initial-scale=1.0">
   *     <title>{{ title or site.title }}</title>
   *     <meta name="description" content="{{ description or site.description }}">
   *
   *     <!-- Open Graph -->
   *     <meta property="og:title" content="{{ title or site.title }}">
   *     <meta property="og:description" content="{{ description or site.description }}">
   *     <meta property="og:image" content="{{ site.url }}/og-image.jpg">
   *
   *     <link rel="stylesheet" href="/assets/css/site.min.css">
   *   </head>
   *   <body>
   *     <a href="#main" class="skip-link">Skip to content</a>
   *
   *     <header>
   *       <nav>
   *         <a href="/">{{ site.title }}</a>
   *         <ul>
   *           <li><a href="/about">About</a></li>
   *           <li><a href="/blog">Blog</a></li>
   *         </ul>
   *       </nav>
   *     </header>
   *
   *     <main id="main">
   *       {{ content | safe }}
   *     </main>
   *
   *     <footer>
   *       <p>&copy; {{ now.getFullYear() }} {{ site.author.name }}</p>
   *     </footer>
   *
   *     <script src="/assets/js/site.bundle.js"></script>
   *   </body>
   *   </html>
   */
  const layoutDir = path.join(projectPath, "src/layouts");
  const baseLayout = `<!DOCTYPE html>
<html lang="{{ site.language or 'en' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or site.title }}{% if title and title != site.title %} · {{ site.title }}{% endif %}</title>
  <meta name="description" content="{{ description or site.description }}">

  <!-- Site CSS (Standard Framework + Custom) -->
  <link rel="stylesheet" href="/assets/css/site.min.css">
</head>
<body>
  <header>
    <h1>{{ site.title }}</h1>
  </header>

  <main>
    {{ content | safe }}
  </main>

  <footer>
    <p>&copy; {{ now.getFullYear() }} {{ site.author.name }}. All rights reserved.</p>
  </footer>

  <!-- Site JS (Standard Framework + Custom) -->
  <script src="/assets/js/site.bundle.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(layoutDir, "base.njk"), baseLayout);
  console.log("✅ Created src/layouts/base.njk");

  // ==========================================================================
  // DOCUMENTATION GENERATION
  // ==========================================================================

  /**
   * Project README - Documentation and Onboarding
   *
   * @group Documentation
   * @since 0.14.0
   *
   * README.md is the first file anyone sees when they open your project. On GitHub,
   * it's displayed automatically. In text editors, it's alphabetically first. It's
   * your project's front door—it should welcome visitors, explain what the project
   * is, and show them how to get started.
   *
   * We generate a comprehensive README that covers:
   *
   * **Getting Started** - The three commands every developer needs: install, start,
   * build. No confusion, no hunting through documentation. If someone clones your
   * repo, they can have a working dev server in 30 seconds.
   *
   * **Development Workflow** - Explains what `npm start` actually does. Many
   * developers run commands without understanding them. We demystify the process:
   * three watch modes running in parallel, smart rebuild optimization, fast browser
   * reload. Understanding the workflow helps developers work WITH it instead of
   * fighting it.
   *
   * **Project Structure** - A visual map of where things live. New team members
   * can scan this and immediately understand the architecture. "Need to add CSS?
   * Look in src/styles/. Need to edit content? Look in content/." Clarity prevents
   * mistakes.
   *
   * **Configuration** - Points to site.config.yml as the central source of truth.
   * Instead of hunting through five different config files, there's one place to
   * make changes.
   *
   * **Learn More** - Links to Standard Framework documentation. The README shouldn't
   * duplicate the framework docs—it should point to them. This keeps documentation
   * maintainable and always up-to-date.
   *
   * ### Future Improvements
   *
   * - Add troubleshooting section
   * - Include deployment instructions
   * - Add contributing guidelines
   * - Include license information
   * - Add badges (build status, dependencies)
   *
   * @see {file} site.config.yml - Configuration file referenced
   * @see {file} package.json - Scripts documented
   *
   * @link https://www.makeareadme.com/ How to Write a README
   *
   * @example markdown - Extended README sections
   *   ## Deployment
   *
   *   ### Netlify
   *
   *   1. Connect your GitHub repository
   *   2. Set build command: `npm run build`
   *   3. Set publish directory: `_site`
   *   4. Deploy!
   *
   *   ### Vercel
   *
   *   ```bash
   *   vercel --prod
   *   ```
   *
   *   ## Troubleshooting
   *
   *   **CSS not updating?**
   *   - Check that build:css script is running
   *   - Verify public/assets/css/ contains files
   *   - Hard refresh browser (Cmd+Shift+R)
   */
  const readme = `# ${projectName}

A beautiful site built with [Standard Framework](https://standard.ffp.co).

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm start
\`\`\`

This starts an optimized development workflow:
- Watches SCSS files and recompiles CSS on changes
- Watches JS files and recompiles JavaScript on changes
- Runs 11ty dev server with live reload
- CSS/JS changes only trigger browser reload (fast)
- Content changes trigger full 11ty rebuild (as needed)

### Building

\`\`\`bash
npm run build
\`\`\`

### Building individual components

\`\`\`bash
npm run build:css    # Build CSS only
npm run build:js     # Build JavaScript only
\`\`\`

## Configuration

Edit \`site.config.yml\` to customize:
- Site metadata (title, URL, author)
- Build configuration (which files to compile/bundle)
- Navigation structure
- Custom settings

## Project Structure

\`\`\`
${projectName}/
├── content/          # Markdown/HTML content
├── src/
│   ├── styles/      # Custom SCSS files
│   ├── js/          # Custom JavaScript files
│   └── layouts/     # Nunjucks templates
├── public/          # Compiled assets (generated, watched by 11ty)
│   └── assets/
│       ├── css/     # Compiled CSS bundles
│       └── js/      # Compiled JS bundles
├── _site/           # Built site (generated)
├── site.config.yml  # Site & build configuration
├── eleventy.config.js # 11ty configuration
└── package.json     # Dependencies & scripts
\`\`\`

## Learn More

- [Standard Framework Docs](https://standard.ffp.co/docs)
- [Getting Started Guide](https://standard.ffp.co/getting-started)
- [Cheat Sheet](https://standard.ffp.co/cheat-sheet)

---

Built with ❤️ using Standard Framework
`;

  fs.writeFileSync(path.join(projectPath, "README.md"), readme);
  console.log("✅ Created README.md");

  // ==========================================================================
  // CONTENT GENERATION
  // ==========================================================================

  /**
   * Sample Content File - Homepage Template
   *
   * @group Content
   * @since 0.14.0
   *
   * This creates the site's homepage (index.md → index.html). It demonstrates
   * key Standard Framework features:
   *
   * **YAML Frontmatter** - The --- delimited section at the top contains metadata.
   * `layout: base.njk` says "use base layout," `title: Home` sets the page title.
   * 11ty reads this frontmatter and makes it available as template variables.
   *
   * **Markdown Content** - Everything after frontmatter is Markdown, enhanced by
   * Standard Framework. The `{{ site.title }}` syntax works inside Markdown because
   * we set `markdownTemplateEngine: "njk"` in eleventy.config.js. This lets you
   * mix static content with dynamic variables.
   *
   * **Next Steps** - The content guides users through customization. It's not just
   * "Hello World"—it's actionable guidance. Where to change site info, where to
   * add content, where to customize styles, how to start the dev server.
   *
   * This creates a complete experience: generate project, read README, open index.md,
   * see clear instructions, start building. No confusion, no dead ends.
   *
   * @see {file} src/layouts/base.njk - Layout used by this file
   * @see {file} site.config.yml - Variables accessed via {{ site }}
   *
   * @example markdown - Extended homepage
   *   ---
   *   layout: base.njk
   *   title: Home
   *   description: Welcome to my site
   *   ---
   *
   *   # Welcome to {{ site.title }}
   *
   *   This is a **beautiful** site built with Standard Framework.
   *
   *   ## Features
   *
   *   - ✅ Perfect typography with smart quotes
   *   - ✅ Mathematical grid system
   *   - ✅ Automatic light/dark themes
   *   - ✅ Zero JavaScript required (progressive enhancement)
   *
   *   ## Latest Blog Posts
   *
   *   {% for post in collections.posts | reverse | limit(3) %}
   *   - [{{ post.data.title }}]({{ post.url }})
   *   {% endfor %}
   */
  const indexMd = `---
layout: base.njk
title: Home
---

# Welcome to {{ site.title }}

This is your home page. Edit content/index.md to change this.

## Next Steps

1. Customize \`site.config.yml\` with your site information
2. Add content in the \`content/\` directory
3. Customize styles in \`src/styles/custom.scss\`
4. Run \`npm start\` to see your site live

---

Powered by [Standard Framework](https://standard.ffp.co)
`;

  fs.writeFileSync(path.join(projectPath, "content/index.md"), indexMd);
  console.log("✅ Created content/index.md");

  // ==========================================================================
  // GIT CONFIGURATION
  // ==========================================================================

  /**
   * Git Ignore Configuration - Excluding Generated Files
   *
   * @group Configuration
   * @since 0.14.0
   *
   * .gitignore tells Git which files NOT to track. This is crucial for clean
   * repositories and team collaboration. We exclude several categories:
   *
   * **node_modules/** - Contains thousands of files from npm packages. These are
   * listed in package.json, so teammates can install them with `npm install`. Never
   * commit dependencies—it bloats the repo and causes merge conflicts.
   *
   * **public/** - Generated by build scripts. Committing it creates conflicts when
   * two developers rebuild simultaneously. It's reproducible (just run `npm run build`),
   * so there's no reason to track it.
   *
   * **_site/** - Generated by 11ty. Same reasoning as public/—it's build output,
   * not source code. Deploy systems regenerate it from source.
   *
   * **.trigger-reload** - Some watch systems create trigger files. They're temporary
   * signals, not permanent files.
   *
   * **.DS_Store** - macOS creates these hidden files in every directory. They're
   * useless outside macOS and clutter the repo.
   *
   * **.env and .env.local** - Contains secrets (API keys, passwords). NEVER commit
   * these. They're listed in .gitignore by default to prevent accidental leaks.
   * Use .env.example (committed) to show which variables are needed.
   *
   * **\*.log** - Debug and error logs. They're machine-specific and become stale
   * quickly. Don't commit them.
   *
   * This .gitignore follows industry best practices. It keeps repos clean, prevents
   * secrets from leaking, and avoids merge conflicts on generated files.
   *
   * ### Future Improvements
   *
   * - Add IDE-specific exclusions (.vscode, .idea)
   * - Exclude OS-specific files (.Spotlight-V100, Thumbs.db)
   * - Add coverage reports if testing is added
   *
   * @link https://git-scm.com/docs/gitignore Git Ignore Documentation
   * @link https://github.com/github/gitignore Community .gitignore Templates
   *
   * @example gitignore - Extended patterns
   *   # Dependencies
   *   node_modules/
   *   package-lock.json
   *
   *   # Build output
   *   public/
   *   _site/
   *   dist/
   *
   *   # Secrets
   *   .env
   *   .env.local
   *   .env.*.local
   *
   *   # IDE
   *   .vscode/
   *   .idea/
   *   *.swp
   *   *.swo
   *
   *   # OS
   *   .DS_Store
   *   Thumbs.db
   *   desktop.ini
   *
   *   # Logs
   *   *.log
   *   npm-debug.log*
   *
   *   # Testing
   *   coverage/
   *   .nyc_output/
   */
  const gitignore = `node_modules/
public/
_site/
.trigger-reload
.DS_Store
.env
.env.local
*.log
`;

  fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignore);
  console.log("✅ Created .gitignore");

  // ==========================================================================
  // SUCCESS MESSAGE
  // ==========================================================================

  /**
   * Completion Output - Guiding the Next Steps
   *
   * @group User Experience
   * @since 0.14.0
   *
   * This final output isn't just confirmation—it's onboarding. We tell users exactly
   * what to do next: three commands, in order, with clear purpose. No ambiguity,
   * no confusion.
   *
   * The emoji usage (✅ 📂 🎉) isn't frivolous—it creates visual anchors. Your eye
   * instantly spots the success checkmarks, the folder icon, the celebration. This
   * makes the output scannable, memorable, and friendly.
   *
   * We use `\n` for blank lines strategically. Whitespace groups related information
   * and prevents walls of text. Each section has breathing room.
   *
   * The sequence matters: confirmation → next steps → celebration. It's storytelling:
   * "You succeeded. Here's what to do next. You're ready to build something great."
   *
   * @example bash - Full initialization output
   *   🚀 Standard Framework - Project Initializer
   *
   *   📁 Creating project: my-awesome-site
   *
   *      ✅ Created content/
   *      ✅ Created src/styles/
   *      ✅ Created src/js/
   *      ✅ Created src/layouts/
   *      ✅ Created public/assets/css/
   *      ✅ Created public/assets/js/
   *      ✅ Created _site/
   *
   *   ✅ Created site.config.yml
   *   ✅ Created eleventy.config.js
   *   ✅ Created package.json
   *   ✅ Created src/styles/custom.scss
   *   ✅ Created src/js/custom.js
   *   ✅ Created src/layouts/base.njk
   *   ✅ Created README.md
   *   ✅ Created content/index.md
   *   ✅ Created .gitignore
   *
   *   ✅ Project created successfully!
   *
   *   📂 Next steps:
   *
   *      cd my-awesome-site
   *      npm install
   *      npm start
   *
   *   🎉 Your Standard Framework site is ready to go!
   */
  console.log("\n✅ Project created successfully!\n");
  console.log(`📂 Next steps:\n`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm install`);
  console.log(`   npm start\n`);
  console.log("🎉 Your Standard Framework site is ready to go!\n");
} catch (error) {
  console.error("❌ Error creating project:", error.message);
  process.exit(1);
}
