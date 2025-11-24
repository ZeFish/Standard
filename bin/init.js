#!/usr/bin/env node

/**
 * Standard Framework Init - Astro Project Scaffolding Command
 *
 * @group Build Tools
 * @author Francis Fontaine
 * @since 0.15.0
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
 * This script brings that philosophy to Standard Framework for Astro. Run `standard-init`,
 * answer a single question (or accept the default), and get a complete Astro website
 * structure: content directories, build configurations, sample files, layouts,
 * and a development workflow that just works. It creates 15+ files across 6
 * directories, each one carefully positioned to follow Astro and Standard Framework
 * best practices.
 *
 * But this isn't just file creation—it's opinionated architecture. The script
 * establishes a separation of concerns: content/ for writing, src/ for code,
 * public/ for compiled assets, dist/ for output. It wires together the build
 * system with Astro's unified development experience. It configures watch
 * modes, hot reload, and live development. Most importantly, it gets out of
 * your way—every file it creates is meant to be edited, customized, or deleted.
 *
 * The genius of scaffolding isn't eliminating configuration—it's providing
 * intelligent defaults. You can still customize everything, but you start from
 * a working baseline instead of a blank canvas. This reduces decision fatigue
 * ("Where should component files go?"), prevents common mistakes (misconfigured
 * build scripts), and teaches best practices through example (well-structured files).
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
 * @see {file} astro.config.mjs - Astro configuration created
 * @see {file} src/layouts/Base.astro - Base layout template
 * @see {file} src/pages/index.astro - Homepage template
 *
 * @link https://astro.build/ Astro (modern static site generator)
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
 *   npm run dev
 *
 * @example bash - Created project structure
 *   my-site/
 *   ├── content/              # Your content (Markdown files)
 *   │   └── index.md          # Sample homepage content
 *   ├── src/
 *   │   ├── pages/
 *   │   │   ├── index.astro   # Homepage (imports content/index.md)
 *   │   │   └── about.astro   # About page
 *   │   ├── layouts/
 *   │   │   └── Base.astro    # Base layout template
 *   │   ├── components/
 *   │   │   └── Header.astro  # Reusable components
 *   │   └── styles/
 *   │       └── custom.scss   # Your custom styles
 *   ├── public/               # Static assets (images, favicon, etc.)
 *   ├── dist/                 # Built site (generated)
 *   ├── site.config.yml       # Site & build configuration
 *   ├── astro.config.mjs      # Astro configuration
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
 * @since 0.15.0
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
 * @since 0.15.0
 *
 * This points to Standard Framework's installation directory (one level up from
 * bin/). We don't currently use this for copying template files (we generate
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
 * @since 0.15.0
 *
 * The project name comes from command-line arguments (process.argv[2]) or defaults
 * to "standard-site". process.argv is an array: [0] is the node binary path, [1]
 * is the script path, [2] is the first user argument. We use this name for the
 * directory, package.json name field, and README title.
 *
 * projectPath is the absolute filesystem location where we'll create the project.
 * path.resolve() converts the name into an absolute path relative to the current
 * working directory. This ensures cross-platform compatibility.
 */
const projectName = process.argv[2] || "standard-site";
const projectPath = path.resolve(process.cwd(), projectName);

/**
 * Directory Structure
 *
 * @group File System
 * @since 0.15.0
 *
 * Astro has specific expectations about directory structure. We create:
 * - content/ for markdown content files
 * - src/pages/ for .astro page components
 * - src/layouts/ for layout templates
 * - src/components/ for reusable components
 * - src/styles/ for custom styles
 * - public/ for static assets (images, favicon, etc.)
 * - dist/ is generated automatically by Astro
 *
 * This follows Astro's conventions while maintaining Standard Framework's
 * separation of concerns: content is separate from presentation.
 */
const dirs = [
  "content",
  "src/pages",
  "src/layouts",
  "src/components",
  "src/styles",
  "public",
  "dist",
];

/**
 * Recursive Directory Creation
 *
 * @group File System
 * @since 0.15.0
 *
 * Creates a directory and all its parent directories if they don't exist.
 * path.join() ensures cross-platform path separators. fs.mkdirSync() with
 * recursive: true creates the entire tree in one call. We use sync operations
 * because this is a CLI tool that runs once per project creation.
 *
 * @param {string} dirPath - Absolute path to directory
 */
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${path.relative(projectPath, dirPath)}`);
  }
}

/**
 * Project Existence Check
 *
 * @group Validation
 * @since 0.15.0
 *
 * Before creating anything, we check if the target directory already exists.
 * fs.existsSync() is reliable for this. If it exists, we ask for confirmation
 * to avoid accidentally overwriting existing work. This is especially important
 * when developers run the command with a generic name like "my-site" that might
 * already exist.
 *
 * @param {string} projectPath - Absolute path to project directory
 * @returns {boolean} True if project should be created
 */
function shouldCreateProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    const files = fs.readdirSync(projectPath);
    if (files.length > 0) {
      console.log(
        `\n⚠️  Directory "${projectName}" already exists and is not empty.`,
      );
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        readline.question("Do you want to continue? (y/N): ", (answer) => {
          readline.close();
          resolve(
            answer.toLowerCase() === "y" || answer.toLowerCase() === "yes",
          );
        });
      });
    }
  }
  return true;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main Project Creation Flow
 *
 * @group Execution
 * @since 0.15.0
 *
 * This is the main entry point that orchestrates the entire project creation
 * process. It's an async function because we might need to ask for user input
 * if the project directory already exists. The flow is:
 *
 * 1. Check if project should be created (handle existing directories)
 * 2. Create directory structure
 * 3. Generate configuration files
 * 4. Create source files (layouts, pages, components)
 * 5. Generate content files
 * 6. Create package.json and other project files
 * 7. Display success message with next steps
 *
 * Each step is broken into smaller functions for maintainability. The entire
 * process is designed to be idempotent—running it multiple times won't break
 * anything (though it will overwrite existing files).
 */
async function main() {
  console.log(`\n🚀 Creating Standard Framework project: "${projectName}"`);
  console.log(`📍 Location: ${projectPath}\n`);

  // Check if we should proceed
  const shouldProceed = await shouldCreateProject(projectPath);
  if (!shouldProceed) {
    console.log("❌ Project creation cancelled.");
    process.exit(1);
  }

  // Create directory structure
  console.log("📂 Creating directory structure...");
  dirs.forEach((dir) => {
    createDirectory(path.join(projectPath, dir));
  });

  // Generate configuration files
  console.log("\n⚙️  Generating configuration files...");
  generateSiteConfig();
  generateAstroConfig();
  generatePackageJson();

  // Generate source files
  console.log("\n🎨 Creating source files...");
  generateBaseLayout();
  generateIndexPage();
  generateAboutPage();
  generateCustomStyles();

  // Generate content files
  console.log("\n📝 Creating content files...");
  generateIndexContent();
  generateAboutContent();

  // Generate project files
  console.log("\n📄 Creating project files...");
  generateReadme();
  generateGitignore();
  generateEnvExample();

  console.log("\n✅ Project created successfully!");
  console.log("\n📋 Next steps:");
  console.log(`   cd ${projectName}`);
  console.log("   npm install");
  console.log("   npm run dev");
  console.log("\n🎉 Happy building with Standard Framework!\n");
}

// ============================================================================
// CONFIGURATION FILE GENERATION
// ============================================================================

/**
 * Site Configuration Generation
 *
 * @group Configuration
 * @since 0.15.0
 *
 * Creates site.config.yml with Standard Framework configuration. This file
 * contains site metadata (title, description, author) and framework settings
 * (typography features, grid configuration, etc.). The YAML format is chosen
 * for readability and ease of editing. Users can modify these values to
 * customize their site without touching code.
 *
 * @see {file} site.config.yml - Configuration file created
 */
function generateSiteConfig() {
  const siteConfig = `title: "My Standard Site"
description: "A beautiful site built with Standard Framework and Astro"
author:
  name: "Your Name"
  email: "your.email@example.com"
  url: "https://yoursite.com"

# Language and locale settings
language: "en"
locale: "en-US"

# Standard Framework Configuration
standard:
  # Typography features
  typography:
    enableSmartQuotes: true
    enablePunctuation: true
    enableWidowPrevention: true
    enableFractions: true
    enableArrowsAndSymbols: true
    enableNumberFormatting: false
    enableSpacing: false
    locale: "en" # en, fr, de, es, it
    observeDOM: true
    autoProcess: true

  # Grid system configuration
  grid:
    columns: 12
    gap: "1rem"
    containerMaxWidth: "1200px"

  # Color system
  colors:
    primary: "#0066cc"
    secondary: "#6c757d"
    accent: "#28a745"

  # Comments system (optional)
  comments:
    enabled: false
    apiEndpoint: "/api/comments"
    commentsPath: "data/comments"

# Navigation configuration
nav:
  header:
    - href: "/"
      label: "Home"
    - href: "/about"
      label: "About"
    - href: "/contact"
      label: "Contact"

  footer:
    - href: "/privacy"
      label: "Privacy"
    - href: "/terms"
      label: "Terms"

# Build configuration
build:
  outputDir: "dist"
  assetsDir: "assets"
  cssMinify: true
  jsMinify: true

# Development configuration
dev:
  port: 3000
  host: "localhost"
`;

  fs.writeFileSync(path.join(projectPath, "site.config.yml"), siteConfig);
  console.log("✅ Created site.config.yml");
}

/**
 * Astro Configuration Generation
 *
 * @group Configuration
 * @since 0.15.0
 *
 * Creates astro.config.mjs with Standard Framework integration. This file
 * configures Astro to use Standard Framework's plugins, components, and
 * layouts. The configuration enables markdown processing, syntax highlighting,
 * and integrates Standard Framework's typography and layout systems.
 *
 * Key features:
 * - Standard Framework integration with sensible defaults
 * - Markdown processing with syntax highlighting
 * - Component hydration strategy (static by default)
 * - Development server configuration
 *
 * @see {file} astro.config.mjs - Astro configuration file created
 */
function generateAstroConfig() {
  const astroConfig = `import { defineConfig } from "astro/config";
import standard from "@zefish/standard";

export default defineConfig({
  integrations: [
    standard({
      // Typography configuration
      typography: {
        enableSmartQuotes: true,
        enablePunctuation: true,
        enableWidowPrevention: true,
        enableFractions: true,
        locale: "en"
      },

      // Grid system
      grid: {
        columns: 12,
        gap: "1rem"
      },

      // Comments system (disable by default)
      comments: {
        enabled: false
      },

      // Automatically inject useful routes
      injectRoutes: true
    })
  ],

  // Markdown configuration
  markdown: {
    syntaxHighlight: "prism",
    shikiConfig: {
      langs: [],
      wrap: false,
      theme: "github-light"
    }
  },

  // Server configuration
  server: {
    port: 3000,
    host: "localhost"
  },

  // Build configuration
  build: {
    format: "directory",
    assets: "assets"
  },

  // Output configuration (static site)
  output: "static",

  // Vite configuration
  vite: {
    server: {
      fs: {
        allow: [".."]
      }
    }
  }
});
`;

  fs.writeFileSync(path.join(projectPath, "astro.config.mjs"), astroConfig);
  console.log("✅ Created astro.config.mjs");
}

/**
 * Package.json Generation
 *
 * @group Configuration
 * @since 0.15.0
 *
 * Creates package.json with Astro and Standard Framework dependencies.
 * The scripts section provides common development tasks:
 * - dev: Start development server with hot reload
 * - build: Build for production
 * - preview: Preview production build locally
 * - check: Run type checking (if TypeScript is added later)
 *
 * Dependencies are kept minimal—Astro and Standard Framework provide
 * most functionality. Users can add more packages as needed.
 *
 * @see {file} package.json - NPM package configuration created
 */
function generatePackageJson() {
  const packageJson = {
    name: projectName,
    version: "0.1.0",
    description: "A beautiful site built with Standard Framework and Astro",
    type: "module",
    scripts: {
      dev: "astro dev",
      start: "astro dev",
      build: "astro build",
      preview: "astro preview",
      check: "astro check",
      "check:watch": "astro check --watch",
      format: "prettier --write .",
    },
    keywords: [
      "standard-framework",
      "astro",
      "typography",
      "design-system",
      "static-site",
    ],
    author: "Your Name",
    license: "MIT",
    dependencies: {
      "@zefish/standard": "latest",
      astro: "^5.0.0",
    },
    devDependencies: {
      "@astro/check": "^0.8.0",
      typescript: "^5.0.0",
      prettier: "^3.0.0",
      "prettier-plugin-astro": "^0.14.0",
    },
    engines: {
      node: ">=18.0.0",
    },
  };

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
  console.log("✅ Created package.json");
}

// ============================================================================
// SOURCE FILE GENERATION
// ============================================================================

/**
 * Base Layout Generation
 *
 * @group Layouts
 * @since 0.15.0
 *
 * Creates src/layouts/Base.astro, the main layout template that all pages
 * will use. This layout:
 * - Imports Standard Framework's Base layout for consistency
 * - Provides slots for header, main content, and footer customization
 * - Includes proper SEO meta tags
 * - Loads Standard Framework CSS and typography engine
 * - Handles responsive design and accessibility
 *
 * The layout uses Astro's component syntax and slots system to provide
 * flexibility while maintaining consistency across the site.
 *
 * @see {file} src/layouts/Base.astro - Main layout template created
 */
function generateBaseLayout() {
  const baseLayout = `---
// Import Standard Framework's Base layout
import Base from "@zefish/standard/layouts/Base.astro";

// Import site configuration
import config from "virtual:standard/config";

// Import Standard Framework CSS
import "@zefish/standard/css";
import "@zefish/standard/theme";

// Import components
import Menu from "@zefish/standard/components/Menu.astro";
import Comments from "@zefish/standard/components/Comments.astro";

// Extract props with defaults
const {
  title = config.title || "My Standard Site",
  description = config.description || "A beautiful site built with Standard Framework",
  image,
  created,
  modified,
  tags,
  class: className,
} = Astro.props;

// Site navigation
const navItems = config.nav?.header || [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];
---

<!-- Use Standard Framework's Base layout -->
<Base
  title={title}
  description={description}
  image={image}
  created={created}
  modified={modified}
  tags={tags}
  class={className}
>
  <!-- Custom header slot -->
  <header slot="header" class="site-header">
    <div class="container">
      <nav class="main-nav">
        <Menu items={navItems} />
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main class="main-content prose">
    <div class="container">
      <slot />
    </div>
  </main>

  <!-- Comments section (if enabled) -->
  {config.standard?.comments?.enabled && (
    <section slot="comments" class="comments-section">
      <div class="container">
        <Comments />
      </div>
    </section>
  )}

  <!-- Custom footer slot -->
  <footer slot="footer" class="site-footer">
    <div class="container">
      <p>&copy; {new Date().getFullYear()} {config.author?.name || "Your Name"}.
         Built with <a href="https://github.com/ZeFish/Standard">Standard Framework</a>.
      </p>
    </div>
  </footer>
</Base>

<style>
  /* Site-specific styles that work with Standard Framework */
  .site-header {
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
    padding-block: var(--spacing-base);
  }

  .main-content {
    min-height: 60vh;
    padding-block: var(--spacing-xl);
  }

  .container {
    max-width: var(--line-width, 65rem);
    margin-inline: auto;
    padding-inline: var(--spacing-base);
  }

  .site-footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding-block: var(--spacing-l);
    margin-block-start: var(--spacing-xl);
  }

  .site-footer p {
    text-align: center;
    color: var(--color-subtle);
    margin: 0;
  }

  .site-footer a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .site-footer a:hover {
    text-decoration: underline;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding-inline: var(--spacing-s);
    }
  }
</style>
`;

  fs.writeFileSync(
    path.join(projectPath, "src/layouts/Base.astro"),
    baseLayout,
  );
  console.log("✅ Created src/layouts/Base.astro");
}

/**
 * Index Page Generation
 *
 * @group Pages
 * @since 0.15.0
 *
 * Creates src/pages/index.astro, the homepage template. This page:
 * - Imports content from content/index.md for the main content
 * - Uses the Base layout for consistent styling
 * - Demonstrates Standard Framework features
 * - Provides a welcoming introduction to the site
 *
 * The page follows Astro's file-based routing—index.astro becomes the root
 * route (/). The content is separated into a markdown file for easy editing.
 *
 * @see {file} src/pages/index.astro - Homepage template created
 */
function generateIndexPage() {
  const indexPage = `---
import Base from "../layouts/Base.astro";
import * as IndexContent from "../../content/index.md";
import config from "virtual:standard/config";
---

<Base
  title={IndexContent.frontmatter?.title || config.title}
  description={IndexContent.frontmatter?.description || config.description}
>
  <!-- Hero section -->
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">{config.title}</h1>
      <p class="hero-description">{config.description}</p>
      <div class="hero-actions">
        <a href="/about" class="button button-primary">Learn More</a>
        <a href="/contact" class="button button-secondary">Get in Touch</a>
      </div>
    </div>
  </section>

  <!-- Main content from markdown -->
  <section class="content-section">
    <div class="container">
      <IndexContent.Content />
    </div>
  </section>

  <!-- Features section -->
  <section class="features-section">
    <div class="container">
      <h2>Built with Standard Framework</h2>
      <div class="features-grid">
        <div class="feature">
          <h3>🎨 Beautiful Typography</h3>
          <p>Smart quotes, proper dashes, and perfect spacing automatically applied to your content.</p>
        </div>
        <div class="feature">
          <h3>📐 Swiss Grid System</h3>
          <p>Professional 12-column layouts inspired by Josef Müller-Brockmann's design principles.</p>
        </div>
        <div class="feature">
          <h3>🎯 Vertical Rhythm</h3>
          <p>Every element aligns to a mathematical baseline grid for perfect visual harmony.</p>
        </div>
        <div class="feature">
          <h3>🌙 Automatic Theming</h3>
          <p>Light and dark modes that respect user preferences and maintain accessibility.</p>
        </div>
      </div>
    </div>
  </section>
</Base>

<style>
  .hero {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    color: white;
    padding-block: var(--spacing-xxl);
    text-align: center;
  }

  .hero-title {
    font-size: var(--scale-4xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-base);
    line-height: var(--line-height-tight);
  }

  .hero-description {
    font-size: var(--scale-lg);
    margin-bottom: var(--spacing-xl);
    opacity: 0.9;
    max-width: 40rem;
    margin-inline: auto;
  }

  .hero-actions {
    display: flex;
    gap: var(--spacing-base);
    justify-content: center;
    flex-wrap: wrap;
  }

  .content-section {
    padding-block: var(--spacing-xxl);
  }

  .features-section {
    background: var(--color-surface);
    padding-block: var(--spacing-xxl);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }

  .feature {
    padding: var(--spacing-l);
    background: var(--color-background);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .feature h3 {
    margin-bottom: var(--spacing-base);
    color: var(--color-primary);
  }

  .button {
    display: inline-block;
    padding: var(--spacing-s) var(--spacing-l);
    border-radius: var(--border-radius-md);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all 0.2s ease;
  }

  .button-primary {
    background: var(--color-accent);
    color: white;
  }

  .button-primary:hover {
    background: var(--color-accent);
    transform: translateY(-1px);
  }

  .button-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .button-secondary:hover {
    background: white;
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: var(--scale-3xl);
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
`;

  fs.writeFileSync(path.join(projectPath, "src/pages/index.astro"), indexPage);
  console.log("✅ Created src/pages/index.astro");
}

/**
 * About Page Generation
 *
 * @group Pages
 * @since 0.15.0
 *
 * Creates src/pages/about.astro, a simple about page that demonstrates
 * the layout system and provides a template for additional pages. This
 * page shows how to create new pages that follow the established patterns.
 *
 * @see {file} src/pages/about.astro - About page template created
 */
function generateAboutPage() {
  const aboutPage = `---
import Base from "../layouts/Base.astro";
import * as AboutContent from "../../content/about.md";
import config from "virtual:standard/config";
---

<Base
  title="About - {config.title}"
  description="Learn more about this site and the Standard Framework"
>
  <div class="container">
    <h1>About This Site</h1>
    <AboutContent.Content />
  </div>
</Base>

<style>
  .container {
    max-width: var(--line-width, 65rem);
    margin-inline: auto;
    padding-inline: var(--spacing-base);
  }

  h1 {
    margin-bottom: var(--spacing-xl);
  }
</style>
`;

  fs.writeFileSync(path.join(projectPath, "src/pages/about.astro"), aboutPage);
  console.log("✅ Created src/pages/about.astro");
}

/**
 * Custom Styles Generation
 *
 * @group Styles
 * @since 0.15.0
 *
 * Creates src/styles/custom.scss for user customizations. This file:
 * - Imports Standard Framework's main stylesheet
 * - Provides a place for site-specific customizations
 * - Shows how to override design tokens
 * - Demonstrates best practices for extending the framework
 *
 * Users can add their own styles here without modifying the framework
 * files directly, making updates easier.
 *
 * @see {file} src/styles/custom.scss - Custom styles file created
 */
function generateCustomStyles() {
  const customStyles = `// Import Standard Framework
@import "@zefish/standard/css";

// ============================================================================
// CUSTOM STYLES
// ============================================================================
// Add your custom styles here. These will be processed by Astro's build system.

// Example: Custom color overrides
:root {
  // Override design tokens
  --color-primary: #2563eb;
  --color-accent: #dc2626;
  --font-family-heading: "Inter", system-ui, sans-serif;
}

// Example: Custom component styles
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
}

.my-custom-component {
  padding: var(--spacing-l);
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

// Example: Custom utility classes
.text-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Example: Responsive customizations
@media (max-width: 768px) {
  .hero {
    padding-block: var(--spacing-xl);
  }

  .my-custom-component {
    padding: var(--spacing-base);
  }
}
`;

  fs.writeFileSync(
    path.join(projectPath, "src/styles/custom.scss"),
    customStyles,
  );
  console.log("✅ Created src/styles/custom.scss");
}

// ============================================================================
// CONTENT FILE GENERATION
// ============================================================================

/**
 * Index Content Generation
 *
 * @group Content
 * @since 0.15.0
 *
 * Creates content/index.md, the homepage content in markdown format.
 * This demonstrates how content is separated from presentation in
 * Standard Framework. Users can edit this file to change the homepage
 * content without touching any code.
 *
 * The content showcases Standard Framework features and provides
 * a welcoming introduction to the site.
 *
 * @see {file} content/index.md - Homepage content created
 */
function generateIndexContent() {
  const indexContent = `---
title: "Welcome to My Standard Site"
description: "A beautiful, fast, and accessible website built with Standard Framework and Astro"
---

# Welcome to My Standard Site

This site is built with **Standard Framework** and **Astro**, combining the best of modern static site generation with classical design principles.

## What Makes This Special

Standard Framework is built on centuries of typographic tradition, mathematical precision, and the timeless principles of Swiss International Style.

### 🎨 Fine-Art Typography
Every text element automatically gets:
- Smart quotes ("curly quotes" instead of "straight quotes")
- Proper dashes (— em-dashes and – en-dashes)
- Ellipsis (…) instead of three dots
- Fraction formatting (½, ¼, ¾)
- Widow and orphan prevention

### 📐 Swiss Grid System
Professional 12-column layouts inspired by Josef Müller-Brockmann:
- Mobile-first responsive design
- Asymmetric layouts supported
- Free column positioning
- Mathematical precision

### 🎯 Vertical Rhythm
Every element aligns to a baseline grid:
- Consistent spacing between elements
- Perfect vertical alignment
- Mathematical spacing units
- Beautiful, readable layouts

### 🌙 Automatic Theming
Built-in light and dark mode support:
- Respects user's system preference
- High contrast mode support
- Semantic color system
- WCAG AA accessibility

## Getting Started

1. **Edit this content** - Modify \`content/index.md\` to change this page
2. **Add new pages** - Create \`.md\` files in the \`content/\` directory
3. **Customize styling** - Edit \`src/styles/custom.scss\` for custom styles
4. **Configure site** - Modify \`site.config.yml\` for site settings

## Next Steps

- [Read the documentation](https://github.com/ZeFish/Standard)
- [Explore the components](/about)
- [Customize your site](#)
- [Deploy to your favorite platform](#)

---

*Built with precision. Crafted with care. Designed for the long haul.*
`;

  fs.writeFileSync(path.join(projectPath, "content/index.md"), indexContent);
  console.log("✅ Created content/index.md");
}

/**
 * About Content Generation
 *
 * @group Content
 * @since 0.15.0
 *
 * Creates content/about.md, sample content for the about page.
 * This demonstrates the content structure and provides a template
 * for additional content pages.
 *
 * @see {file} content/about.md - About page content created
 */
function generateAboutContent() {
  const aboutContent = `---
title: "About This Site"
description: "Learn more about this website and the technology behind it"
---

# About This Site

This website is built using modern web technologies and time-tested design principles.

## Technology Stack

### Astro
A modern static site generator that delivers lightning-fast performance:
- Zero JavaScript by default
- Partial hydration for interactive components
- File-based routing
- Built-in optimization

### Standard Framework
A comprehensive design system focused on typography and layout:
- Classical typography rules
- Swiss grid system
- Vertical rhythm
- Mathematical precision

### Design Principles

#### Mathematical Precision
Every measurement derives from the golden ratio (φ = 1.618):
- Base spacing: 1.5rem (24px)
- Scale multipliers: 1.5, 2.25, 3.375, 5.063
- Typography: 1.618 ratio between heading levels

#### Swiss International Style
Clean, objective design with:
- 12-column grid system
- Mathematical grid-based layouts
- Hierarchy through scale and weight
- Minimal, functional aesthetics

#### Classical Typography
Rules from masters of print design:
- Locale-aware smart quotes
- Proper punctuation and spacing
- Widow/orphan prevention
- Optimal reading width

## Performance

This site is optimized for speed and accessibility:
- ⚡ Lightning-fast loading
- 📱 Mobile-first responsive design
- ♿ WCAG AA accessibility compliance
- 🔍 SEO-friendly structure
- 🌙 Automatic dark mode support

## Customization

The site is highly customizable:
- **Content**: Edit markdown files in \`content/\`
- **Styling**: Modify \`src/styles/custom.scss\`
- **Configuration**: Update \`site.config.yml\`
- **Layout**: Customize \`src/layouts/Base.astro\`

## Learn More

- [Standard Framework Documentation](https://github.com/ZeFish/Standard)
- [Astro Documentation](https://docs.astro.build/)
- [Web Typography Resources](https://practicaltypography.com/)

---

*Questions? Feel free to [get in touch](/contact).*
`;

  fs.writeFileSync(path.join(projectPath, "content/about.md"), aboutContent);
  console.log("✅ Created content/about.md");
}

// ============================================================================
// PROJECT FILE GENERATION
// ============================================================================

/**
 * README Generation
 *
 * @group Documentation
 * @since 0.15.0
 *
 * Creates README.md with project documentation and getting started guide.
 * This provides essential information for developers who work on the project
 * and users who want to understand the setup.
 *
 * @see {file} README.md - Project documentation created
 */
function generateReadme() {
  const readme = `# ${projectName}

A beautiful, fast, and accessible website built with [Standard Framework](https://github.com/ZeFish/Standard) and [Astro](https://astro.build/).

## Features

- 🎨 **Fine-Art Typography** - Smart quotes, proper dashes, fractions, and widow prevention
- 📐 **Swiss Grid System** - Professional 12-column responsive layouts
- 🎯 **Vertical Rhythm** - Perfect baseline grid alignment
- 🌙 **Automatic Theming** - Light/dark mode with accessibility support
- ⚡ **Lightning Fast** - Static site generation with Astro
- 📱 **Mobile First** - Responsive design from the ground up
- ♿ **Accessible** - WCAG AA compliant by default

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone or download this project**
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser:**
   Navigate to \`http://localhost:3000\`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

The built site will be in the \`dist/\` directory.

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── content/              # Your content (Markdown files)
│   ├── index.md          # Homepage content
│   └── about.md          # About page content
├── src/
│   ├── pages/
│   │   ├── index.astro   # Homepage template
│   │   └── about.astro   # About page template
│   ├── layouts/
│   │   └── Base.astro    # Main layout template
│   ├── components/       # Reusable components
│   └── styles/
│       └── custom.scss   # Your custom styles
├── public/               # Static assets (images, favicon, etc.)
├── site.config.yml       # Site configuration
├── astro.config.mjs      # Astro configuration
└── package.json          # Dependencies and scripts
\`\`\`

## Customization

### Content
Edit markdown files in the \`content/\` directory:
- \`content/index.md\` - Homepage content
- \`content/about.md\` - About page content

### Styling
Modify \`src/styles/custom.scss\` to customize the design:
- Override design tokens
- Add custom components
- Create utility classes

### Configuration
Update \`site.config.yml\` to configure:
- Site metadata (title, description, author)
- Typography features
- Grid system settings
- Navigation menus
- Color schemes

### Layout
Customize \`src/layouts/Base.astro\` for:
- Header and footer content
- Additional sections
- Custom styling

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run check\` - Run type checking
- \`npm run format\` - Format code with Prettier

## Technology

- **[Astro](https://astro.build/)** - Static site generator
- **[Standard Framework](https://github.com/ZeFish/Standard)** - Design system
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Prettier](https://prettier.io/)** - Code formatting

## Design Principles

### Mathematical Precision
Every measurement derives from the golden ratio (φ = 1.618):
- Base spacing: 1.5rem (24px)
- Scale multipliers: 1.5, 2.25, 3.375, 5.063
- Typography: 1.618 ratio between heading levels

### Swiss International Style
Clean, objective design with:
- 12-column grid system
- Mathematical grid-based layouts
- Hierarchy through scale and weight
- Minimal, functional aesthetics

### Classical Typography
Rules from masters of print design:
- Locale-aware smart quotes
- Proper punctuation and spacing
- Widow/orphan prevention
- Optimal reading width

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- JavaScript features are progressive enhancement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file.

## Resources

- [Standard Framework Documentation](https://github.com/ZeFish/Standard)
- [Astro Documentation](https://docs.astro.build/)
- [Web Typography Resources](https://practicaltypography.com/)

---

Built with ❤️ using Standard Framework and Astro
`;

  fs.writeFileSync(path.join(projectPath, "README.md"), readme);
  console.log("✅ Created README.md");
}

/**
 * Gitignore Generation
 *
 * @group Configuration
 * @since 0.15.0
 *
 * Creates .gitignore with appropriate exclusions for an Astro project.
 * This prevents committing build artifacts, dependencies, and sensitive
 * files that shouldn't be in version control.
 *
 * Key exclusions:
 * - node_modules/ - Dependencies (restored with npm install)
 * - dist/ - Built site (regenerated on build)
 * - .astro/ - Astro's build cache
 * - .env - Environment variables (may contain secrets)
 *
 * @see {file} .gitignore - Git exclusions created
 */
function generateGitignore() {
  const gitignore = `# Dependencies
node_modules/

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

  fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignore);
  console.log("✅ Created .gitignore");
}

/**
 * Environment Example Generation
 *
 * @group Configuration
 * @since 0.15.0
 *
 * Creates .env.example to show users what environment variables they can
 * configure. This file serves as documentation and a template for creating
 * the actual .env file. Environment variables are useful for:
 * - API keys and secrets
 * - Configuration that varies by environment
 * - Third-party service credentials
 *
 * @see {file} .env.example - Environment template created
 */
function generateEnvExample() {
  const envExample = `# Environment Configuration
# Copy this file to .env and fill in your actual values

# Site Configuration
SITE_URL=https://yoursite.com
SITE_TITLE="Your Site Title"
SITE_DESCRIPTION="Your site description"

# Author Information
AUTHOR_NAME="Your Name"
AUTHOR_EMAIL="your.email@example.com"
AUTHOR_URL="https://yoursite.com"

# Social Media (optional)
TWITTER_HANDLE="@yourhandle"
GITHUB_USERNAME="yourusername"
LINKEDIN_URL="https://linkedin.com/in/yourprofile"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Comments System (optional - requires setup)
# GITHUB_TOKEN="ghp_your_token_here"
# GITHUB_OWNER="your-github-username"
# GITHUB_REPO="your-repository-name"
# GITHUB_COMMENTS_PATH="data/comments"
# MODERATION_EMAIL="admin@example.com"

# Contact Form (optional)
# CONTACT_EMAIL="contact@yoursite.com"
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"

# Development
NODE_ENV="development"
`;

  fs.writeFileSync(path.join(projectPath, ".env.example"), envExample);
  console.log("✅ Created .env.example");
}

// ============================================================================
// SCRIPT EXECUTION
// ============================================================================

// Run the main function
main().catch((error) => {
  console.error("❌ Error creating project:", error);
  process.exit(1);
});
