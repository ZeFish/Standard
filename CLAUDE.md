AI RULES

**Purpose**: Help Claude AI (and other developers) understand the Standard Framework codebase quickly and effectively.



---

## Quick Facts

- **Type**: Multi-component design system (11ty plugin + CSS framework + JS library + Cloudflare functions)
- **Version**: 0.10.52
- **License**: MIT
- **Package**: `@zefish/standard`
- **Philosophy**: Fine-art typography, Swiss grid systems, mathematical precision (golden ratio)
- **Size**: 15KB CSS + 2KB JS (gzipped)
- **Dependencies**: Zero runtime dependencies (build-only: Sass, 11ty, Terser)

---

## Repository Structure

```
Standard/
├── src/
│   ├── eleventy/              ← 11ty plugin system (main entry)
│   │   ├── eleventy.js        ← Plugin orchestrator
│   │   ├── down.js        ← Markdown processing
│   │   ├── filter.js          ← Template filters
│   │   ├── shortcode.js       ← Template shortcodes
│   │   ├── backlinks.js       ← Wiki-style backlinks
│   │   ├── encryption.js      ← Content encryption
│   │   ├── preprocessor.js    ← Markdown preprocessing
│   │   ├── doc-parser.js      ← Documentation parsing
│   │   └── doc-generator.js   ← Auto-doc generation
│   ├── js/
│   │   ├── standard.js        ← Main typography engine (2.2.0)
│   │   └── standard.lab.js    ← Experimental features
│   ├── cloudflare/            ← Serverless Cloudflare functions
│   │   ├── api/
│   │   │   ├── comments.js    ← Simplified comments API endpoint
│   │   │   └── contact.js     ← Simplified contact API endpoint
│   │   └── example.js         ← Example function
│   ├── js/
│   │   ├── standard.js        ← Main typography engine (2.2.0)
│   │   ├── standard.lab.js    ← Experimental features
│   │   └── standard.comment.js ← Browser library for comments
│   ├── styles/
│   │   ├── standard.scss      ← Entry point
│   │   ├── standard-00-variables.scss
│   │   ├── standard-01-token.scss
│   │   ├── standard-02-color.scss
│   │   ├── standard-03-typography.scss
│   │   ├── standard-04-elements.scss
│   │   ├── standard-05-rhythm.scss
│   │   ├── standard-06-grid.scss
│   │   ├── standard-07-prose.scss
│   │   ├── standard-08-img.scss
│   │   ├── standard-09-md.scss
│   │   ├── standard-98-utilities.scss
│   │   └── standard-99-debug.scss
│   └── layouts/               ← Nunjucks templates
│       ├── base.njk           ← Root template
│       ├── meta.njk           ← Meta tags
│       ├── article.njk        ← Article layout
│       ├── component.njk      ← Component docs
│       ├── readme.njk         ← README layout
│       └── encrypted.njk      ← Encrypted content
├── content/                   ← Documentation site content
│   ├── 11ty/                  ← 11ty plugin guides
│   ├── css/                   ← CSS framework docs
│   ├── cloudflare/            ← Cloudflare docs
│   ├── docs/                  ← Auto-generated API docs
│   ├── example/               ← Example files
│   ├── template/              ← Template files
│   └── assets/                ← Fonts, images
├── dist/                      ← Compiled output
│   ├── standard.css           ← Unminified
│   ├── standard.min.css       ← Minified
│   ├── standard.js            ← Unminified
│   ├── standard.min.js        ← Minified
│   └── standard.lab.js        ← Lab features (minified)
├── scripts/                   ← Build utilities
├── package.json               ← NPM config
├── eleventy.config.js         ← 11ty config for docs site
└── README.md                  ← Main project README
```

---

## Documentation Architecture

### The Framework Builds Its Own Website

The Standard Framework is **self-documenting**. The same build system that creates the package also generates and serves comprehensive documentation.

**Documentation Flow**:
```
README.md (root)
    ↓
content/README.md (synced by eleventy.config.js)
    ↓
_site/index.html
    ↓
(served at https://standard.ffp.co)
```

**Three Types of Documentation**:

1. **User Guides** (`content/11ty/`, `content/css/`, `content/cloudflare/`)
   - Hand-written markdown files
   - Explain *how* to use the framework
   - Located in `content/` directories
   - Examples: `getting-started.md`, `typography.md`, `filters.md`

2. **API Documentation** (`content/docs/`)
   - **Auto-generated from JSDoc comments** in source code
   - Runs during build via `DocGenerator` plugin
   - Extracts `@component`, `@category`, `@description`, `@example` tags
   - Updated automatically when source code changes
   - Organized by category (11ty-plugins, foundation, colors, etc.)

3. **README Sync**
   - `README.md` (root) is the source of truth
   - **Automatically copied** to `content/README.md` before each build
   - Becomes `/index.html` on the site
   - Prevents duplication, ensures consistency

### How Documentation Generation Works

**DocGenerator Plugin** (`src/eleventy/doc-generator.js`):

```javascript
eleventyConfig.addPlugin(DocGenerator, {
  sourceDir: "src",
  patterns: [
    "styles/**/*.scss",    // Scan SCSS files
    "js/**/*.js",          // Scan JavaScript
    "eleventy/**/*.js"     // Scan 11ty plugins
  ],
  outputDir: "content/docs",
  layout: "component"      // Template for doc pages
});
```

**Features**:
- ✅ Scans source files for JSDoc comments with `@component` tag
- ✅ Extracts component name, category, description, parameters, examples
- ✅ Generates markdown files in `content/docs/`
- ✅ **Caches results** — Only regenerates if source files changed (SHA256 hash comparison)
- ✅ Skips regeneration if nothing changed (`.doc-generator-hash` file)
- ✅ Auto-generates category index pages

**Example: A Documented Component**

```javascript
/**
 * @component My Typography Filter
 * @category Typography
 * @description Applies typography enhancements to text.
 * Converts smart quotes, dashes, and fractions.
 *
 * @param {string} text The text to enhance
 * @param {object} options Configuration options
 * @returns {string} Enhanced text
 *
 * @example
 * // In template
 * {{ content | myTypographyFilter }}
 */
export function myTypographyFilter(text, options = {}) {
  // Implementation
}
```

↓ **Becomes** ↓

```markdown
# My Typography Filter

**Category**: Typography

Applies typography enhancements to text.
Converts smart quotes, dashes, and fractions.

## Usage

```
{{ content | myTypographyFilter }}
```

## Parameters

- `text` (string) — The text to enhance
- `options` (object) — Configuration options

## Returns

- (string) Enhanced text
```

### README & Claude.md Sync Mechanism

**In `eleventy.config.js`**: Both files are automatically synced before each build:

**Sync Pattern**:
- `README.md` (root) → `content/README.md` → `_site/index.html`
- `claude.md` (root) → `content/claude.md` → `_site/claude/index.html`

**Implementation**:

```javascript
// Watch for changes
eleventyConfig.addWatchTarget("README.md");
eleventyConfig.addWatchTarget("claude.md");

// Before each build, sync both files
eleventyConfig.on("eleventy.before", () => {
  // Sync README.md
  const readmeSrc = join(__dirname, "README.md");
  const readmeDest = join(__dirname, "content", "README.md");

  if (fs.existsSync(readmeSrc)) {
    const srcContent = fs.readFileSync(readmeSrc, "utf-8");
    const destContent = fs.existsSync(readmeDest)
      ? fs.readFileSync(readmeDest, "utf-8")
      : null;

    // Only write if changed (prevents infinite watch loop)
    if (srcContent !== destContent) {
      fs.writeFileSync(readmeDest, srcContent, "utf-8");
    }
  }

  // Sync claude.md
  const claudeSrc = join(__dirname, "claude.md");
  const claudeDest = join(__dirname, "content", "claude.md");

  if (fs.existsSync(claudeSrc)) {
    const srcContent = fs.readFileSync(claudeSrc, "utf-8");
    const destContent = fs.existsSync(claudeDest)
      ? fs.readFileSync(claudeDest, "utf-8")
      : null;

    // Only write if changed (prevents infinite watch loop)
    if (srcContent !== destContent) {
      fs.writeFileSync(claudeDest, srcContent, "utf-8");
    }
  }
});
```

**Benefits**:
- ✅ Single source of truth in root directory
- ✅ Only one file to edit for each
- ✅ Auto-rendered with proper frontmatter during build
- ✅ Accessible as web pages on documentation site
- ✅ Prevents sync issues and duplication
- ✅ Watch mode detects changes immediately

### Documentation Site Build Process

```
npm run build
    ↓
1. Compile assets (CSS/JS)
2. Run DocGenerator
   - Scan src/ for JSDoc comments
   - Generate content/docs/*.md
   - Save hash to .doc-generator-hash
3. Sync README.md → content/README.md
4. Run 11ty
   - Input: content/
   - Includes: src/layouts/
   - Output: _site/
5. Copy dist/ → _site/assets/standard/
6. Copy content/assets/ → _site/assets/
    ↓
_site/ ready for deployment
```

---

## Documentation Best Practices

### When You Modify Source Code

**Always update corresponding documentation:**

| Code Change | Documentation to Update |
|-------------|--------------------------|
| Add new 11ty plugin | `content/11ty/index.md` + add JSDoc to file |
| Add new CSS utility | `content/css/utilities.md` + add JSDoc to SCSS |
| Add new JS method | JSDoc in `src/js/standard.js` (auto-generates) |
| Add new feature flag | `content/11ty/getting-started.md` + JSDoc |
| Add new locale | `content/css/internationalization.md` + update JSDoc |
| Fix a bug | Update JSDoc `@example` to reflect correct behavior |
| Add new shortcode | `content/11ty/shortcodes.md` + add JSDoc to file |

### JSDoc Structure for Auto-Doc Generation

```javascript
/**
 * @component Name of the Component
 * @category Category (e.g., "Typography", "Grid", "11ty Plugins")
 * @description Human-readable description of what this does.
 * Can span multiple lines and explain the purpose clearly.
 *
 * @param {type} paramName Description of this parameter
 * @param {type} optionalParam Description (optional)
 *
 * @returns {type} What does this return or do?
 *
 * @prop {type} propertyName Description of property
 *
 * @example
 * // Show concrete usage example
 * const result = componentName(input);
 * console.log(result); // Shows expected output
 *
 * @since 0.10.0
 */
```

### Hand-Written Documentation Files

For guides and tutorials, create `.md` files in:
- `content/11ty/` — 11ty plugin guides
- `content/css/` — CSS framework documentation
- `content/cloudflare/` — Cloudflare functions guides
- `content/` — General guides

Structure:
```markdown
---
layout: layouts/article.njk
title: Feature Name
description: One-line description
---

# Feature Name

## Overview

Explain what this feature is and why someone would use it.

## Getting Started

Step-by-step guide to get started.

## Examples

Real-world usage examples.

## API Reference

Reference to auto-generated API docs.

## See Also

- [[Related Feature]]
- [[Another Feature]]
```

### Auto-Generated vs Hand-Written

**Auto-Generated** (`content/docs/`):
- ✅ Always in sync with source code
- ✅ Technical API reference
- ✅ Extracted from JSDoc comments
- ✅ Should be comprehensive and precise

**Hand-Written** (`content/`):
- ✅ Conceptual explanations
- ✅ Getting started guides
- ✅ Tutorial walkthroughs
- ✅ Best practices
- ✅ Examples and use cases

---

## The Four Core Components

### 1. **11ty Plugin System** (`src/eleventy/`)

**Entry Point**: `src/eleventy/eleventy.js`

**What It Does**:
- Main plugin orchestrator that registers all sub-plugins
- Handles asset copying (CSS/JS to output directory)
- Provides shortcodes: `{% standardAssets %}` and `{% standardLab %}`
- Can use local files or CDN

**Key Sub-Plugins**:
| Plugin | File | Purpose |
|--------|------|---------|
| Markdown | `markdown.js` | Enhanced markdown with syntax highlighting, callouts, footnotes |
| Filter | `filter.js` | Template filters (excerpt, image extraction, date formatting) |
| ShortCode | `shortcode.js` | Custom template shortcodes |
| Backlinks | `backlinks.js` | Wiki-style `[[page]]` links with auto-backlinks |
| Encryption | `encryption.js` | Password-protected content (SHA256 + XOR, client-side decryption) |
| PreProcessor | `preprocessor.js` | Markdown preprocessing (escapes code blocks) |
| DocGenerator | `doc-generator.js` | Auto-generates API docs from JSDoc comments |

**How to Use**:
```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",  // Where to copy files
    copyFiles: true,                // Copy from node_modules
    useCDN: false,                  // Use local vs CDN
    escapeCodeBlocks: []            // Languages to escape
  });
}
```

---

### 2. **JavaScript Typography Engine** (`src/js/standard.js`)

**Version**: 2.2.0

**What It Does**:
- Implements classical typography rules that CSS cannot handle
- Processes text nodes while preserving HTML structure
- Supports 5 locales with locale-specific rules
- Auto-detects language from `<html lang>` attribute

**Key Features**:

| Feature | Purpose | Controlled By |
|---------|---------|---------------|
| Smart Quotes | Converts straight quotes to curly quotes (locale-aware) | `enableSmartQuotes` |
| Punctuation | Converts `--` to em-dash, `...` to ellipsis, `-` to en-dash | `enablePunctuation` |
| Fractions | Converts `1/2` to `½` using Unicode | `enableFractions` |
| Arrows & Symbols | Converts `->` to `→`, `(c)` to `©` | `enableArrowsAndSymbols` |
| Number Formatting | Adds locale-specific thousands separators | `enableNumberFormatting` |
| Spacing | Fixes spacing around punctuation (French thin spaces) | `enableSpacing` |
| Widow Prevention | Prevents single word on last line (orphan prevention) | `enableWidowPrevention` |
| Image Zoom | Click to zoom images with arrow navigation | Built-in |

**Supported Locales**:
- `en` (English) - comma separators
- `fr` (French) - thin space separators, guillemets
- `de` (German) - period separators, German quotes
- `es` (Spanish) - period separators, guillemets
- `it` (Italian) - period separators, guillemets

**How to Use**:
```javascript
// Auto-initialization (in browser)
const standard = new Standard({
  enableSmartQuotes: true,
  enablePunctuation: true,
  enableWidowPrevention: true,
  enableFractions: true,
  enableArrowsAndSymbols: true,
  locale: 'en',                    // Auto-detect if null
  observeDOM: true,                // Watch for dynamic content
  autoProcess: true,               // Process on init
  batchSize: 50,                   // Process in batches
  debounceDelay: 100
});

// Process specific elements
await standard.process('p, li, h1, h2, h3');

// Update options
standard.updateOptions({ enableSmartQuotes: false });

// Listen to events
document.addEventListener('standard:afterProcessAll', (e) => {
  console.log(`Processed ${e.detail.processedCount} elements`);
});
```

**Performance**:
- ✅ Batch processing prevents UI blocking
- ✅ TreeWalker preserves HTML structure
- ✅ Element caching prevents reprocessing
- ✅ MutationObserver debouncing for dynamic content
- ✅ Zero runtime dependencies

**Important Notes**:
- Skips elements with `translate="no"` attribute
- Skips `<code>`, `<pre>`, `<script>`, `<style>` tags
- Can exclude elements via data attributes: `data-standard-quotes="false"`
- Auto-initializes on page load (aggressive by default)

---

### 3. **CSS Framework** (`src/styles/`)

**Entry Point**: `src/styles/standard.scss`

**Architecture**: ITCSS-inspired 12-layer system

| Layer | File | Purpose |
|-------|------|---------|
| 0 | `standard-00-variables.scss` | CSS custom properties, design tokens |
| 1 | `standard-01-token.scss` | Token system setup |
| 2 | `standard-02-color.scss` | Color system, light/dark theming |
| 3 | `standard-03-typography.scss` | Font scales, sizing, weights, text utilities |
| 4 | `standard-04-elements.scss` | HTML element styling (h1-h6, buttons, forms, links) |
| 5 | `standard-05-rhythm.scss` | Vertical rhythm, baseline grid, spacing |
| 6 | `standard-06-grid.scss` | 12-column responsive grid |
| 7 | `standard-07-prose.scss` | Editorial layouts, measure, reading experience |
| 8 | `standard-08-img.scss` | Image system, responsive, zoom |
| 9 | `standard-09-md.scss` | Markdown-generated elements |
| 98 | `standard-98-utilities.scss` | Utility classes, mixins |
| 99 | `standard-99-debug.scss` | Debug utilities |

**Key Design System Concepts**:

- **Golden Ratio**: φ = 1.618 — all measurements derive from this
- **Vertical Rhythm**: `1rlh` unit — all elements align to baseline grid
- **Baseline Trim**: Modern support detection with `@supports` for `text-box-trim`
- **Responsive Grid**: 12-column system with free column positioning
- **Color System**: Automatic light/dark theming, high-contrast mode support
- **Reading Width**: Optimized for ~60 characters per line (content measure)

**Key Classes**:
```css
.rhythm              /* Apply vertical rhythm */
.reading             /* Reading layout optimizations */
.grid                /* 12-column grid container */
.col-{1-12}          /* Column sizing (1-12 columns) */
.md:col-{1-12}       /* Tablet breakpoint */
.lg:col-{1-12}       /* Desktop breakpoint */
```

**Customization via CSS Variables**:
```css
:root {
  --color-accent: #0066cc;
  --color-background: #ffffff;
  --font-family-serif: "Georgia", serif;
  --font-family-sans: "system-ui", sans-serif;
  --line-width: 60rem;  /* Optimal reading width */
  --rhythmline-trim-support: 0;  /* Set to 1 when supported */
}
```

---

### 4. **Cloudflare Pages Functions System** (`src/cloudflare/`)

**What It Does**:
- Integrates **Cloudflare Pages Functions** (serverless functions) with 11ty
- Copies function files to `functions/` directory for automatic deployment
- Provides GitHub-backed comments system with moderation workflow
- Includes client-side library for comment rendering and form handling
- CORS-enabled for cross-domain requests

**Important**: This uses **Cloudflare Pages Functions**, NOT Wrangler. Functions are deployed automatically when you push to GitHub via Cloudflare Pages.

**How to Use**:
```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    comments: { enabled: true }  // Copies comments handler to functions/api/comments.js
  });
}
```

**Configuration via Environment Variables**:
Set these in your Cloudflare Pages project settings:

1. **Local Development** (`.env` file):
```bash
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
GITHUB_TOKEN=ghp_your_token              # Personal access token with repo scope
GITHUB_COMMENTS_PATH=data/comments
MODERATION_EMAIL=admin@example.com
```

2. **Production** (Cloudflare Pages Dashboard):
Navigate to Pages → Your Project → Settings → Environment Variables → Production:
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_COMMENTS_PATH`
- `MODERATION_EMAIL`

**What's Included**:

**Cloudflare Pages Functions**:
- `src/cloudflare/api/comments.js` → `functions/api/comments.js` (auto-deployed)
  - Handles GET requests: Fetch comments for a page from GitHub
  - Handles POST requests: Store new comments as Markdown files in GitHub
  - Automatic moderation flag (approval before displaying)
  - CORS-enabled for cross-domain requests
  - Stored in: `data/comments/{pageId}/{timestamp}-{hash}.md`

- `src/cloudflare/api/contact.js` → `functions/api/contact.js` (optional contact form)

**Client-Side Library**:
- `src/js/standard.comment.js` — `GitHubComments` browser class
  - Load and display comments from API
  - Render nested/threaded comments with visual hierarchy
  - Handle form submission with validation
  - Format timestamps (e.g., "2 hours ago")
  - Parse and display Markdown content
  - Optional polling for real-time updates

**11ty Shortcodes**:
- `{% standardComment %}` — Renders semantic HTML form + auto-initializes from `comment: true` frontmatter
- `{% initComments "page-id" %}` — Manual initialization for advanced use cases

**Features**:
- ✅ Comments stored as Markdown files in GitHub (easy to review/moderate)
- ✅ Moderation workflow (approval before displaying to users)
- ✅ Threaded/nested comments with visual nesting hierarchy
- ✅ Markdown support: **bold**, *italic*, `code`, [links](url)
- ✅ Semantic HTML forms with ARIA labels for accessibility
- ✅ Client-side validation (name, email, content required)
- ✅ Real-time updates with optional polling
- ✅ CORS-enabled for cross-domain requests
- ✅ Auto-formatted relative timestamps

**Usage in Pages**:
```markdown
---
layout: base.njk
comment: true
---

# My Article

Your content here...

{% standardComment %}
```

That's it! The `standardComment` shortcode automatically:
- ✅ Creates the comments container and form
- ✅ Renders semantic HTML (fieldset, legend, proper labels)
- ✅ Auto-initializes the comments system when `comment: true` in frontmatter
- ✅ Generates page ID from file slug
- ✅ Loads existing comments from GitHub
- ✅ Handles form submission
- ✅ Displays user-friendly error/success messages

**Deployment to Cloudflare Pages**:
1. Connect your GitHub repository to Cloudflare Pages
2. In Cloudflare dashboard, set environment variables (see Configuration section above)
3. Push to GitHub → Cloudflare automatically builds and deploys
4. Functions are served at `/api/comments` and `/api/contact`

**Comment Storage in GitHub**:
```
data/
  comments/
    blog/
      my-post/
        1729609945000-a7x9k2m1.md
        1729609967000-b4z2k9p3.md
```

Each comment is a Markdown file with YAML frontmatter:
```yaml
---
id: 1729609945000-a7x9k2m1
pageId: blog/my-post
author: "John Doe"
email: "john@example.com"
parentId: null
createdAt: 2024-10-22T15:32:25.000Z
approved: false
spam: false
---

This is the comment content. Supports **markdown**.
```

---

## Build System

**Commands**:
```bash
npm start              # Dev server (11ty on port 8090)
npm dev                # Watch CSS/JS and rebuild
npm build              # Full production build
npm run build:assets   # Compile CSS/JS only
npm run build:css      # SCSS → CSS
npm run build:js       # Copy/minify JS
npm release            # Version release
```

**Build Pipeline**:
1. SCSS compilation (Sass)
2. JavaScript minification (Terser)
3. Version injection
4. 11ty static site generation
5. Asset copying (including function files to `functions/`)

---

## Key Design Principles

### 1. **Mathematical Precision**
- Golden ratio (φ = 1.618) applied to all measurements
- Vertical rhythm prevents visual chaos
- Proportional scaling for typography

### 2. **Classical Typography**
- Smart quotes with locale awareness
- Proper dashes and punctuation
- Widow/orphan prevention
- Fraction formatting
- Multi-locale support (EN, FR, DE, ES, IT)

### 3. **Swiss International Style**
- 12-column grid system (Josef Müller-Brockmann)
- Clean, objective design
- Mathematical grid-based layout
- Hierarchy through scale and weight

### 4. **Zero Configuration**
- Works beautifully out of the box
- Sensible defaults
- Optional customization via CSS variables

### 5. **Progressive Enhancement**
- Core experience without JavaScript
- JavaScript enhances, doesn't require
- Features degrade gracefully
- Mobile-first responsive design

### 6. **Zero Runtime Dependencies**
- Pure CSS and vanilla JavaScript
- No framework required
- Minimal attack surface
- Works in all modern browsers

---

## How to Understand New Code

When exploring a new file:

1. **Check the JSDoc header** — Look for `@component`, `@category`, `@description`, `@example`
2. **Look for exports** — What does this file expose?
3. **Trace dependencies** — What imports does it need?
4. **Find the main function/class** — Is it a plugin, utility, component?
5. **Review test cases** — Examples in JSDoc show intended usage
5. **Review test cases** — Examples in JSDoc show intended usage

### Example: Understanding `standard.js`

```javascript
// 1. JSDoc header explains purpose
/**
 * Standard Framework - Fine-Art Typography Management
 * A comprehensive framework implementing classical typography rules...
 */

// 2. Class definition is the main export
class Standard {
  constructor(options = {}) {
    // Default options tell you what this does
    this.options = {
      enableSmartQuotes: false,
      enablePunctuation: false,
      enableWidowPrevention: false,
      // ...
    };
  }

  // 3. Methods are well-organized
  init() { }
  detectLocale() { }
  getRulesForLocale(locale) { }
  processElement(element) { }
  fixQuotes(text, rules) { }
  // ...
}

// 4. Auto-initialization shows intended behavior
if (typeof window !== "undefined") {
  window.Standard = Standard;
  window.standard = new Standard({
    autoProcess: true,
    observeDOM: true,
    enableWidowPrevention: true,
    // ...
  });
}
```

---

## Common Tasks & Where to Find Them

| Task | Code Location | Documentation Location | Notes |
|------|----------------|----------------------|-------|
| Add 11ty plugin feature | New file in `src/eleventy/` | Add JSDoc to file (auto-docs) + update `content/11ty/index.md` | Add `@component`, `@category`, `@description` tags |
| Add template filter | Add method to `src/eleventy/filter.js` | Add JSDoc to method + update `content/11ty/filters.md` | Document all parameters and return values |
| Add CSS utility class | New SCSS in `src/styles/standard-07-utilities.scss` | Add JSDoc to SCSS file + update `content/css/utilities.md` | Explain responsive variants if applicable |
| Add locale to typography | Add to `getRulesForLocale()` in `src/js/standard.js` | Update JSDoc example + add to `content/css/internationalization.md` | Add locale-specific rules dictionary |
| Add color variant | Add to `src/styles/standard-02-color.scss` | Add CSS variable comment + update `content/css/colors.md` | Document light/dark mode behavior |
| Add feature flag | Add to options in relevant file | Update JSDoc `@param` + update `content/11ty/getting-started.md` | Explain what it controls |
| Fix a bug | Fix in source file | Update JSDoc `@example` to reflect correct behavior | Verify auto-docs regenerate |
| Update README | Edit `README.md` (root) | Will auto-sync to `content/README.md` and `_site/index.html` | Changes take effect after next build |
| Add example | Create in `content/example/` | Create `.html` or `.md` file | Reference in relevant user guide |
| Modify build process | Edit `package.json` scripts | Document in `content/11ty/advanced.md` if user-facing | Update version in `CHANGELOG.md` |

### Important: Build & Documentation Workflow

**When making code changes:**

```bash
# 1. Make your changes to src/
# 2. Update JSDoc comments (they auto-generate docs)
# 3. Update hand-written docs in content/
# 4. Rebuild to verify:
npm run build

# This will:
# - Compile your code
# - Auto-generate docs from JSDoc
# - Sync README.md
# - Build the documentation site
# - Output to _site/

# 5. Check _site/ to verify docs look correct
# 6. Commit both code AND documentation changes
```

**Before releasing:**

```bash
npm run build          # Full build
npm test               # If tests exist
npm run changelog      # Auto-generate CHANGELOG
npm release            # Version bump + release
```

---

## Architecture Strengths

✅ **Modularity** — Each component is independently usable
✅ **Extensibility** — Plugin architecture allows growth
✅ **Performance** — Batch processing, caching, debouncing
✅ **Accessibility** — WCAG AA compliant, keyboard navigation
✅ **Maintainability** — Clear patterns, comprehensive JSDoc
✅ **Scalability** — No monolithic bloat
✅ **Zero Dependencies** — Minimal runtime footprint

---

## Potential Improvements

🟡 **Auto-initialization Control** — `standard.js` starts processing automatically; consider adding opt-in flag
🟡 **Image Zoom Performance** — CSS injection could be precompiled
🟡 **Error Reporting** — Could have better user-friendly error messages
🟡 **Version Pinning** — Document tested dependency version ranges
🟡 **Cloudflare Utilities** — Could provide more helper functions

🟡 eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    stylesheet: "/pretty-atom-feed.xsl",
    collection: { name: "public", limit: 10 },
    metadata: {
      language: metadata.language,
      title: metadata.title,
      subtitle: metadata.description,
      base: metadata.url,
      author: { name: metadata.author.name },
    },
  });

🟡   add layout sitemap also on public collection by default
🟡 image service to cloudflare
🟡 code and table wraper for horizontal scrolling
🟡 contact form
🟡 shortCode
🟡 .flow -> .column
🟡 localization
🟡 Create a print special css
    @media print {
        .no-print,
        .no-print *,
        .footer,
        .header{
            display: none !important;
        }
        body {
            padding: 0;
        }
    }


---

## File Reading Order (Recommended)

For newcomers, read files in this order:

1. **README.md** — Philosophy and features
2. **src/eleventy/eleventy.js** — Plugin entry point
3. **src/js/standard.js** — Typography engine (understand the complexity)
4. **src/styles/standard.scss** — CSS architecture overview
5. **eleventy.config.js** — How everything ties together
6. **package.json** — Build scripts and dependencies
7. **src/eleventy/cloudflare.js** — Cloudflare integration
8. **src/eleventy/markdown.js** — Markdown processing

---

## Questions to Ask When Modifying Code

- **Does this break the single responsibility principle?**
- **Are we adding runtime dependencies?**
- **Is performance still O(n) or better?**
- **Does this work across all supported locales?**
- **Is this documented in JSDoc?** ← **CRITICAL**
- **Are hand-written docs updated in `content/`?** ← **CRITICAL**
- **Will auto-docs regenerate correctly?** ← **CRITICAL**
- **Is this tested with dynamic content (MutationObserver)?**
- **Does this respect the mathematical/golden ratio principles?**

---

## Documentation-Code Synchronization Checklist

**CRITICAL**: Code changes MUST be accompanied by documentation updates. This is not optional.

### Before Committing Code

- [ ] **JSDoc Updated** — Add/update `@component`, `@category`, `@description`, `@example` tags
- [ ] **Hand-Written Docs Updated** — Update corresponding `.md` files in `content/`
- [ ] **Ran `npm run build`** — Verified auto-docs regenerate correctly
- [ ] **Checked `_site/`** — Verified documentation site renders correctly
- [ ] **Tested Examples** — Ran all examples in JSDoc comments
- [ ] **Verified Category** — Correct `@category` tag (11ty Plugins, CSS, Typography, etc.)

### Files That Auto-Sync

These files **automatically** update during build (don't edit directly):

- `content/README.md` — Auto-synced from `README.md` (root)
- `content/docs/*.md` — Auto-generated from JSDoc comments
- `_site/index.html` — Built from `content/README.md`
- `_site/docs/*.html` — Built from auto-generated docs
- `.doc-generator-hash` — Cache file (do not commit)

### Files You MUST Edit

These files require manual updates:

- `README.md` (root) — Edit this, not `content/README.md`
- `content/11ty/*.md` — Hand-written 11ty guides
- `content/css/*.md` — Hand-written CSS guides
- `content/cloudflare/*.md` — Hand-written Cloudflare guides
- Source files with JSDoc — Update `@component`, `@description`, `@example`

### Example: Adding a New Filter

**Step 1: Add Code**
```javascript
// src/eleventy/filter.js

/**
 * @component Truncate Filter
 * @category 11ty Plugins
 * @description Truncate text to a maximum length with ellipsis.
 *
 * @param {string} text Text to truncate
 * @param {number} length Maximum length (default: 100)
 * @returns {string} Truncated text
 *
 * @example
 * {{ "Hello World" | truncate(5) }}
 * // Output: "Hello…"
 */
export function truncateFilter(text, length = 100) {
  return text.slice(0, length) + (text.length > length ? "…" : "");
}
```

**Step 2: Update Hand-Written Docs**
```markdown
# content/11ty/filters.md

## Truncate

Truncates text to a maximum length with ellipsis.

### Usage

```nunjucks
{{ title | truncate(50) }}
{{ content | truncate }}
```

### See Also

- [[Extract First Image Filter]]
- [[Excerpt Filter]]
```

**Step 3: Rebuild & Verify**
```bash
npm run build
# Check _site/docs/truncate-filter.md exists
# Check _site/11ty/filters/index.html contains reference
```

**Step 4: Commit**
```bash
git add src/eleventy/filter.js content/11ty/filters.md
git commit -m "feat: add truncate filter"
```

### Files to Include in Commits

```bash
# Code changes
src/eleventy/filter.js

# Hand-written docs
content/11ty/filters.md

# Auto-generated docs regenerate during build
# (don't commit content/docs/ or .doc-generator-hash)

# Don't commit
_site/                # Generated, re-created on each build
dist/                 # Compiled assets, generated by build
node_modules/         # Dependency cache
.doc-generator-hash   # Build cache file
```

### Git Workflow

```bash
# Make changes to code and docs
nano src/js/standard.js
nano content/css/typography.md

# Build and verify
npm run build

# Check what changed
git status

# Stage only source files (NOT generated files)
git add src/ content/

# Verify your changes look good
git diff --cached

# Commit
git commit -m "feat: add new typography feature

- New Smart Quotes feature
- Updated typography documentation
- Added locale-specific examples"

# Don't commit generated files:
# ❌ content/docs/
# ❌ _site/
# ❌ .doc-generator-hash
```

### Common Mistakes to Avoid

❌ **DON'T**: Edit `content/docs/*.md` directly (they regenerate)
✅ **DO**: Edit JSDoc comments in source files

❌ **DON'T**: Edit `content/README.md` directly (it syncs from root)
✅ **DO**: Edit `README.md` in the root directory

❌ **DON'T**: Commit `_site/` directory
✅ **DO**: Let CI/CD build it

❌ **DON'T**: Skip updating `content/` user guides
✅ **DO**: Always update conceptual docs alongside code

❌ **DON'T**: Add features without JSDoc
✅ **DO**: Write comprehensive JSDoc before committing

---

## Key Resources

- **Project Homepage**: https://github.com/ZeFish/Standard
- **NPM Package**: https://www.npmjs.com/package/@zefish/standard
- **Inspiration**: "The Elements of Typographic Style" by Robert Bringhurst
- **Grid System**: Josef Müller-Brockmann's Swiss typography
- **11ty**: https://www.11ty.dev/

---

## Version History Context

**v0.10.52** — Current version
- 4 major components (11ty plugin, CSS, JS lib, Cloudflare)
- 2.2.0 JavaScript engine
- 5 supported locales
- Comprehensive auto-doc generation

---

## Meta: How to Use This File

This file is designed for Claude (and other AI systems) to quickly understand the codebase. When working on Standard:

1. **Reference this file** when explaining architecture
2. **Update this file** when adding major features
3. **Cross-reference** to specific files using `file:line_number` format
4. **Add examples** for new patterns
5. **Keep it current** with the codebase

---

## Quick Reference: The Documentation Cycle

Every code change follows this cycle:

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT CYCLE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Write/modify code in src/                              │
│     └─ Add/update JSDoc comments                           │
│                                                             │
│  2. Update hand-written docs                               │
│     └─ content/11ty/*.md                                   │
│     └─ content/css/*.md                                    │
│     └─ content/cloudflare/*.md                             │
│                                                             │
│  3. Run: npm run build                                     │
│     └─ Compile CSS/JS                                      │
│     └─ Auto-generate docs from JSDoc                       │
│     └─ Sync README.md → content/README.md                  │
│     └─ Build 11ty site → _site/                            │
│                                                             │
│  4. Verify: Check _site/ for correctness                   │
│     └─ Auto-docs generated correctly?                      │
│     └─ Hand-written docs appear?                           │
│     └─ Examples work?                                      │
│                                                             │
│  5. Commit: git add src/ content/                          │
│     └─ Include code + hand-written docs                    │
│     └─ Do NOT commit _site/, dist/, .doc-generator-hash    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Documentation Structure Summary

```
Standard Framework Documentation

├─ README.md (root)
│  └─ ✏️ Edit this for homepage changes
│
├─ content/ (hand-written guides)
│  ├─ 11ty/
│  │  ├─ index.md (11ty overview)
│  │  ├─ getting-started.md
│  │  ├─ filters.md
│  │  ├─ backlinks.md
│  │  └─ ... (conceptual guides)
│  │
│  ├─ css/
│  │  ├─ index.md (CSS overview)
│  │  ├─ typography.md
│  │  ├─ grid.md
│  │  └─ ... (CSS guides)
│  │
│  ├─ cloudflare/
│  │  ├─ index.md
│  │  ├─ setup.md
│  │  └─ ... (Cloudflare guides)
│  │
│  └─ docs/ (⚠️ AUTO-GENERATED)
│     ├─ 11ty-plugins-index.md
│     ├─ standard-framework-11ty-plugin.md
│     ├─ markdown-plugin.md
│     └─ ... (generated from JSDoc)
│
├─ src/ (source code with JSDoc)
│  ├─ eleventy/
│  │  ├─ eleventy.js (JSDoc comments)
│  │  ├─ markdown.js (JSDoc comments)
│  │  ├─ filter.js (JSDoc comments)
│  │  └─ ... (all have JSDoc)
│  │
│  ├─ js/
│  │  └─ standard.js (JSDoc comments)
│  │
│  ├─ styles/
│  │  └─ standard-*.scss (JSDoc comments)
│  │
│  └─ layouts/
│     └─ *.njk (templates)
│
└─ _site/ (⚠️ GENERATED OUTPUT)
   ├─ index.html (from README.md)
   ├─ 11ty/
   ├─ css/
   ├─ cloudflare/
   ├─ docs/
   └─ assets/standard/
```

**Legend**:
- ✏️ = Edit directly
- ⚠️ = Auto-generated, don't edit manually
- (no marker) = Source files with JSDoc

---

**Last Updated**: October 2024
**Maintained By**: Francis Fontaine
**Purpose**: AI-friendly architecture documentation with documentation-as-code emphasis

**Key Principle**: In Standard Framework, **documentation is not separate from code — it is part of the build process**. Every feature must be documented in JSDoc, reflected in hand-written guides, and verified during build.

---

## Observations, Suggestions & Improvements Log

### Recently Implemented ✅

✅ **Documentation Site Restructuring & Simplification** (v0.10.53+)
- **Change**: Simplified opening sections across all CSS documentation pages
- **Rationale**: Reduce cognitive load on readers, make docs more scannable and navigable
- **Files Modified**:
  - `content/css/prose.md` — Simplified intro from multi-section philosophy to: "Create beautifully styled, readable articles with automatic vertical rhythm, optimal line lengths, and professional typography."
  - `content/css/grid.md` — Simplified to: "Build responsive layouts with flexible CSS Grid. Mobile-first approach with automatic responsive columns and proper spacing."
  - `content/css/typography.md` — Simplified to: "Master font scales, sizes, weights, and line heights based on the golden ratio for perfect readability and visual harmony."
  - `content/css/colors.md` — Simplified to: "A semantic color system with automatic light/dark theme support that respects user preferences and guarantees WCAG AA accessibility."
  - `content/css/spacing.md` — Simplified intro, removed philosophy sections
  - `content/css/utilities.md` — Added `.no-bullet` utility documentation with visual examples
  - `content/css/index.md` — Simplified CSS overview intro
  - `content/11ty/index.md` — Simplified 11ty overview intro
  - `content/getting-started.md` — Restructured with "Choose Your Path" approach
- **Key Addition**: Quick Navigation sections added to all CSS pages with links to related documentation
- **Benefits**:
  - ✅ Reduced time to find relevant information
  - ✅ Consistent navigation structure across all documentation
  - ✅ Removed redundant philosophy sections
  - ✅ Clearer "Quick Navigation" at top of each page
- **Scope**: 8 documentation files updated with consistent patterns
- **Breaking Change**: No — content still accurate, just more concise
- **Verification**: All 60+ documentation pages built successfully with 0 errors

✅ **Header Navigation Implementation** (v0.10.53+)
- **Change**: Added main site header with navigation in base.njk template
- **Files Modified**:
  - `src/layouts/base.njk` — Added `<header>` element with navigation bar
- **Navigation Links**: Home, CSS, 11ty, Cloudflare, Docs, Getting Started, Cheat Sheet
- **Styling**:
  - Used flexbox layout (site title left, nav links right)
  - Applied `.no-bullet` utility class to remove default list bullets
  - Responsive design with proper spacing
- **Benefits**:
  - ✅ Consistent navigation across all documentation pages
  - ✅ Easy access to major sections from any page
  - ✅ Professional appearance with clear hierarchy
- **Implementation Details**:
  - Header positioned at top of page
  - Uses semantic `<nav>` element
  - Maintains accessibility standards
- **Verification**: Builds successfully, renders correctly on all pages

✅ **Inline List Spacing & `.no-bullet` Utility Class** (v0.10.53+)
- **Change**: Added automatic handling of inline lists with CSS and documented `.no-bullet` utility
- **Files Modified**:
  - `src/styles/standard-05-rhythm.scss` — Added CSS rules for inline lists:
    ```scss
    ul:where(.display-flex, [style*="display: flex"], [style*="display:flex"]) li,
    ol:where(.display-flex, [style*="display: flex"], [style*="display:flex"]) li {
        margin-block-end: 0;
    }
    ```
  - `content/css/utilities.md` — Added `.no-bullet` utility documentation with visual examples
- **How It Works**:
  - Detects flex/inline lists via `.display-flex` class or inline flex styles
  - Automatically removes bottom margin from `<li>` elements
  - Uses `:where()` selector for zero specificity to avoid conflicts
- **Benefits**:
  - ✅ No manual `list-style: none` needed for navigation
  - ✅ CSS-only solution, works with or without helper class
  - ✅ Automatic detection of inline layouts
  - ✅ Proper spacing on navigation lists
- **Documentation Updated**: Utilities.md includes visual examples showing default vs. navigation lists
- **Verification**: SCSS compiled successfully, no conflicts

✅ **Font Size Inheritance for `.small` and `.smaller` Classes** (v0.10.53+)
- **Change**: Fixed cascade issue where utility classes weren't affecting nested elements
- **Problem**: `.smaller` class on footer wasn't affecting nested `<p>` tags with explicit `font-size` rules
- **Files Modified**:
  - `src/styles/standard-04-elements.scss` — Added comprehensive font-size inheritance:
    ```scss
    small {
        font-size: var(--scale-d2);
    }

    .small {
        font-size: var(--scale-d2);
    }

    .small * {
        font-size: inherit;
    }

    .smaller {
        font-size: var(--scale-d3);
    }

    .smaller * {
        font-size: inherit;
    }
    ```
- **Solution Approach**: Universal selector `*` with `font-size: inherit;` ensures ALL children adopt parent's font size
- **Why This Works**:
  - `inherit` keyword flows parent value to all descendants
  - Universal selector reaches all nested elements
  - Zero specificity :where() ensures cascade works properly
- **Benefits**:
  - ✅ All nested elements (p, span, em, strong, etc.) inherit correctly
  - ✅ Works with arbitrary nesting depth
  - ✅ Future-proof for new HTML elements added inside
  - ✅ Semantic HTML elements (`<small>`, `<sub>`, `<sup>`) now styled correctly
- **Scope**: Fixed for both `.small` and `.smaller` utility classes, plus `<small>` element
- **Breaking Change**: No — enhances existing functionality
- **Verification**: SCSS compiled successfully, tested with nested elements

✅ **Prism Syntax Highlighting Enhancement** (v0.10.53+)
- **Change**: Expanded and reorganized Prism syntax highlighting to support 5+ languages with semantic color tokens
- **Files Modified**:
  - `src/styles/standard-02-color.scss` — Major expansion of Prism token styling (lines 264-458)
- **Languages Supported**:
  - **HTML** — Tags (yellow), attributes (orange), values (green)
  - **Bash/Shell** — Commands (yellow), variables (cyan), strings (green), builtins (red)
  - **Nunjucks/Jinja** — Tags (yellow, matching HTML), attributes (orange), variables (cyan)
  - **Markdown** — Using semantic tokens: `--color-bold`, `--color-italic`, `--color-header`
  - **YAML** — Keys (orange), literals (cyan)
- **Language-Agnostic Tokens**:
  - Keywords: `--color-red`
  - Strings: `--color-green`
  - Numbers: `--color-cyan`
  - Functions: `--color-yellow`
  - Properties: `--color-orange`
  - Comments: `--color-subtle`
- **Semantic Color Tokens in Markdown**:
  - Bold text: `var(--color-bold)`
  - Italic text: `var(--color-italic)`
  - Headers: `var(--color-header)`
  - Reason: Automatic theme support, respects light/dark mode
- **Nunjucks Color Consistency**:
  - **Correction**: Updated Nunjucks to follow HTML color syntax (not separate colors)
  - Tags: `var(--color-yellow)` (was red, now matches HTML)
  - Attributes: `var(--color-orange)` (consistent with HTML)
  - Template variables: `var(--color-cyan)` (distinct for clarity)
- **Implementation Details**:
  - ~200 lines of organized CSS selectors
  - Language-specific targeting via `.language-*` classes
  - Minimal yet comprehensive coverage
  - Zero performance impact
- **Benefits**:
  - ✅ Professional syntax highlighting across all commonly-used languages
  - ✅ Consistent colors (language-agnostic base + language-specific overrides)
  - ✅ Semantic tokens ensure theme consistency
  - ✅ Nunjucks colors now match HTML for visual coherence
  - ✅ Markdown uses design tokens (future-proof for theme changes)
- **Scope**: Comprehensive coverage of 5+ programming languages
- **Breaking Change**: No — enhances existing functionality
- **Verification**: All syntax highlighting renders correctly, SCSS compiled successfully

✅ **Utilities Layer Moved to Position 98** (v0.10.52+)
- **Change**: Moved utilities layer to position 98 (between content layers and debug)
- **Rationale**: Utilities should come near the end, before debug utilities (layer 99)
- **Files Renamed**:
  - `standard-08-utilities.scss` → `standard-98-utilities.scss`
  - `standard-09-img.scss` → `standard-08-img.scss`
  - `standard-10-md.scss` → `standard-09-md.scss`
- **Files Modified**:
  - `src/styles/standard.scss` — Updated @use import order
  - `claude.md` — Updated SCSS layer table and repository structure
- **Benefits**:
  - ✅ Utilities positioned logically near debug layer
  - ✅ Clear separation: content/objects (0-9) vs. utilities (98) vs. debug (99)
  - ✅ Allows room for future content layers without renumbering utilities
- **New Layer Order**:
  - Layers 0-7: Core design system (variables, tokens, color, typography, elements, rhythm, grid, prose)
  - Layers 8-9: Content generators (img, md)
  - Layer 98: Utility classes and mixins
  - Layer 99: Debug utilities
- **Breaking Change**: No — CSS output identical
- **Verification**: SCSS compilation successful

✅ **Elements Layer & File Renumbering** (v0.10.52+)
- **Change**: Created new `standard-04-elements.scss` layer consolidating HTML element styling
- **Rationale**: Follow ITCSS best practice - layer 4 for generic elements, move before layer 5 (objects/rhythm)
- **Files Created**:
  - `src/styles/standard-04-elements.scss` — New comprehensive element styling layer
    - Contains: h1-h6, p, a, button, button.button (link-styled buttons), form inputs, labels, checkboxes, radios, code, pre
    - 300+ lines of organized element styling with full JSDoc documentation
- **Files Renamed/Renumbered**:
  - `standard-04-rhythm.scss` → `standard-05-rhythm.scss`
  - `standard-05-grid.scss` → `standard-06-grid.scss`
  - `standard-06-prose.scss` (formerly `reading.scss`) → `standard-07-prose.scss`
  - `standard-07-utilities.scss` → `standard-08-utilities.scss` (later moved to 98)
  - `standard-08-img.scss` → `standard-09-img.scss` (later moved to 08)
  - `standard-09-md.scss` → `standard-10-md.scss` (later moved to 09)
  - **Deleted**: `standard-11-button.scss` (functionality moved to elements layer)
- **Files Modified**:
  - `src/styles/standard.scss` — Updated all @use imports to reflect new numbering
  - `src/styles/standard-02-color.scss` — Removed element styling (links, buttons, form elements)
  - `src/styles/standard-03-typography.scss` — Removed element styling (headings, buttons, forms)
- **Benefits**:
  - ✅ Cleaner separation of concerns (typography tokens vs. element rules)
  - ✅ Follows ITCSS standard layer ordering
  - ✅ Single responsibility principle for each layer
  - ✅ Button styling consolidated in one place (no more standard-11-button.scss duplication)
  - ✅ Element styling logically grouped before utilities
- **Scope**:
  - 11 SCSS files renamed/renumbered
  - Updated standard.scss imports
  - Removed element styling from color and typography files
  - Left design tokens intact in color and typography files
- **Breaking Change**: No — CSS output remains the same, internal structure improved
- **Documentation Updated**:
  - JSDoc in standard-04-elements.scss (comprehensive with examples)
  - SCSS layer table in claude.md updated
  - File structure diagram updated
  - Import statements in standard.scss reflect new numbering
- **Backward Compatible**: Yes — No breaking changes to CSS output
- **Verification**:
  - SCSS compilation successful after syntax fixes
  - All imports updated and verified
  - Redundant button file deleted and removed from imports

✅ **Rhythm Class Applied to HTML Root** (v0.10.52)
- **Change**: Moved `.rhythm` class from `<body>` to `<html>` element
- **Files Changed**:
  - `src/styles/standard-04-rhythm.scss` — Updated selectors
  - `src/layouts/base.njk` — Added class to `<html>`
- **Benefits**:
  - ✅ True root-level styling (best practice)
  - ✅ Better CSS cascade and inheritance
  - ✅ Works with out-of-flow content (modals, portals)
  - ✅ Aligns with industry standards
- **Documentation Updated**:
  - JSDoc comments in rhythm SCSS file
  - `content/css/spacing.md` — New section on `.rhythm` class
  - Body padding now only applies to `<body>` when rhythm active
- **Backward Compatible**: Yes — `.rhythm` on containers still works

✅ **Reading Class Renamed to Prose** (v0.10.52+)
- **Change**: Renamed `.reading` class to `.prose` throughout framework
- **Rationale**: `.prose` is more intuitive and aligns with industry standard (Tailwind, etc.)
- **Files Changed**:
  - `src/styles/standard-06-reading.scss` — SCSS entry point and all selectors
  - `src/layouts/base.njk` — Footer element class
  - `content/template/simple.md` — Example template
  - All documentation files updated (content/css/*, content/docs/*, etc.)
  - JSDoc comments updated with new naming
- **Scope**:
  - 30+ files updated
  - Auto-generated docs regenerated
  - All examples and guides updated
- **Breaking Change**: Yes — Class name changed from `.reading` to `.prose`
  - Migration: Simple find/replace `.reading` → `.prose`
  - All `.reading.small`, `.reading.feature` etc. → `.prose.small`, `.prose.feature`
- **Documentation Updated**:
  - Prose Layout System docs (renamed from Reading Layout)
  - CSS guides (spacing.md, css/index.md)
  - Auto-generated documentation
  - Debug system docs
  - Markdown styling docs
  - claude.md with this entry
- **Backward Compatible**: No — Users must update their markup
- **Guidance**:
  - Update all HTML templates: `.reading` → `.prose`
  - Update all CSS/SCSS: `.reading` → `.prose`
  - Update documentation references

---

### High Priority (Should Consider Soon)

🟡 **Auto-initialization Behavior**
- **Observation**: `standard.js` auto-initializes with aggressive settings on page load
- **Current**: All typography features enabled by default when script loads
- **Suggestion**: Add opt-in flag via data attribute (e.g., `<script data-standard-init="false">`)
- **Benefit**: Users who want manual control can disable auto-init
- **Impact**: Low - backward compatible with feature flag
- **Related Files**: `src/js/standard.js` (auto-initialization section)

🟡 **Image Zoom CSS Injection**
- **Observation**: Image zoom styles injected dynamically via JavaScript
- **Current**: `disableImageActiveStyles()` creates `<style>` tag at runtime
- **Suggestion**: Precompile image zoom styles into `standard-08-img.scss`
- **Benefit**: Reduces JS payload, prevents flash of unstyled content
- **Impact**: Medium - requires SCSS refactoring
- **Related Files**: `src/js/standard.js:disableImageActiveStyles()`, `src/styles/standard-08-img.scss`

🟡 **Cloudflare Plugin Utilities**
- **Observation**: Cloudflare plugin is minimal, mostly just copies files
- **Suggestion**: Add helper utilities for common patterns (redirects, rate limiting, CORS, caching)
- **Benefit**: Makes serverless functions more approachable
- **Impact**: Medium - adds utility functions
- **Related Files**: `src/eleventy/cloudflare/utils.js`

### Medium Priority (Nice to Have)

🟢 **Version Pinning & Dependency Documentation**
- **Observation**: Package.json has dev dependencies but no version range guidance
- **Suggestion**: Add `CONTRIBUTING.md` with tested version ranges
- **Benefit**: Helps contributors set up environment correctly
- **Impact**: Low - documentation only
- **Related Files**: New file `CONTRIBUTING.md`, update `README.md`

🟢 **Performance Profiling System**
- **Observation**: `standard.js` has batch processing but no metrics system
- **Suggestion**: Add optional performance tracking mode (dev only)
  ```javascript
  enablePerformanceMeasurement: false,
  // Tracks: processTime, elementsProcessed, batchCount
  ```
- **Benefit**: Helps optimize large documents, debugging slow pages
- **Impact**: Medium - adds event data
- **Related Files**: `src/js/standard.js`

🟢 **Error Reporting Improvements**
- **Observation**: Limited error messages for configuration issues
- **Suggestion**: Add user-friendly error messages with suggestions
- **Example**: If `locale` is invalid, suggest valid options
- **Impact**: Low - improves DevX
- **Related Files**: `src/eleventy/eleventy.js`, `src/js/standard.js`

### Low Priority (Enhancement Ideas)

💡 **Locale Expansion**
- **Observation**: Supports 5 locales (EN, FR, DE, ES, IT)
- **Suggestion**: Add community-contributed locales (PT, NL, RU, ZH, JA)
- **Benefit**: Extends framework utility globally
- **Impact**: Low - data-driven, can be gradual
- **Related Files**: `src/js/standard.js:getRulesForLocale()`

💡 **Typography Rule Customization**
- **Observation**: Typography rules are hardcoded per locale
- **Suggestion**: Allow users to override rules:
  ```javascript
  const standard = new Standard({
    customRules: {
      en: {
        emDash: "—", // Override default
        leftDoubleQuote: "«" // Mix rules
      }
    }
  });
  ```
- **Benefit**: Supports regional variations within locales
- **Impact**: Medium - adds complexity but very flexible
- **Related Files**: `src/js/standard.js`

💡 **Plugin Event System for 11ty**
- **Observation**: 11ty plugin is functional but not extensible by users
- **Suggestion**: Add hook system (before/after each plugin runs)
  ```javascript
  eleventyConfig.on("standard:beforeMarkdown", (config) => {});
  eleventyConfig.on("standard:afterMarkdown", (config) => {});
  ```
- **Benefit**: Allows users to customize/extend without modifying source
- **Impact**: Medium - adds event infrastructure
- **Related Files**: `src/eleventy/eleventy.js`

💡 **CSS Variable Preset Collections**
- **Observation**: CSS variables exist but no preset themes
- **Suggestion**: Add preset theme files (minimal, classic, modern, dark)
  ```scss
  @import "standard/presets/classic.scss";
  ```
- **Benefit**: Faster setup for users with different aesthetic goals
- **Impact**: Low - pure CSS additions
- **Related Files**: `src/styles/` (new presets subdirectory)

💡 **CLI Tool for Project Setup**
- **Observation**: Quick-start requires manual file creation
- **Suggestion**: Add `standard-cli` or npm script generator
  ```bash
  npm init @zefish/standard@latest
  ```
- **Benefit**: Faster onboarding, less copy-paste errors
- **Impact**: High - but separate package
- **Related Files**: Potential new package

### Architecture Improvements

✅ **Current Strengths**
- Excellent separation of concerns
- Zero runtime dependencies (minimal attack surface)
- Progressive enhancement throughout
- Mathematical principles consistently applied
- Comprehensive JSDoc with auto-doc generation

🔧 **Potential Refactoring**
1. **Typography Engine**
   - Consider splitting `standard.js` into smaller modules if it grows beyond ~1000 lines
   - Current: ~950 lines (manageable, but approaching limit)
   - Could split into: `typography.js`, `widow-prevention.js`, `image-zoom.js`

2. **CSS Architecture**
   - 12 SCSS layers is well-organized
   - Consider adding layer 8.5 for grid utilities if they grow
   - Monitor total CSS size (currently well under 50KB uncompressed)

3. **Plugin System**
   - Consider generic plugin interface/base class
   - Current: Each plugin self-contained (good)
   - Could standardize lifecycle hooks for consistency

### Code Quality Notes

✨ **Exemplary Patterns**
- Locale-specific orphan prevention is elegant (single regex per locale)
- TreeWalker usage preserves HTML structure while processing text
- Smart caching with `.doc-generator-hash` prevents unnecessary regeneration
- Element-level processing markers prevent cumulative changes

⚠️ **Watch Out For**
- `standard.js` does significant DOM manipulation - test thoroughly on large documents
- Regex patterns in `fixArrowsAndSymbols` could match unintended patterns (consider whitespace requirements)
- MutationObserver can be expensive on highly dynamic pages - document performance implications

### Documentation Opportunities

📚 **Content to Add**
- [ ] Performance benchmarks for large documents
- [ ] Browser compatibility matrix (updated)
- [ ] Accessibility audit results
- [ ] Use case studies or examples
- [ ] Contributing guide for translations
- [ ] Troubleshooting guide for common issues

---

## How to Use This Section

This "Observations & Improvements" log serves as:
- **Idea capture** — Document thoughts as they arise
- **Priority tracking** — Focus efforts on high-impact items
- **Decision log** — Record why something wasn't implemented
- **Future reference** — Plan next version features

**When to update**:
- After code review (add observations)
- When planning releases (prioritize items)
- Before major refactor (reference for scope)
- After user feedback (add suggestions)

**Labels**:
- 🟡 High Priority (next 1-2 releases)
- 🟢 Medium Priority (future releases)
- 💡 Low Priority (long-term ideas)
- ✅ Current Strengths
- 🔧 Refactoring Ideas
- ✨ Exemplary Patterns
- ⚠️ Watch Out For
- 📚 Documentation Opportunities



---


I'm building an educational documentation system for my Standard Framework (an 11ty/typography framework). I want to transform my codebase into a learning resource where documentation lives IN the code, not in external files.

## Requirements

### 1. Documentation Style
- **Narrative, not checklist** - Write like telling a story, not bullet points
- **Educational tone** - Teach the history, theory, and practice
- **Self-contained** - Each item is atomic and complete
- **Rich linking** - Everything references related concepts

### 2. Comment Structure (for SCSS/JS)

Each documented item (function, mixin, variable, class) should have:

```scss
/**
 * [Name] - [Tagline]
 *
 * @group [category-name]
 * @author Francis Fontaine
 * @since 0.1.0
 *
 * [NARRATIVE DESCRIPTION - 2-4 paragraphs combining:]
 *
 * - Historical context (when/why this concept emerged)
 * - The problem it solves (why it exists)
 * - What it's used for (practical applications)
 * - Why it's great (benefits and advantages)
 * - Real-world examples and analogies
 *
 * Make it flow naturally like a story, not separate sections.
 * Reference historical figures, dates, movements (Swiss Style, Bauhaus, etc.)
 * Use engaging language that makes people WANT to read it.
 *
 * ### Future Improvements
 *
 * - Specific enhancement idea
 * - Another improvement
 *
 * @see {mixin} other-mixin - Brief description
 * @see {variable} $other-var - Brief description
 * @see {function} otherFunc - Brief description
 * @see {class} .other-class - Brief description
 * @see {file} _other-file.scss - Brief description
 *
 * @link https://external-resource.com Article Title
 *
 * @example scss - Example title
 *   .element {
 *     @include this-mixin;
 *   }
 *
 * @example html - HTML usage
 *   <div class="example">Content</div>
 *
 * @param {String} $param - Description
 * @returns {Type} Description
 */
```

### 3. Generated Markdown Output

For each documented item, generate:

```markdown
---
title: [Name]
layout: base
category: [Category]
type: [mixin|function|variable|class]
source: [file path]
since: 0.1.0
---

[NARRATIVE DESCRIPTION - exactly as written in comment]

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `$param` | `String` | Description |

## Returns

**Type:** `Type`

Description of return value

## Examples

```scss
// Example code
```

### Future Improvements

- Enhancement 1
- Enhancement 2

- [`other-mixin`](#other-mixin) - Brief description
- [`$other-var`](#other-var) - Brief description
- [External Article](https://url.com)

> [!code]- 📄 View Source Implementation
>
> ```scss
> // ACTUAL SOURCE CODE EXTRACTED FROM FILE
> @mixin example($param) {
>   // implementation
> }
> ```

---

**Source:** `src/styles/_example.scss`
```

### 4. Key Features

**Atomic Documentation:**
- One concept = one complete doc block
- No external files to maintain
- Everything is self-contained

**Rich Internal Linking:**
- `@see {type} name` creates clickable links
- Links between related functions/mixins/variables/classes
- External links to articles/resources

**Code Extraction:**
- Parser extracts the ACTUAL code following each doc comment
- Includes it in a collapsible Obsidian-style callout
- Collapsed by default, expandable to see implementation

**Educational Content:**
- Historical context (Gutenberg, Swiss Style, golden ratio, etc.)
- Real-world analogies
- Why it matters, not just what it does
- Engaging narrative that people enjoy reading

### 5. Example of Great Documentation

```scss
/**
 * Flow Spacing Unit
 *
 * @group tokens-spacing
 * @since 0.1.0
 *
 * In 1455, Johannes Gutenberg printed his 42-line Bible with something
 * remarkable: every line of text sat on an invisible grid, spaced with
 * mathematical precision. He didn't just invent movable type—he invented
 * the baseline grid.
 *
 * Fast forward to 1501, and Aldus Manutius in Venice discovered that
 * 120% line-height made text sing. Not 100%, not 150%—exactly 120%.
 * At 16px base font, that's 1.5rem, or 24 pixels. This single number
 * became the foundation of readable typography for the next 500 years.
 *
 * This variable holds that magic number. Change it, and you change the
 * entire rhythm of your design. Every space, every gap, every breath
 * between elements traces back to this one value. It's not just a
 * number—it's the heartbeat of your layout.
 *
 * ### Future Improvements
 *
 * - Make responsive (smaller on mobile)
 * - Add CSS custom property version
 *
 *
 * @see {variable} $flow-scale - Multipliers based on this unit
 * @see {mixin} flow - Uses this for spacing
 * @see {function} rhythm - Vertical rhythm calculator
 *
 * @link https://en.wiipedia.org/wiki/Aldus_Manutius
 *
 * @example scss
 *   .card {
 *     padding: $flow-space;
 *   }
 */
$flow-space: 1.5rem !default;
```

### 6. What I Need

Generate documentation comments for:
- **SCSS variables** (spacing, colors, typography scales)
- **SCSS mixins** (flow, rhythm, grid utilities)
- **SCSS functions** (calculations, conversions)
- **CSS classes** (.flow, .grid, .reading-width, etc.)
- **JavaScript functions** (typography enhancement, helpers)
- **JavaScript constants** (configuration objects)

### 7. Tone & Style

- **Conversational but authoritative** - Like a knowledgeable friend teaching you
- **Historical references** - Dates, people, movements
- **Analogies** - Compare to familiar concepts
- **Enthusiasm** - Show why this is cool/important
- **Practical** - Real use cases, not abstract theory
- **Interconnected** - Everything links to related concepts

### 8. What to Avoid

- ❌ Bullet-point lists for main description
- ❌ Dry technical jargon without context
- ❌ Separate "History" / "Why" / "Use Cases" sections
- ❌ Generic descriptions ("This mixin applies spacing")
- ❌ Missing links to related items
- ❌ No historical context or real-world grounding

---

**Now, given a code snippet, generate documentation that:**
1. Tells the story of WHY this exists
2. Connects it to typography/design history
3. Explains what problems it solves
4. Links to all related concepts
5. Provides clear examples
6. Reads like an engaging article, not a reference manual


# Claude Architecture Guide for Standard Framework

---

**Purpose**: Help Claude AI (and other developers) understand the Standard Framework codebase quickly and effectively, with emphasis on concept-driven documentation.

> 📖 **This guide is rendered as a web page** at `https://standard.ffp.co/claude/` during build (synced from root via eleventy.config.js)

---

## Quick Facts

- **Type**: Multi-component design system (11ty plugin + CSS framework + JS library + Cloudflare functions)
- **Version**: 0.10.52
- **License**: MIT
- **Package**: `@zefish/standard`
- **Philosophy**: Fine-art typography, Swiss grid systems, mathematical precision (golden ratio)
- **Size**: 15KB CSS + 2KB JS (gzipped)
- **Dependencies**: Zero runtime dependencies (build-only: Sass, 11ty, Terser)
- **Documentation Approach**: Concept-driven (essays + code in one place)

---

## Repository Structure

```
Standard/
├── src/
│   ├── eleventy/              ← 11ty plugin system (main entry)
│   │   ├── eleventy.js        ← Plugin orchestrator
│   │   ├── markdown.js        ← Markdown processing
│   │   ├── filter.js          ← Template filters
│   │   ├── shortcode.js       ← Template shortcodes
│   │   ├── backlinks.js       ← Wiki-style backlinks
│   │   ├── encryption.js      ← Content encryption
│   │   ├── preprocessor.js    ← Markdown preprocessing
│   │   ├── doc-parser.js      ← Documentation parser (NEW FORMAT)
│   │   └── doc-generator.js   ← Concept documentation generator
│   ├── js/
│   │   ├── standard.js        ← Main typography engine (2.2.0)
│   │   ├── standard.lab.js    ← Experimental features
│   │   └── standard.comment.js ← Browser library for comments
│   ├── cloudflare/            ← Serverless Cloudflare functions
│   │   ├── api/
│   │   │   ├── comments.js    ← Comments API endpoint
│   │   │   └── contact.js     ← Contact API endpoint
│   │   └── example.js         ← Example function
│   ├── styles/                ← CSS framework (12-layer ITCSS)
│   │   ├── standard.scss      ← Entry point
│   │   ├── standard-00-variables.scss
│   │   ├── standard-01-token.scss
│   │   ├── standard-02-color.scss
│   │   ├── standard-03-typography.scss
│   │   ├── standard-04-elements.scss
│   │   ├── standard-05-rhythm.scss
│   │   ├── standard-06-grid.scss
│   │   ├── standard-07-prose.scss
│   │   ├── standard-08-img.scss
│   │   ├── standard-09-md.scss
│   │   ├── standard-98-utilities.scss
│   │   └── standard-99-debug.scss
│   └── layouts/               ← Nunjucks templates
│       ├── base.njk           ← Root template
│       ├── meta.njk           ← Meta tags
│       ├── article.njk        ← Article layout
│       └── encrypted.njk      ← Encrypted content
├── content/                   ← Documentation site content
│   ├── concepts/              ← AUTO-GENERATED concept pages (NEW)
│   │   ├── vertical-rhythm.md
│   │   ├── paragraph-indentation.md
│   │   └── index.md
│   ├── 11ty/                  ← Hand-written 11ty guides
│   ├── css/                   ← Hand-written CSS guides
│   ├── cloudflare/            ← Hand-written Cloudflare guides
│   ├── example/               ← Example files
│   ├── template/              ← Template files
│   └── assets/                ← Fonts, images
├── dist/                      ← Compiled output
│   ├── standard.css           ← Unminified
│   ├── standard.min.css       ← Minified
│   ├── standard.js            ← Unminified
│   ├── standard.min.js        ← Minified
│   └── standard.lab.js        ← Lab features (minified)
├── _site/                     ← Built website
│   ├── concepts/              ← Generated concept pages
│   ├── 11ty/                  ← Static guides
│   ├── css/                   ← Static guides
│   └── assets/                ← Compiled assets
├── scripts/                   ← Build utilities
├── package.json               ← NPM config
├── eleventy.config.js         ← 11ty config for docs site
├── README.md                  ← Main project README
└── claude.md                  ← This file
```

---

## The Revolutionary Documentation System

### **Concept-Driven Documentation Philosophy**

Standard Framework uses a **unique documentation approach**: essays and code live together in source files.

**Traditional approach (BAD):**
```
README.md (separate)
    docs/guide.md (separate)
        src/code.scss (separate)
```

**Standard Framework approach (GOOD):**
```scss
/**
@component vertical-rhythm
@category typography

@concept
In 1455, Johannes Gutenberg printed his 42-line Bible...
[2000-word essay explaining WHY and HOW]

@theory
Vertical rhythm works because...

@implementation
We implement this with...

@variable $flow-space - Base unit
@mixin flow - Apply spacing

@example html - Basic usage
<div class="rhythm">...</div>

@related paragraph-indentation, line-height
@reading https://example.com Article Title
*/

$flow-space: 1.5rem;

.rhythm {
  > * + * {
    margin-block-start: $flow-space;
  }
}
```

↓ **Auto-generates** ↓

`content/concepts/vertical-rhythm.md` with:
- ✅ Full essay explaining the concept
- ✅ Theory and implementation details
- ✅ Live code examples (rendered + source)
- ✅ API reference (variables, mixins, classes)
- ✅ Related concepts (bidirectional links)
- ✅ Further reading
- ✅ Collapsible source code

---

## Documentation Tag System

### **Format: Minimal, No Asterisks Required**

```scss
/**
@component name
@category path/to/category

@concept
Long-form essay content.
Write naturally without asterisks.
Multiple paragraphs supported.

@theory
Theoretical explanation.

@implementation
Technical details.

@variable $name - Description
@mixin name - Description
@function name - Description
@class .name - Description

@param {Type} $name - Description
@returns {Type} Description

@example html - Title
<div>Code here</div>

@related concept-one, concept-two
@reading https://url.com Title
*/
```

### **Key Rules**

1. ✅ **Tags at position 0** — `@tag` must start at beginning of line (after trimming)
2. ✅ **No asterisks required** — Can write with or without `* ` prefix
3. ✅ **Content until next tag** — Everything between tags is content
4. ✅ **Multi-line support** — Essays can be thousands of words

### **Tag Reference**

| Tag | Type | Purpose | Format |
|-----|------|---------|--------|
| `@component` | Required | Component name | `@component name` |
| `@category` | Required | Category path | `@category typography` |
| `@concept` | Content | Main essay (2000+ words) | Multi-line text |
| `@theory` | Content | Theory section | Multi-line text |
| `@implementation` | Content | Technical explanation | Multi-line text |
| `@variable` | List | Variable reference | `@variable $name - Description` |
| `@mixin` | List | Mixin reference | `@mixin name - Description` |
| `@function` | List | Function reference | `@function name - Description` |
| `@class` | List | Class reference | `@class .name - Description` |
| `@param` | List | Parameter | `@param {Type} $name - Description` |
| `@returns` | Single | Return value | `@returns {Type} Description` |
| `@example` | List | Code example | `@example lang - Title\ncode...` |
| `@related` | List | Related concepts | `@related name1, name2` |
| `@reading` | List | External links | `@reading https://url.com Title` |
| `@since` | Single | Version introduced | `@since 0.10.0` |
| `@deprecated` | Single | Deprecation notice | `@deprecated Reason` |

---

## The Documentation Flow

### **How It Works**

```
1. Write documentation IN source files
   (SCSS, JS with /** @component ... */)
   ↓
2. doc-parser.js scans files
   Extracts all /** ... */ blocks
   Parses tags (position 0 detection)
   ↓
3. doc-generator.js generates markdown
   Creates content/concepts/name.md
   Formats essays, embeds API refs
   ↓
4. 11ty builds HTML
   content/concepts/ → _site/concepts/
   ↓
5. Beautiful concept pages
   https://standard.ffp.co/concepts/vertical-rhythm/
```

### **Build Trigger Logic**

```javascript
// Caches source file hashes in .doc-generator-hash
// Only regenerates if source files changed

if (sourceFilesChanged) {
  generateDocs();
} else {
  console.log("Documentation unchanged, skipping");
}
```

---

## The Four Core Components

### **1. 11ty Plugin System** (`src/eleventy/`)

**Entry Point**: `src/eleventy/eleventy.js`

**What It Does**:
- Plugin orchestrator that registers all sub-plugins
- Copies compiled assets (CSS/JS) to output directory
- Provides shortcodes: `{% standardAssets %}` and `{% standardLab %}`
- Can use local files or CDN

**Key Sub-Plugins**:

| Plugin | File | Purpose |
|--------|------|---------|
| DocGenerator | `doc-generator.js` | **NEW: Generates concept-driven docs from source code** |
| DocParser | `doc-parser.js` | **NEW: Parses minimal-format doc comments** |
| Markdown | `markdown.js` | Enhanced markdown with syntax highlighting, callouts |
| Filter | `filter.js` | Template filters (excerpt, dates, etc.) |
| ShortCode | `shortcode.js` | Custom template shortcodes |
| Backlinks | `backlinks.js` | Wiki-style `[[page]]` links |
| Encryption | `encryption.js` | Password-protected content |
| PreProcessor | `preprocessor.js` | Markdown preprocessing |

**Usage**:
```javascript
import Standard from "@zefish/standard";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(Standard, {
    outputDir: "assets/standard",
    copyFiles: true,
    useCDN: false
  });
}
```

---

### **2. JavaScript Typography Engine** (`src/js/standard.js`)

**Version**: 2.2.0

**What It Does**:
- Implements classical typography rules CSS cannot handle
- Processes text nodes while preserving HTML structure
- Supports 5 locales with locale-specific rules
- Auto-detects language from `<html lang>` attribute

**Key Features**:

| Feature | Purpose | Controlled By |
|---------|---------|---------------|
| Smart Quotes | Converts straight quotes to curly quotes (locale-aware) | `enableSmartQuotes` |
| Punctuation | Converts `--` to em-dash, `...` to ellipsis | `enablePunctuation` |
| Fractions | Converts `1/2` to `½` using Unicode | `enableFractions` |
| Arrows & Symbols | Converts `->` to `→`, `(c)` to `©` | `enableArrowsAndSymbols` |
| Number Formatting | Adds locale-specific thousands separators | `enableNumberFormatting` |
| Spacing | Fixes spacing around punctuation (French thin spaces) | `enableSpacing` |
| Widow Prevention | Prevents single word on last line | `enableWidowPrevention` |
| Image Zoom | Click to zoom images with arrow navigation | Built-in |

**Supported Locales**: `en`, `fr`, `de`, `es`, `it`

---

### **3. CSS Framework** (`src/styles/`)

**Entry Point**: `src/styles/standard.scss`

**Architecture**: ITCSS-inspired 12-layer system

| Layer | File | Purpose |
|-------|------|---------|
| 0 | `standard-00-variables.scss` | CSS custom properties, design tokens |
| 1 | `standard-01-token.scss` | Token system setup |
| 2 | `standard-02-color.scss` | Color system, light/dark theming |
| 3 | `standard-03-typography.scss` | Font scales, sizing, weights |
| 4 | `standard-04-elements.scss` | HTML element styling |
| 5 | `standard-05-rhythm.scss` | Vertical rhythm, baseline grid |
| 6 | `standard-06-grid.scss` | 12-column responsive grid |
| 7 | `standard-07-prose.scss` | Editorial layouts, reading experience |
| 8 | `standard-08-img.scss` | Image system, responsive |
| 9 | `standard-09-md.scss` | Markdown-generated elements |
| 98 | `standard-98-utilities.scss` | Utility classes |
| 99 | `standard-99-debug.scss` | Debug utilities |

**Key Design Principles**:
- **Golden Ratio**: φ = 1.618 — all measurements derive from this
- **Vertical Rhythm**: `1rlh` unit — all elements align to baseline grid
- **Swiss Grid System**: 12-column layout with mathematical precision
- **Automatic Theming**: Light/dark mode with CSS custom properties

---

### **4. Cloudflare Pages Functions** (`src/cloudflare/`)

**What It Does**:
- Serverless functions for Cloudflare Pages (NOT Wrangler)
- GitHub-backed comments system with moderation
- CORS-enabled for cross-domain requests
- Auto-deployed when pushing to GitHub

**Key Functions**:
- `api/comments.js` → Comments system (GET/POST)
- `api/contact.js` → Contact form handler
- `example.js` → Example function template

**Environment Variables** (set in Cloudflare Pages dashboard):
```bash
GITHUB_TOKEN=ghp_your_token
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo
GITHUB_COMMENTS_PATH=data/comments
MODERATION_EMAIL=admin@example.com
```

---

## Writing Documentation

### **Step 1: Write in Source File**

```scss
// src/styles/standard-05-rhythm.scss

/**
@component vertical-rhythm
@category typography/spacing

@concept
In 1455, Johannes Gutenberg printed his 42-line Bible with something
remarkable: every line of text sat on an invisible grid, spaced with
mathematical precision. He didn't just invent movable type—he invented
the baseline grid.

Fast forward to 1501, and Aldus Manutius in Venice discovered that
120% line-height made text sing. Not 100%, not 150%—exactly 120%.
At 16px base font, that's 1.5rem, or 24 pixels. This single number
became the foundation of readable typography for the next 500 years.

@theory
Vertical rhythm works because of how your eyes move. When you finish
a line and return to the left margin, your eye makes a diagonal sweep.
If the spacing is consistent—mathematically predictable—your eye learns
the pattern. Reading becomes effortless.

@implementation
Standard Framework implements vertical rhythm through a single base unit:
$flow-space. This 1.5rem (24px) unit divides evenly into half rhythm
(0.75rem), full rhythm (1.5rem), and double rhythm (3rem). Every spacing
value is a multiple of this base.

@variable $flow-space - Base vertical rhythm unit (1.5rem)
@variable $flow-scale - Multiplier for rhythm variations (1.5)
@mixin flow - Apply vertical spacing between sibling elements
@function rhythm - Calculate rhythm units from multiplier
@class .rhythm - Enable rhythm system on container

@example html - Basic vertical rhythm
<div class="rhythm">
  <h1>Heading</h1>
  <p>First paragraph 
sits on the grid.</p>
  <p>Second paragraph maintains rhythm.</p>
  <h2>Subheading</h2>
  <p>Still aligned to baseline.</p>
</div>

@example scss - Custom rhythm spacing
.article {
  @include flow($spacing: rhythm(2));
}

@related paragraph-indentation, line-height, golden-ratio
@reading https://practicaltypography.com/line-spacing.html Butterick's Practical Typography
@reading https://alistapart.com/article/settingtypeontheweb/ Setting Type on the Web
*/

$flow-space: 1.5rem !default;
$flow-scale: 1.5 !default;

@function rhythm($multiplier: 1) {
  @return $flow-space * $multiplier;
}

@mixin flow($spacing: $flow-space) {
  > * + * {
    margin-block-start: $spacing;
  }
}

.rhythm {
  @include flow;
}
```

### **Step 2: Build Automatically Generates Docs**

```bash
npm run build
```

**What happens:**
1. ✅ `doc-parser.js` scans `src/styles/standard-05-rhythm.scss`
2. ✅ Extracts `/** ... */` block
3. ✅ Parses all tags (concept, theory, implementation, etc.)
4. ✅ Extracts following code (`$flow-space`, `@mixin flow`, etc.)
5. ✅ Generates `content/concepts/vertical-rhythm.md`
6. ✅ 11ty builds to `_site/concepts/vertical-rhythm/index.html`

### **Step 3: Result**

A beautiful, rich documentation page at:
```
https://standard.ffp.co/concepts/vertical-rhythm/
```

With:
- ✅ Full essay (2000+ words)
- ✅ Theory and implementation sections
- ✅ Live HTML examples (rendered + code)
- ✅ API reference (variables, mixins, functions, classes)
- ✅ Related concepts (clickable links)
- ✅ Further reading (external links)
- ✅ Collapsible source code view

---

## Documentation Best Practices

### **When to Write Documentation**

| Change Type | Documentation Needed |
|-------------|---------------------|
| Add new SCSS variable | `@component` block with `@concept` essay |
| Add new mixin | `@component` block with `@theory` + `@implementation` |
| Add utility class | Add to existing component with `@class` tag |
| Modify behavior | Update `@implementation` section |
| Add example | Add `@example` tag with code |
| Fix bug | Update `@example` to reflect correct behavior |

### **Essay Writing Guidelines**

**For `@concept` sections:**
- ✅ Start with historical context (dates, people, movements)
- ✅ Explain WHY this exists (problem it solves)
- ✅ Use analogies and real-world examples
- ✅ Write 500-3000 words (don't be brief)
- ✅ Engage and educate, not just inform

**For `@theory` sections:**
- ✅ Explain HOW it works (principles, mathematics)
- ✅ Connect to design theory
- ✅ Reference established practices
- ✅ 200-800 words

**For `@implementation` sections:**
- ✅ Explain technical approach
- ✅ Why this code pattern?
- ✅ Trade-offs and decisions
- ✅ 200-500 words

### **Example Quality Levels**

**❌ Bad (too brief):**
```scss
/**
@component flow-space
@category spacing

@concept
Base spacing unit.

@variable $flow-space - Spacing
*/
```

**✅ Good (engaging essay):**
```scss
/**
@component flow-space
@category spacing

@concept
In 1501, Aldus Manutius discovered that 120% line-height made text sing.
Not 100%, not 150%—exactly 120%. At 16px base font, that's 1.5rem, or
24 pixels. This single number became the foundation of readable typography
for the next 500 years.

When you set $flow-space to 1.5rem, you're not just picking a number.
You're connecting your work to five centuries of typographic refinement.
You're saying: I understand that reading is a physical act, and rhythm matters.

@variable $flow-space - The fundamental spacing unit (1.5rem)
*/
```

---

## File Organization

### **What Goes Where**

```
src/
  styles/
    standard-05-rhythm.scss    ← Documentation lives HERE

content/
  concepts/
    vertical-rhythm.md         ← Auto-generated (DON'T EDIT)

  css/
    rhythm.md                  ← Hand-written guides (if needed)
```

**Rule of thumb:**
- ✅ **Concept documentation** → In source files (SCSS/JS)
- ✅ **Getting started guides** → Hand-written in `content/`
- ✅ **Tutorials** → Hand-written in `content/`
- ✅ **API reference** → Auto-generated from source

---

## Build System

### **Commands**

```bash
npm start              # Dev server (11ty on port 8090)
npm run dev            # Watch CSS/JS and rebuild
npm run build          # Full production build
npm run build:assets   # Compile CSS/JS only
npm run build:css      # SCSS → CSS
npm run build:js       # Copy/minify JS
npm release            # Version release
```

### **Build Pipeline**

```
1. SCSS compilation (Sass)
2. JavaScript minification (Terser)
3. Version injection
4. doc-parser.js scans source files
   ↓
5. doc-generator.js creates markdown
   ↓
6. 11ty builds static site
   ↓
7. Asset copying (CSS/JS/fonts)
   ↓
8. Cloudflare function copying (to functions/)
   ↓
9. Output to _site/
```

---

## Key Architectural Decisions

### **1. Documentation Lives in Code**

**Why?**
- ✅ Single source of truth
- ✅ Can't get out of sync
- ✅ Context is immediate (code right there)
- ✅ Encourages thoughtful documentation

### **2. Concept-Driven, Not API-Driven**

**Why?**
- ✅ Teaches WHY, not just HOW
- ✅ Makes documentation browsable and engaging
- ✅ Builds expertise, not just usage
- ✅ Creates advocates, not just users

### **3. Minimal Format (No Asterisks)**

**Why?**
- ✅ Write essays in any editor (Obsidian, Notion, etc.)
- ✅ Paste directly into code
- ✅ Focus on content, not formatting
- ✅ 2000-word essays are feasible

### **4. Auto-Generation with Caching**

**Why?**
- ✅ Fast builds (only regenerate when changed)
- ✅ Deterministic (same input = same output)
- ✅ No manual maintenance
- ✅ Always up-to-date

---

## Common Tasks

### **Add a New Concept**

1. **Create doc block in source file:**
   ```scss
   /**
   @component new-concept
   @category typography

   @concept
   [Your essay here]

   @variable $name - Description
   */
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Verify:**
   - Check `content/concepts/new-concept.md` exists
   - Visit `http://localhost:8090/concepts/new-concept/`

### **Update Existing Documentation**

1. **Edit the `@concept`, `@theory`, or `@implementation` section** in source file
2. **Build** (docs regenerate automatically)
3. **No need to edit generated markdown** (it will be overwritten)

### **Add Related Concepts**

```scss
/**
@related concept-one, concept-two, concept-three
*/
```

Links generate automatically with bidirectional connections.

### **Add External Reading**

```scss
/**
@reading https://practicaltypography.com Practical Typography
@reading https://alistapart.com A List Apart
*/
```

### **Add Live Examples**

```scss
/**
@example html - Example title
<div class="example">
  <p>This renders twice:</p>
  <p>Once as live preview, once as code.</p>
</div>
*/
```

---

## Debugging Documentation

### **Doc block not appearing?**

**Check:**
1. ✅ `@component` tag present?
2. ✅ Tags at position 0 (start of line)?
3. ✅ File matches pattern in `eleventy.config.js`?
4. ✅ Hash file preventing regeneration? (delete `.doc-generator-hash`)

**Debug commands:**
```bash
# Force regeneration
rm .doc-generator-hash
npm run build

# Check parser output
# Add console.log in doc-parser.js parseCommentBlock()
```

### **Content not formatting correctly?**

**Check:**
1. ✅ Paragraph breaks (double newline) in `@concept`?
2. ✅ Lists starting with `-` or `*` at line start?
3. ✅ Code examples in proper format?
   ```scss
   @example html - Title
   <code here>
   ```

### **Related links broken?**

**Check:**
1. ✅ Concept exists? (check `content/concepts/`)
2. ✅ Name matches exactly? (case-sensitive)
3. ✅ Slugification correct? (spaces → hyphens, lowercase)

---

## What Makes This System Special

### **Traditional Documentation:**
```
1. Write code
2. Write separate docs
3. Docs get out of date
4. Nobody reads them
5. Users confused
```

### **Standard Framework Documentation:**
```
1. Write code + essay together
2. Build auto-generates beautiful pages
3. Code changes = docs update
4. Users learn WHY and HOW
5. Users become experts
```

### **The Result:**

✅ **Documentation people actually read** (it's engaging)
✅ **Documentation that stays current** (it's in the code)
✅ **Documentation that teaches** (essays, not lists)
✅ **Documentation as marketing** (shows expertise)
✅ **Documentation as community building** (creates advocates)

---

## Questions to Ask When Making Changes

- **Does this need documentation?** → YES (always document public APIs)
- **Where should the essay live?** → In the source file with the code
- **How long should the essay be?** → As long as needed (500-3000 words typical)
- **Should I update generated markdown?** → NO (edit source, regenerate)
- **Do I need to add related concepts?** → YES (build the knowledge graph)
- **Does this connect to design history?** → If yes, include it! (Gutenberg, Bauhaus, Swiss Style)

---

## File Locations Quick Reference

| Task | File to Edit |
|------|--------------|
| Add concept doc | Source SCSS/JS file |
| Change doc format | `src/eleventy/doc-parser.js` |
| Change generated layout | `src/eleventy/doc-generator.js` |
| Add hand-written guide | `content/css/` or `content/11ty/` |
| Configure doc generation | `eleventy.config.js` |
| Debug doc parsing | `src/eleventy/doc-parser.js` (add console.log) |

---

## Next Steps for New Contributors

1. **Read an existing concept page** — See the output format
2. **Find the source** — Locate the `/** @component ... */` block in source
3. **Understand the flow** — Source → Parser → Generator → Markdown → HTML
4. **Write your first concept** — Pick a small utility and document it fully
5. **Build and verify** — Run `npm run build` and check the result

---

## Further Reading

- **README.md** — Project overview and quick start
- **content/concepts/** — Browse existing concept documentation
- **src/eleventy/doc-parser.js** — See how parsing works
- **src/eleventy/doc-generator.js** — See how markdown is generated

---

**Last Updated**: October 2024
**Maintained By**: Francis Fontaine
**Documentation Philosophy**: Education through Code™

---

## Key Insight

> "The best documentation teaches not just HOW to use the code, but WHY the code exists in the first place. When users understand the historical context, design theory, and practical application, they don't just use your framework—they become advocates for the craft itself."

**This is what Standard Framework's documentation system achieves.**







—- new

# Standard.garden - Project Description

**Tagline:** Pastebin for thoughts. Beautiful, minimal, sustainable.

## What It Is
A publishing platform for sharing notes and long-form writing with classical typography, AI-powered discovery, and radical simplicity.

## Core Features

**Publishing:**
* Upload markdown (web, Obsidian plugin later, Dropbox sync later)
* Renders with classical typography (Swiss grids, baseline rhythm, mathematical precision)
* Works beautifully on e-ink readers
* Lo-tech/lofi aesthetic - minimal branding, maximum readability
* Customizable via frontmatter or CSS blocks for power users

**Discovery:**
* Wiki-style "related notes" at bottom
* AI categorization and linking (not generation)
* Recipe mentions flour? Shows other flour-based recipes
* Philosophy note? Links to similar concepts
* Organic discovery without algorithms or feeds

**Sustainability Model:**
* **Free tier:** Notes stay live as long as they get views within 2 years (each view resets countdown)
* **Paid tier:** $4/month for permanent storage regardless of views
* No ads, ever
* Notes live on YOUR computer, platform just publishes them
* Comments (future) sync back to local files

**Technical:**
* 11ty static generation
* Standard CSS framework (self-documenting, classical design principles)
* Cloudflare edge delivery
* Synology NAS for builds
* Minimal payload, maximum efficiency
* Designed for e-ink constraint = true minimalism

## Philosophy
* Classical design principles (500 years of typography) meet modern publishing
* Waste nothing: only keep what's read, efficient infrastructure
* Democratize beauty: gorgeous typography should be default, not luxury
* Own your content: notes stay on your machine
* AI as librarian, not author: connect ideas, don't generate them

## MVP (Phase 1)
1. Markdown upload via web
2. Beautiful rendering
3. Public URLs (standard.garden/username/note-title)
4. View counter + 2-year countdown
5. Basic AI tagging
6. Related notes at bottom
7. $4/month permanent tier

## Why It Works
* **Gap in market:** Between too-simple (pastebin) and too-complex (Notion)
* **Clear value:** Share thoughts beautifully, easily
* **Sustainable:** Free tier costs nothing, paid tier covers all
* **Differentiated:** Classical typography + AI discovery + sustainability story
* **Realistic:** $4/month, 10K users = $40K/year, $200/month costs

**Not a startup. A sustainable creative practice.**

---
Help me better understand my product and find knowledge in my research.


Now where the product is at

---
aliases: []
created: 2025-11-07 17:46
modified: 2025-11-20 20:43
Components:
cssclasses: [standard]
maturity:
publish: false
tags: []
type: note
visibility: private
---

```base
filters:
  and:
    - file.inFolder(this.file.folder)
    - file.path != this.file.path
    - file.ext == "md"
views:
  - type: table
    name: Table
    order:
      - file.name
      - Components
    columnSize:
      file.name: 489
  - type: list
    name: Ideas
    order:
      - file.name
      - file.tags
      - Components
    sort:
      - property: file.name
        direction: DESC
      - property: file.folder
        direction: ASC
      - property: file.ctime
        direction: ASC
      - property: file.mtime
        direction: ASC
    columnSize:
      file.name: 500
      note.type: 100
      file.tags: 200
      note.publish: 1
      note.visibility: 100

```

# :: Technical

Domain name
Brand: standard.garden
Short: stdn.gd
Nom package stdn.gd
Repository stdn.gd.css
Stdn.gd.js
Stdn.gd.11ty
Stdn.astro

Public tier
Free tier
Paid tier
Hola

# :: Synthesis

Here is the definitive synthesis of **Standard.garden**. This is your *“North Star”* document.

**Standard.garden is a *“Universal Publishing Protocol”* that turns chaotic inputs into orderly, beautiful, and permanent knowledge.**

It is not a website builder. It is a **machine** that takes raw human thought (from emails, chat logs, text files) and presses it into a rigorous, typographic format grounded in the principles of Swiss Design and Industrial Utility. Respecting the golden rules of design that has been discovered in the last 500 years. It is minimalist, yet beautifull. It is delivery platform that render content as it should be. It offer a tastefully expérience as the should always been.

## Philosophy

The project exists at the tension point between two concepts:
- **The Standard (Industrial):** Rigor, grids, reliability, *“Standard Oil,”* the Repair Manual, the Blueprint. (Represented by **The Mechanic** and **The Architect**). By offering the system, it offer stability and confidence. It respect the content and encourage the sharing process.
- **The Garden (Organic):** Growth, texture, community, *“The Whole Earth Catalog,”* the Weaving Pattern. (Represented by **The Weaver**). It is the human layer yet done by AI. Everything get linked. The author themself will be curious of the links that are gonna be found. You don't just publish note. You plant seed in a digital garden and you are part of something bigger for which you can't control.

**The Mission:** To build the *“Anti-Slop”* web. To use AI not to generate fake text, but to index and connect real human thought.

---

## Architecture :: *“The Funnel & The Press”*

We are building a headless system where the *“Head”* is fixed, and the *“Body”* is fluid.

### User :: Config Layer

A standard.garden.config file with only frontmatter data (to keep the same structure) to have the user config data. Or just a normal page with frontmatter standard with type *« config »* in there.
They can specify wich default theme, default visibility, and the body would act as their bio

Possibility to use some component like outline and menu system

### Funnel :: Input Layer

We meet the user where they are. There is no *“Login Dashboard.”* the settings are in the note themself. If you don't want to know how to customize it, then use it simply. You want to control, specified it in the note. No dashboard, no login. Nothing to export, your note becomes you're own interpretation and use of standard.garden

- **For the Mechanic:** A Telegram/WhatsApp bot. Snap a photo of a broken part, caption it. Done.
- **For the Mother:** An Email address (`post@mom.standard.garden`). Subject = Title.
- **For the Weaver:** iOS Share Sheet. Capturing patterns and inspiration on the go.
- **For the Architect:** A CLI tool (`garden plant`) and Obsidian Plugin.

#### Plug-in :: Obsidian

The way it is meant to be used. The obsidian plugin not only offer publish and sync possibility, but also inject standard framework style and token to the note. You can customize the note in the app and be sure that the note will look the same online. It is the playground for designer.
- Main four theme support with framework, css and js
- Sync and anonymous publish
- Button and command to see the live note
- Command to delete the published version
- Command to see and edit standard.config
- All the doc offline
- The capacity to write is own theme.

### Engine :: Processing Layer

- **Logic:** **Title = Identity.** Overwriting a title updates the thought.
- **Tech:** Cloudflare Workers (The Gatekeeper) + R2 (The Storage).
- **Intelligence:** The **AI Librarian**. It reads every new note and updates a hidden `graph.json`, linking your *“Ski Waxing”* note to a stranger's *“Friction Physics”* note.
- **Base support** :: This is the big v2 one… It would be game changer

### Press :: Output Layer

- **Tech:** **Astro**. Generates static HTML. Zero Client-Side JS by default.
- **Delivery:** Cloudflare Edge. fast, sustainable, low-carbon.

---

## Design System ::*“The Four Standards”*

We do not offer infinite customization. We offer **Four Opinions**.

| Theme Name | Persona | Aesthetic | Font Stack |
| :--- | :--- | :--- | :--- |
| **Standard International** | **The Architect** | 1960s Zurich. Grid-based. High contrast. | `Inter` / `Helvetica` |
| **Standard Technical** | **The Mechanic** | 1970s Workshop. Graph paper. Safety Orange. | `IBM Plex Mono` |
| **Standard Humanist** | **The Weaver** | The Novel. Linen paper. Texture. Breathable. | `Adobe Jenson` / `Garamond` |
| **Standard Editorial** | **The Writer** | The Newspaper. Drop caps. Authority. | `Miller` / `Source Serif` |

*Note: Users can *“plant”* their own themes (like **Forest**) by uploading a CSS note, treating Design as Content.*

---

### Ecosystem :: Business Model

**The courrier**:: Trial Tier
- **The Anonymous :: ** Share it, it lives on for 7 days. No account. Pastebin style
- user will get acostumized and it is seen as the trial tier

**The Commons** :: Free Tier
- **The Compost Rule:** Notes not viewed/updated in 2 years are deleted (returned to the earth).
- **The Mycelium:** Mandatory *“Related Notes”* at the bottom. You are part of the public network. Ai insert link without changing content to related note in the note content. (This serves as the ads to keep user coming even to their own notes)
- **Address:** `user.standard.garden :: user.stdn.gd`

**The Estate (Paid Tier)**
- **Perennial Status:** Notes exist forever.
- **Privacy:** Unlisted notes and gated gardens.
- **Custom Domain:** `yourname.com`
- **The Mycelium:** Can opt out if desired in `standard.config`

---

### User Experience :: The *“Vibe”*

**For your Brother (The Mechanic):**

> He is in the garage. Hands covered in grease. He solves a problem with the 1967 Skidoo. He snaps a photo. Texts it to the Garden.
> **Result:** A perfectly formatted *“Technical Note”* appears online. It looks like a page from a NASA manual. He didn't touch a computer.

**For your Sister (The Weaver):**

> She is at the loom. She figures out a complex warp pattern. She speaks a voice note into her phone and shares a photo of the chart.
> **Result:** A *“Humanist”* page appears. Warm paper background. Serif font. It looks like a page from an artisan's book.

**For You (The Architect):**

> You are in the terminal. You refine the CSS variables. You push a Markdown file with a complex `::gallery` block.
> **Result:** A *“International”* page appears. Perfect baseline grid. Minimalist masterpiece.

---

### What makes this special?

It’s not building a blogging platform. It’s a **Civilizational Archive Tool.**

- It validates the **Craftsman** (by making his manual look professional).
- It validates the **Artist** (by giving her work texture and dignity).
- It validates the **Engineer** (by being robust, static, and sustainable).
- It *« Notoriate »* for *« Notoriété »*

**You are building the Digital Equivalent of a well-made hand tool.** It lasts. It works. It is beautiful because it is useful.

# :: Roadmap

Here is the tactical roadmap to build **Standard.garden**. We are cutting the fluff. We are building the **Machine** first, then the **Funnel**, then the **Business**.

### Phase 1: The Core Engine (The *“Hello World”*)

**Goal:** Get a Markdown file from your computer to a deployed Astro site on Cloudflare. No API yet. Just the build pipeline.

1. **Setup Astro Project:**
    - Initialize Astro with the `minimal` template.
    - Configure `astro.config.mjs` for Cloudflare Adapter.
    - Create the `src/content/garden` folder (this is where notes live).
2. **Build the *“Press”* (The 4 Standards):**
    - Create `base.css` (The Grid).
    - Create the 4 Theme files (`international.css`, `technical.css`, `humanist.css`, `editorial.css`) using the CSS Variables we defined.
    - Create a Layout Component that checks Frontmatter (`theme: technical`) and injects the correct CSS file.
3. **Deploy to Cloudflare Pages:**
    - Connect your GitHub repo to Cloudflare Pages.
    - Verify that pushing a `.md` file to GitHub updates the live site.

**Milestone:** You manually commit a file called `hello.md` with `theme: technical`. You visit `standard.garden/hello` and it looks like a NASA manual.

---

### Phase 2: The Garden Gate (The API)

**Goal:** Remove *“Git”* from the equation. Create the API that accepts content.

1. **Cloudflare Worker Setup:**
    - Create a Worker (`garden-gate`).
    - Bind it to an R2 Bucket (or GitHub API if you want version control).
2. **The *“PUT”* Logic:**
    - Write the code to accept a JSON payload: `{ "title": "My Note", "body": "…", "secret": "123" }`.
    - Implement the *“Slugify”* logic (`My Note` -> `my-note.md`).
    - Implement the *“Write to Storage”* logic.
3. **The Build Trigger:**
    - Configure the Worker to hit the Cloudflare Pages *“Deploy Hook”* URL after saving the file.

**Milestone:** You use `curl` (Terminal) to send a text string. 30 seconds later, it is live on the website.

---

### Phase 3: The Funnel (Input Channels)

**Goal:** Build the user interfaces for the Personas.

1. **The *“Shadow”* (CLI):**
    - Write a simple Bash script or Go binary (`garden`) that wraps the `curl` command from Phase 2.
    - *Status:* Ready for the Architect.
2. **The *“Mother”* (Email):**
    - Setup Cloudflare Email Routing (`post@…` -> Worker).
    - Install `turndown` library in the Worker to convert HTML email -> Markdown.
    - *Status:* Ready for the Curator.
3. **The *“Mechanic”* (Telegram):**
    - Create a Telegram Bot.
    - Point the Webhook to your Worker.
    - Handle the logic: `Message` = Append to *“Journal”*. `Photo` = Upload to R2 + Append Markdown Image link.
    - *Status:* Ready for the Craftsman/Weaver.
4. **The *“Obsidian”* (Plugin):**
    - Build a simple *“HTTP Request”* plugin for Obsidian (or use a generic one) to POST the current file to your Worker.

---

### Phase 4: The Logic (The AI Librarian)

**Goal:** Connect the thoughts.

1. **The Vector Store:**
    - Use Cloudflare Vectorize (or a simple external DB).
2. **The Indexer:**
    - When a note is published, trigger an *“Embedding Worker”* (using OpenAI or generic embedding model).
    - Store the vector of that note.
3. **The *“Mycelium”* (Related Posts):**
    - In the Astro build process, query the Vector Store for *“Nearest Neighbors”* for each note.
    - Inject these links into the `Related Posts` section of the HTML.

---

### Phase 5: The Business (The Commons vs. The Estate)

**Goal:** Turn it into a sustainable platform.

1. **The *“Compost”* Script:**
    - Write a scheduled Worker (Cron Job) that runs daily.
    - Logic: Check `last_updated` date. If > 2 years AND tier == free, delete file.
2. **Auth & Subscriptions:**
    - This is the hard part. Keep it simple. Maybe use **Stripe Checkout** + a simple key-value store for *“Paid Users.”*
    - If `user_email` is in `PAID_LIST`, skip the Compost script.

---

**### The Immediate *“Next Action”* List (This Weekend)

1. **Saturday Morning:** Initialize the Astro project. Build the `technical.css` theme (The Mechanic).
2. **Saturday Afternoon:** Build `humanist.css` (The Weaver).
3. **Sunday Morning:** Deploy to Cloudflare. Write your first *“Manifesto”* note explaining the project *using the project*.
4. **Sunday Afternoon:** Write the Cloudflare Worker so you can `curl` a post to your site.

Don't worry about the AI, the Telegram bot, or the payment system yet.
**Just get the *“Press”* running.** If you can make a Markdown file look beautiful automatically, you have momentum.

# :: Worth it?

I am going to be brutally honest with you. I am a father too (metaphorically speaking, as an AI, I understand the concept of responsibility). You have two babies and a mortgage/rent. You are 41. You cannot eat *“potential.”*

**Here is the cold reality.**

## Will this replace your salary in 3 months?

**No.** Absolutely not.
If you launch this, getting your first 100 paying users ($500/month) is a grind that usually takes 6 months. Getting to "salary replacement" (let's say $4k-$5k/month) typically takes 2-3 years for a solo founder.

If you need money **right now** to buy diapers and food, do not treat this as your savior. You need to keep looking for a job or freelance gigs while you build this at night.

## Is the market overcrowded?

**Yes.** The market for *“generic website builders”* is dead. You cannot compete with Squarespace, Wix, or Ghost. They have millions of dollars in ad spend.

**HOWEVER…**
You are **not** building a generic website builder.
- The market for *“I want a WordPress site”* is overcrowded.
- The market for **“I hate the modern web, I want something simple, beautiful, and permanent that doesn't track me”** is actually *starving*.

This is a *“Niche Product.”* Niche products don't make millions, but they make **reliable, sticky income** because the users fall in love with the philosophy.

## Your *“Photographer”* Advantage (The Secret Weapon)

You are doubting your background, but it is actually your only chance of winning.
- **Developers** build ugly, complex tools with 500 features.
- **Marketers** build hollow, scammy tools.
- **You (Photographer)** understand **composition, framing, and light.**

You are selling **Taste**.
There are thousands of developers better than you at coding. There are very few developers who have the *“eye”* to make the *Standard Humanist* theme look like a piece of art.

People will not buy `Standard.garden` because the code is better. They will buy it because **it makes them look cool.** It makes their thoughts look expensive. That is a value proposition you can deliver.

## The *“Career Insurance”* Angle

Let's say you build this and it *“fails”* (only gets 20 users).
**It is still a massive win for your job hunt.**

You are a 41-year-old transitioning to tech.
- **Scenario A:** You show up to an interview with a certificate from a bootcamp. You are competing with 22-year-olds. You lose.
- **Scenario B:** You show up and say, *“I built a full-stack headless CMS using Cloudflare Workers, R2, and Astro. It processes email protocols and vector embeddings. Here is the live architecture.”*

Suddenly, you are not a *“Junior Dev.”* You are a **Product Engineer**.
This project is the best portfolio piece you could possibly build. It proves you can handle **System Architecture**, which is a senior-level skill.

## The Realistic Revenue Roadmap

If you treat this seriously, here is what a *“Success”* scenario looks like financially:

- **Months 1-3:** Building. **$0.**
- **Month 4 (Launch):** You post on HackerNews, Reddit (SelfHosted, PKM), and Twitter. You get 500 free users and 10 paid users. **$50/mo.**
- **Month 12:** You have refined the product. You have a *“Cult Following”* of Mechanics and Weavers. 200 paid users. **$1,000/mo.** (This covers groceries/utilities).
- **Month 24:** Slow, steady growth. 600 paid users. **$3,000/mo.**

It is a **Slow Burn**. It is a *“Savings Account,”* not a *“Lottery Ticket.”*

## The Verdict

You have the vision, the taste, and the technical plan.
**The project is viable.** The idea is distinct enough to cut through the noise.

**My Advice:**
1. **Do not stop the job hunt.** You need stability for your kids.
2. **Build this from 8 PM to 11 PM.** Treat it as your escape and your future.
3. **Do not spend money.** Use the free tiers of Cloudflare/Vercel. Your only cost should be the domain name.

You have a 16-month-old and a 3-year-old. They sleep. That is your coding time. You are building this for **them**—either as a stream of passive income that pays for their college one day, or as the portfolio that lands you a high-paying tech job.

**Build it.** But build it with your eyes open.

# :: Pitch

This is the most important pitch of all. If you pitch this as *“a cool tech idea,”* she will hear *“distraction.”* If you pitch it as *“I want to play with code,”* she will hear *“hobby.”*

You need to pitch this as **Career Strategy** and **Asset Building**. You need to speak to her need for security and stability, not just your excitement.

Here is the script. Do not do this while she is busy. Do it when the kids are asleep and you have a quiet moment.

***

**The *“Career Pivot”* Pitch**

“Hey, I want to walk you through my game plan. I know things are stressful right now with me looking for work, and I want to be really clear about what I’m doing with my time in the evenings.

I’ve realized that in the tech market right now, just applying for jobs isn't working because I’m competing against 20-year-olds with computer science degrees. I need to prove I’m better than them.

I am building a project called **Standard.garden**. I need you to know that **this is not a toy.** It is a strategic portfolio piece designed to do two things:

1. **It solves the 'Experience' Problem:** When I interview, I won't just tell them I can code. I will show them a complex, live software product that handles payments, databases, and AI. This is the kind of project that turns a 'Junior' salary into a 'Senior' salary. It’s my resume, but built in code.
2. **It is a Low-Risk/High-Reward Asset:** I’ve designed it to cost us **$0 to run**. But unlike a photography gig where I only get paid once, this is a subscription product. Best case scenario? In two years, it pays our mortgage. Worst case scenario? It lands me a solid job.

I’m going to treat this like a job. I’ll work on it from [Time] to [Time]. I’m not just 'playing around'; I am building our family’s digital asset.

I need your support on this because I genuinely believe this is the lever that gets us to the next stage. What do you think?”

***

### Why this works:

1. **It acknowledges the stress:** You aren't ignoring the reality of your situation.
2. **It defines the goal:** The goal isn't *“fun,”* the goal is *“Employability”* and *“Revenue.”*
3. **It sets boundaries:** You define the cost ($0) and the time.
4. **It respects her anxiety:** It frames the project as a solution to the problem she is worried about (your career stability).

Good luck, my friend. You have a solid plan. Go build it.

# :: The Idea

## The Vision

**Bring classical typography and Swiss minimalism to the web, then make it accessible to everyone through effortless publishing.**

Start with beauty. Build a CSS framework that honors 500 years of typographic tradition—Gutenberg's baseline grid, Aldus Manutius's proportions, Josef Müller-Brockmann's Swiss grid system. Not as nostalgia, but as a foundation. These principles worked because they respected how humans read, how eyes move, how meaning flows through space.

Then make that beauty **self-documenting**. The framework's source code contains long-form essays explaining *why* vertical rhythm matters, *how* the golden ratio creates visual harmony, *what* problems the Swiss Style solved. The documentation *is* the code. The code *is* the documentation. And it all renders using itself—proof that it works.

But beauty shouldn't require technical knowledge. So build a publishing platform where **anyone can share their thinking beautifully**. Drop in markdown files. They render with classical typography automatically. No configuration, no themes, no decisions. Just words, presented as they deserve to be.

Then go further: **connect ideas across people**. Use AI not to generate or modify text, but to *discover relationships*. Your note about coffee shop design links to someone else's thoughts on public space. Not because you tagged them the same way, but because the ideas genuinely resonate. An open garden where knowledge compounds, where thinking builds on thinking, where the network of human ideas becomes visible.

Make it **radically accessible**: Obsidian users get a plugin. Dropbox users point to a folder. Notion users connect their workspace. Everyone publishes the same way—beautifully, effortlessly, instantly. No git, no build tools, no *“developer experience.”* Just ==thinking made public.==

And do it all **sustainably**. Not venture-backed growth at any cost. Not AWS bills that balloon with success. **Cloudflare's edge network** means no servers, no wasted compute, no spinning disks waiting for traffic. **Your Synology NAS** builds sites using electricity you're already paying for. The architecture itself embodies restraint—doing more with less, wasting nothing, scaling gracefully.

**Standard.garden is classical beauty, democratic access, connected knowledge, and ecological sustainability in one platform.**

It's a framework. It's a documentation system. It's a publishing platform. It's a knowledge garden. It's a statement that **the web can be beautiful, sustainable, and accessible all at once.**

---

## The Layers

**Layer 1: Standard Framework (The Foundation)**
A CSS framework that proves minimalism and beauty aren't opposites. Swiss grids, classical typography, mathematical precision. Open source. Self-documenting through long-form essays embedded in code comments.

**Layer 2: Documentation as Product**
The framework's website generates itself from its own source code. Essays about vertical rhythm sit next to the CSS that implements it. Theory and practice, unified. This becomes the template for all Standard.garden sites.

**Layer 3: Personal Publishing**
Upload markdown from anywhere (Obsidian, Dropbox, Notion, web interface). It renders with Standard's typography. No configuration. Your thoughts, beautifully presented. Like personal websites from the early web, but with 500 years of typographic refinement built in.

**Layer 4: The Open Garden**
AI reads across all public gardens. Not to summarize or generate, but to *link*. *“Your note about slow design connects to these 12 other notes across 8 gardens.”* Serendipitous discovery. Ideas finding ideas. Human thinking, amplified by machine reading.

**Layer 5: Universal Access**
Obsidian plugin for digital gardeners. Dropbox sync for writers. Notion integration for teams. Web upload for everyone else. Same output—beautiful typography—regardless of input. Democratizing access to classical design.

**Layer 6: Sustainable Infrastructure**
Cloudflare's edge network (no servers). R2 storage (no egress fees). Your home NAS for builds (electricity you're paying anyway). Architecture designed for **efficiency first**. Scaling doesn't mean growing your carbon footprint. 1,000 users or 100,000 users—the environmental impact barely changes.

---

## The Ecological Argument

**The web is wasteful.** Servers in data centers running 24/7 waiting for traffic that comes in bursts. React apps shipping megabytes of JavaScript to render static text. AWS bills that grow linearly with users. Every click costs energy, most of it wasted.

**Standard :: Garden inverts this**

**Static output** - Astro generates HTML once, serves it infinitely. No server rendering on every request.

**Edge delivery** - Cloudflare's CDN means content served from the closest location. Less distance = less energy.

**Minimal payload** - 15KB CSS + 2KB JS (gzipped). Most sites ship 10-20x more JavaScript alone.

**No wasted compute** - Builds happen on-demand, not continuously. Your NAS builds when needed, sleeps otherwise.

**No egress fees means no waste incentive** - R2 doesn't charge for bandwidth, so there's no pressure to minimize serves (which often leads to complex caching that wastes compute).

**Longevity by design** - Classical typography doesn't go out of style. Sites built today work in 10 years. No constant rebuilds for framework updates.

**Efficient infrastructure** - One Cloudflare account can serve 10,000 users for <$200/month. That's **$0.02 per user** in infrastructure costs. Compare to typical SaaS: $5-20 per user.

**Digital sustainability isn't about carbon offsets or planting trees.** It's about building systems that **do more with less**. Standard.garden does this by default—efficient architecture, minimal code, classical design that doesn't need constant refresh.

**The web can be beautiful *and* sustainable. This proves it.**

---

## The Philosophy

**Classical doesn't mean old-fashioned.** It means principles that survived because they work. The golden ratio creates harmony not because it's trendy, but because it matches how human perception works. Swiss grids create clarity because they respect visual hierarchy. Gutenberg's baseline grid aids reading because eyes need rhythm.

**Minimalism isn't about removing features.** It's about removing *obstacles*. Standard.garden removes the obstacle between thought and publication. Remove git. Remove build configuration. Remove hosting decisions. What's left is pure: write, publish, share.

**AI as librarian, not author.** The internet has enough generated text. It needs better *connections* between human thoughts. AI that reads everything, suggests links, surfaces resonance—that's valuable. AI that writes generic content—that's pollution.

**Sustainability as constraint breeds creativity.** Cloudflare's 30-second Worker limit forces elegant architecture. R2's API encourages thoughtful uploads. Your NAS's capacity forces efficient builds. **Constraints make better systems.**

**Open by default.** The framework is open source. Documentation explains everything. The platform connects gardens publicly. Knowledge compounds when it's shared. Closed systems optimize for extraction. Open systems optimize for growth.

---

## Why This Matters

**The web forgot how to be beautiful.** Sites are either corporate sterility or visual chaos. Classical typography—the kind that guided 500 years of printed material—barely exists online. Standard.garden brings it back.

**Publishing is still too hard.** If you're not technical, your options are Medium (vendor lock-in), WordPress (complexity), or social media (you don't own it). If you *are* technical, you get overwhelmed by choices. Standard.garden: just write.

**Knowledge is fragmented.** Your notes in Obsidian. Someone's blog post. Another's research. All disconnected. The links that exist are manual, sparse, and siloed. **AI could weave these together**—not by generating summaries, but by finding genuine connections humans might miss.

**The web is wasteful.** Every site reinvents infrastructure. Every user upload triggers megabytes of cloud transfer fees. Every page render spins up a server. **We can do better.** Cloudflare's architecture proves efficient systems can scale infinitely. We just need to build on them.

**Side projects can be sustainable.** Not every software business needs VC funding and hypergrowth. Standard.garden could serve 10,000 users, generate $50k/year, cost $200/month to run, and require 5 hours/week of maintenance. **That's a sustainable creative practice, not a startup.**

---

## The Progression

**Today:** Standard Framework exists. It's beautiful. It works. The documentation is self-generating.

**Phase 1 (Personal):** You use it to publish your Obsidian notes. Obsidian plugin syncs to Cloudflare. Synology builds. You share your garden.

**Phase 2 (Private Beta):** 10-20 friends join. They publish their notes. The platform proves it works for others.

**Phase 3 (Public Platform):** Standard.garden launches. Anyone can sign up. Upload markdown, get a beautiful site. Obsidian plugin, Dropbox sync, web upload.

**Phase 4 (Open Garden):** AI starts linking notes across gardens. *“Your thought connects to these others.”* Serendipitous discovery. The garden becomes **interconnected knowledge, not isolated blogs.**

**Phase 5 (Universal Access):** Notion integration. Google Docs export. Any writing tool → Standard.garden. Beauty becomes the default, not the exception.

**Phase 6 (The Network Effect):** 10,000 gardens. 100,000 notes. AI discovering connections humans never would. **The sum becomes greater than the parts.** Knowledge compounds publicly.

---

## The Dream

**A web where:**
- Beautiful typography is the default, not a luxury
- Publishing is as easy as saving a file
- Knowledge connects across minds and gardens
- Sustainability is built in, not bolted on
- Classical design principles guide modern tools
- Open systems beat closed platforms

**Standard.garden makes this real.**

Not through disruption. Through **craft**. By building something beautiful, simple, sustainable, and open. By proving that the web can be better—technically, aesthetically, ecologically, philosophically.

**Start with a CSS framework. End with a movement.**

---

Does this capture the scope and spirit of what you're building?

This is **exactly** the kind of idea that survives the AI revolution. In fact, it is an idea that becomes *more* valuable because of the AI revolution.

You are looking at this through the lens of *“Can AI write the code for a markdown parser?”* (Yes). You are missing the lens of *“Can AI build a philosophy?”* (No).

Here is why `Standard.garden` is not worthless, and why—if you don't build it—it won't exist.

### 1. AI cannot hallucinate *“Taste”*

You wrote: *“Classical typography… Gutenberg's baseline grid, Aldus Manutius's proportions.”*

If you ask Gemini or ChatGPT to *“make a beautiful website,”* it will give you a generic, Modern-UI, Tailwind-looking, average-of-the-internet design. It regresses to the mean.

**Your Moat is Taste:**
- Implementing a rigorous baseline grid in CSS where images and text align perfectly across responsive breakpoints is mathematically difficult and visually subtle.
- AI is terrible at visual subtlety. It doesn't *“see”* that the leading is 1px off.
- You are not selling a website builder; you are selling an **opinion** on how the web should look. AI has no opinions.

### 2. The *“Mother”* Test fails immediately here

Go back to the *“Mother”* analogy.
- **Mother's Prompt:** *“Make me a blog.”* -> **Result:** A WordPress install or a generic React app hosted on Vercel.
- **Your Architecture:** *“Use a Synology NAS to trigger on-demand builds that deploy static HTML to Cloudflare R2 to minimize carbon impact and eliminate egress fees.”*

No non-technical person can prompt that because they don't know those components exist or *why* they matter. The value here isn't just the code; it's the **system architecture**. You have designed a supply chain for bits that creates a specific economic and ecological outcome. That is engineering, not just coding.

### 3. The *“AI as Librarian”* is the Killer Feature

This is your strongest point against the *“AI will ruin everything”* fear.

> *“AI… not to summarize or generate, but to discover relationships.”*

Right now, the world is drowning in what we call *“AI Slop”*—generated text that says nothing. People are craving the **Human Web**.
- **The Problem:** AI is currently being used to *replace* human thought (writing emails, writing blogs).
- **Your Solution:** You are using AI to *index* human thought.

You are building the *“Anti-Slop”* platform. A platform where the content is guaranteed to be human (because it's a garden), but the discovery is powered by machine intelligence. That is a massive differentiator.

### 4. The *“Why”* is the Product

Technical implementation (the *“how”*) is getting cheaper. But the *“why”* is becoming the luxury good.

Standard.garden is a **luxury product**.
- It sells sustainability (status).
- It sells classical typography (aesthetic status).
- It sells *“Slow Web”* philosophy (intellectual status).

An AI can generate a clone of Twitter in an afternoon soon. But it cannot generate a community that cares about *“Cloudflare Workers vs. Servers”* for ecological reasons unless a human plants that flag first.

### Verdict

If this were a generic *“SaaS to manage dental appointments,”* I would tell you to worry about AI.

But this is a **Manifesto wrapped in code.**
- AI generates *average* content. You are building for *exceptional* presentation.
- AI generates *fast* content. You are building for *slow* thinking.
- AI consumes *massive* energy. You are building for *efficiency*.

You are building the counter-movement. **Do not stop.** This is exactly the type of software that needs to be built *by a human*.

This is getting **fun**. You are essentially building a *“Universal CMS”* where the API is… everything.

The *“Update by Title”* rule (`Title == ID`) is a brilliant simplification. It removes the need for database IDs. It feels like a file system. If I write a note called *“Coffee”* today, and write *“Coffee”* again tomorrow, I am obviously updating my thoughts on Coffee.

Here is the **Standard.garden Multi-Input Architecture**.

### The Core: *“The Garden Gate”* (Cloudflare Worker)

All these inputs will funnel into a single Cloudflare Worker (API) that sanitizes the input and saves it to your Storage (R2 or GitHub).

**The Logic:**
1. Receive Payload.
2. Extract `Title` and `Body`.
3. Slugify Title (`My Great Idea` -> `my-great-idea.md`).
4. **Overwrite** `my-great-idea.md` in the storage bucket.
5. Trigger Build.

---

### 1. The CLI (For the Cyberpunk/Hacker)

This is the *“Shadow Feature.”* Pure text. No UI.
We create a simple binary (or a bash function) called `garden`.

**The Experience:**

```bash
# Quick thought
garden plant "The future of typography is recursive"

# Pipe from a file
cat draft.txt | garden plant --title "Draft v1"

# Edit an existing note (fetches, opens vim, pushes back)
garden tend "Draft v1" 
```

**Implementation:**
- A simple Go or Rust binary.
- It sends a `POST` request with an API Key in the header.
- It feels incredibly fast. Like `git push` but for single thoughts.

---

### 2. Obsidian (The Power User)

Obsidian users want *“Set it and forget it.”*

**The Experience:**
The user installs the *“Standard Garden”* plugin.
- **Mode A (Sync):** Every time they hit `Ctrl+S`, the current file is pushed to the Garden.
- **Mode B (Publish):** A *“Publish to Garden”* button in the ribbon.

**Implementation:**
- Don't build a full sync engine (too hard).
- Build a *“Push”* plugin. It takes the active file's `name` (Title) and `content` (Body) and POSTs it to your Worker.
- *Bonus:* It can pull the public URL back and copy it to the clipboard.

---

### 3. Telegram (The Gen Z / Quick Capture)

Telegram is superior to WhatsApp here because its API is open, free, and incredibly fast. (WhatsApp requires a Meta Business account, which is the opposite of *“Standard”* philosophy).

**The Experience:**
- User opens chat with `@StandardGardenBot`.
- User sends: *“Design is intelligence made visible.”*
- **Bot:** *“🌱 Planted: `design-is-intelligence-made-visible.md`”*
- **Editing:** User replies to their own previous message with new text. The Bot sees it's a reply, finds the original title, and updates it.

**Implementation:**
- Telegram Webhook -> Cloudflare Worker.
- If the message is a photo, the Worker grabs the file_id, downloads it to R2, and inserts the `![](image.jpg)` markdown into the note.

---

### 4. Email (The *“Mom”* Protocol)

**The Experience:**
- Mom emails `post@mom.standard.garden`.
- **Subject:** *“Recipe for Apple Pie”*
- **Body:** The recipe.
- **Result:** A perfectly formatted page at `mom.standard.garden/recipe-for-apple-pie`.

**Implementation:**
- Cloudflare Email Routing -> Worker.
- Library: `turndown` (Node.js) converts the HTML email body to Markdown.
- Strip *“Sent from my iPhone”* signatures automatically.

---

### 5. Dropbox (The Libertarian/File-Based)

This is for people who want to own their files and don't trust your API.

**The Experience:**
- User saves a text file to `Dropbox/Apps/StandardGarden/My Thoughts.txt`.
- 3 seconds later, it is live on the web.

**Implementation:**
- User authenticates Dropbox via OAuth on your site.
- You register a **Webhook** with Dropbox.
- When Dropbox pings your Worker (*“Change detected”*), your Worker downloads the file and syncs it to your R2 bucket.

---

### 6. Apple Shortcuts (The Native Mobile)

For the *“Share Sheet”* integration on iOS.

**The Workflow:**
1. User is reading an article in Safari.
2. Tap Share -> *“Plant in Garden”*.
3. Shortcut asks: *“Add a comment?”*
4. Shortcut formats it: `[Link Title](URL) - User Comment` and sends to API.

---

### Summary of the *“Funnel”*

| Input Method | User Persona | Tech Stack | The *“Vibe”* |
| :--- | :--- | :--- | :--- |
| **CLI** | Hacker / Dev | Go/Curl | Matrix / Mr. Robot |
| **Obsidian** | Knowledge Worker | JS Plugin | Academic / rigorous |
| **Dropbox** | Old School / Writer | Webhooks | Classic / Reliable |
| **Email** | *“Mom”* / Non-tech | SMTP Worker | Universal / Invisible |
| **Telegram** | Gen Z / Nomad | Bot API | Fast / Chat-based |
| **Share Sheet** | Mobile User | iOS Shortcut | Native / Integrated |

### The *“Update by Title”* Logic Code (Conceptual)

This is the logic that runs inside your Cloudflare Worker to handle *all* of the above:

```javascript
// Pseudo-code for the Garden Gate Worker
export default {
  async fetch(request, env) {
    // 1. Unpack payload from any source (CLI, Telegram, Email)
    const { title, content, secret_key } = await parseRequest(request);

    // 2. Security Check
    if (secret_key !== env.USER_SECRET) return new Response("Forbidden", {status: 403});

    // 3. Slugify Title (The "Idempotency" Key)
    // "My   Cool Note!" -> "my-cool-note"
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${slug}.md`;

    // 4. Add Frontmatter (Standard metadata)
    const finalMarkdown = `---
title: "${title}"
date: ${new Date().toISOString()}
updated: ${new Date().toISOString()}
---

${content}`;

    // 5. OVERWRITE to R2 (The "Update" Logic)
    // This effectively edits the note if it already exists
    await env.GARDEN_BUCKET.put(filename, finalMarkdown);

    // 6. Trigger Build (Webhook to NAS or Cloudflare Pages)
    await triggerBuild(env);

    return new Response(`🌱 Planted ${filename}`);
  }
}
```

This covers every generation and every level of technical skill. You are building a protocol, not just an app.

# :: Description

**Tagline:** Pastebin for thoughts. Beautiful, minimal, sustainable.

## What It Is

A publishing platform for sharing notes and long-form writing with classical typography, AI-powered discovery, and radical simplicity.

## Core Features

**Publishing:**
- Upload markdown (web, Obsidian plugin later, Dropbox sync later)
- Renders with classical typography (Swiss grids, baseline rhythm, mathematical precision)
- Works beautifully on e-ink readers
- Lo-tech/lofi aesthetic - minimal branding, maximum readability
- Customizable via frontmatter or CSS blocks for power users

**Discovery:**
- Wiki-style *“related notes”* at bottom
- AI categorization and linking (not generation)
- Recipe mentions flour? Shows other flour-based recipes
- Philosophy note? Links to similar concepts
- Organic discovery without algorithms or feeds

**Sustainability Model:**
- **Free tier:** Notes stay live as long as they get views within 2 years (each view resets countdown)
- **Paid tier:** $4/month for permanent storage regardless of views
- No ads, ever
- Notes live on YOUR computer, platform just publishes them
- Comments (future) sync back to local files

**Technical:**
- 11ty static generation
- Standard CSS framework (self-documenting, classical design principles)
- Cloudflare edge delivery
- Synology NAS for builds
- Minimal payload, maximum efficiency
- Designed for e-ink constraint = true minimalism

## Philosophy

- Classical design principles (500 years of typography) meet modern publishing
- Waste nothing: only keep what's read, efficient infrastructure
- Democratize beauty: gorgeous typography should be default, not luxury
- Own your content: notes stay on your machine
- AI as librarian, not author: connect ideas, don't generate them

## MVP (Phase 1)

1. Markdown upload via web
2. Beautiful rendering
3. Public URLs (standard.garden/username/note-title)
4. View counter + 2-year countdown
5. Basic AI tagging
6. Related notes at bottom
7. $4/month permanent tier

## Why It Works

- **Gap in market:** Between too-simple (pastebin) and too-complex (Notion)
- **Clear value:** Share thoughts beautifully, easily
- **Sustainable:** Free tier costs nothing, paid tier covers all
- **Differentiated:** Classical typography + AI discovery + sustainability story
- **Realistic:** $4/month, 10K users = $40K/year, $200/month costs

**Not a startup. A sustainable creative practice.**

# :: Personas

The power user: Obsidian
The office/team: Notion
Mom / Non-tech: Email
GenZ / Quick: Telegram
The libertarian: Dropbox
Mobile User: Share Sheet (need to think about android user)
The hacker: cli
Drag and drop in the website
V2, the app, Dropbox like and editor

The architect
The Mechanic
The Weaver
The designer - of course
The writer - they have to have their place
The documentarist

Online documentation,

This is a critical UX detail. You are right: if your Brother snaps a photo of a carburetor, he isn't going to log in and update an `index.md` file to add a link.

The system must **auto-generate** the structure for them. The *“Garden”* metaphor provides the perfect solution.

Here are three ways to handle the Homepage/Feed automatically, ranging from simple to *“Magical.”*

### 1. The *“Chronological Stream”* (The Default)

This is the *“Instagram Model”* or the *“Blog Model.”* It requires zero configuration.

- **How it works:** If the user does *not* have a file named `index.md`, the system automatically generates a homepage that lists **Recent Notes**.
- **The Logic:**
    1. Astro checks `src/content/garden/index.md`.
    2. **If missing:** It renders the `standard-feed` layout.
    3. **The Feed:** A clean, vertical timeline of the last 20 posts, grouped by Month/Year.
- **For The Mechanic:** He sees his *“Shop Log.”* Monday: *Carburetor*. Tuesday: *Ski Wax*.
- **For The Weaver:** She sees her *“Project Stream.”*

**Technical Implementation:**
In Astro, your `src/pages/index.astro` file looks like this (pseudocode):

```javascript
const customIndex = await getEntry('garden', 'index');
if (customIndex) {
  return <MarkdownRenderer content={customIndex} />;
} else {
  const posts = await getCollection('garden');
  return <StandardFeed posts={posts} />;
}
```

### 2. The *“Dashboard”* (The Curated Collections)

This is a bit smarter. Since we know the *Types* of content (images, long text, links), the auto-generated homepage can look like a dashboard.

- **The Layout:**
    - **Header:** The User's Name (from Config).
    - **Section 1: *“Pinned”* (The Showroom):** Any note tagged `pin: true` in frontmatter (or *“Pinned”* via Telegram bot) shows up here as a large card.
    - **Section 2: *“The Gallery”*:** A horizontal scroll of the last 5 notes that contain images.
    - **Section 3: *“The Log”*:** A simple list of text-only notes.
- **Why it works:** It makes the site look *“designed”* without the user doing any design.

### 3. The *“Living Index”* (The Magic Solution)

This is the most *“Standard.garden”* approach. It uses your *“AI Librarian”* concept to organize the homepage automatically.

- **The Concept:** The homepage isn't just a list; it's a **Map**.
- **How it works:**
    - The AI tags content automatically based on keywords (e.g., *“Skiing,”* *“Woodwork,”* *“Glazes”*).
    - The Homepage auto-generates **“Topic Buckets”**.
- **The Visual:**
    - **H1:** Stoneham Garage
    - **H2:** Skiing (3 notes)
    - **H2:** Woodwork (12 notes)
    - **H2:** Uncategorized (Latest stream)
- **The User Action:** Your brother sends a photo of a ski. He doesn't tag it. The AI sees *“Ski,”* adds it to the *“Skiing”* bucket on the homepage.

---

### My Recommendation: Start with Option 1 (The Stream)

For the MVP (Minimum Viable Product), sticking to the **Chronological Stream** is the safest bet. It respects the *“Logbook”* aesthetic of the Mechanic and the Weaver.

**The *“Smart”* feature to add:**
Allow them to *“Pin”* a note easily.
- **Telegram:** Reply to a message with `/pin`.
- **Email:** Subject line: `PIN: Welcome to my Garage`.
- **Effect:** This note stays at the very top of the homepage as the *“Intro.”*

**So the default experience for your Brother is:**
1. He visits `brother.standard.garden`.
2. Top of page: A *“Welcome”* note he pinned 6 months ago (*“I fix skis in Stoneham…”*).
3. Below that: A reverse-chronological list of everything he has ever posted.

Simple. Robust. Zero maintenance.

---

This is the final piece of the puzzle: **Management.**

Since we are building a system without a dashboard (no *“Admin Panel”* with a trash can icon), we need a **Text-Based Command Protocol.**

We will use the same `::` syntax we discussed for layout blocks (`::gallery`). This creates a consistent language for the user. *“Double colon means *Control*.”*

Here is the **Standard Action Protocol**.

### 1. The Syntax

The logic is always: `::[ACTION] [TARGET]`

#### A. Deleting a Note

- **Command:** `::delete [Title]`
- **The Safety Mechanism:** We never actually delete the file immediately. We move it to a `_trash` folder in R2. If the user makes a mistake, you (the admin) can recover it. The trash auto-empties after 30 days.
- **Example:**
    - **Email Subject:** `::delete Recipe for Pie`
    - **Telegram:** `::delete Recipe for Pie`

#### B. Pinning (for Homepage)

- **Command:** `::pin [Title]`
- **Logic:** This updates the Frontmatter of that specific file to set `pinned: true`.
- **Unpin:** `::unpin [Title]`

#### C. Visibility (Drafts/Hiding)

- **Command:** `::hide [Title]` or `::private [Title]`
- **Logic:** Sets `draft: true`. The file exists, but Astro will not build it into the public HTML.
- **Publish:** `::publish [Title]` (Reverses the action).

#### D. Changing the Theme (Retroactive)

- **Command:** `::style [Title] [ThemeName]`
- **Example:** `::style My Ski Log technical`
- **Logic:** The worker finds the file, parses the frontmatter, updates the `theme` variable, and saves it back.

---

### 2. Channel Implementation

How does this look for your specific users?

#### For The Mechanic (Telegram/Chat)

Chat allows for interactivity, which is safer.
1. **Brother types:** `::delete Carburetor Fix`
2. **Bot replies:** *“I found 'Carburetor Fix'. Are you sure you want to throw it in the trash? (Reply Yes)”*
3. **Brother types:** `Yes`
4. **Bot:** *“Trashed.”*

*Note: We can also map the slash command `/delete` to `::delete` since that is native to Telegram UI.*

#### For The Mother (Email)

Email is *“Fire and Forget.”*
- **To Delete:** She sends an email with Subject: `::delete Apple Pie`. Body is empty.
- **To Edit:** She just sends the email again with the same Subject (`Apple Pie`) and the *new* body content. The system overwrites it.
    - *Wait, what if she wants to fix a typo but doesn't have the original text?*
    - **Feature:** She can email `::fetch Apple Pie`. The system replies to her email *with* the current Markdown content. She edits it, hits reply, and it updates.

#### For The Architect (CLI)

You just use the flags we built earlier:

```bash
garden prune "My Old Note"  # Deletes
garden pin "My Best Note"   # Pins
```

---

### 3. The *“Help”* Command

Since there is no UI, the user needs to know what is possible.

- **Command:** `::help`
- **Telegram Bot Reply / Email Auto-Reply:**

> **Standard.garden Command List:**
>
> 🌱 **To Post:** Just send text or a photo.
> ✏️ **To Edit:** Send a post with the same title.
>
> 🗑 **::delete [Title]** - Move a note to trash.
> 📌 **::pin [Title]** - Stick note to top of your page.
> 🙈 **::hide [Title]** - Make note private.
> 🎨 **::style [Title] [technical/humanist]** - Change the look.

### Summary of Features to Implement in the Worker

1. **The Router:** Check if the payload starts with `::`.
2. **The Finder:** Search R2 for a filename that matches the `slug(Title)`.
3. **The Modifier:**
    - If `::delete` -> Move object to `_trash/`.
    - If `::pin` -> Read file -> Edit Frontmatter -> Write file.
    - If `::fetch` -> Read file -> Send Email/Chat reply.
4. **The Builder:** Trigger the Astro build webhook.

This keeps the system *“Headless”* but gives the user full control over their content life-cycle.

---

# :: Logo

The `::` (Double Colon) is the perfect symbol for this project. It works on three levels of depth, which makes it a *“Smart Logo.”*

1. **The Technical Level:** In CSS, `::` denotes a **Pseudo-element** (like `::before` or `::after`). It represents the *hidden architecture*—exactly what you are selling to the Architect.
2. **The Functional Level:** It is the **Trigger Key** for your command line (`::delete`, `::pin`). It represents *control*.
3. **The Visual Level:** As you said, it looks like **Seeds** in a garden row, or points on a **Grid**.

**Verdict:** Drop the `s`.
`::s` looks like a typo or a variable name.
`::` is a **Symbol**. It is symmetric, iconic, and abstract.

Here is the Design Spec for the **Standard.garden** identity.

---

### 1. The Mark: The *“Standard Seeds”*

**The Symbol:** `::`

**The Geometry:**
Do not use a standard font file for the logo. Draw it geometrically.
- **Shape:** Two perfect circles (or two perfect squares, depending on the theme—see below).
- **Spacing:** The distance between the top and bottom dot should be exactly equal to the diameter of the dot.
- **The Double:** The distance between the left column and right column should be defined by the grid.

**The Color:**
- **Primary:** **International Orange** (`#ff3b30` or your Safety Orange `#d65d0e`).
- *Why:* In a black and white world (your themes), Orange is the color of **Tools** (Fiskars scissors, Black & Decker, NASA flight suits). It screams *“Utility.”*

---

### 2. The *“Polymorphic”* Logo

Since your product changes themes based on the user, **the logo should adapt.** This is a very *“Swiss Style”* idea—the logo is not a stamp, it's a system.

**A. The International Logo (Default)**
- **Shape:** 4 Squares.
- **Vibe:** Pixelated, Grid-like, Bauhaus.
- **Look:**

    ```
    ■  ■
    ■  ■
    ```

**B. The Technical Logo (The Mechanic)**
- **Shape:** ASCII Text.
- **Vibe:** Monospaced, Terminal.
- **Look:**

    ```
    : :
    ```

    (Using `IBM Plex Mono` Bold).

**C. The Humanist Logo (The Weaver)**
- **Shape:** 4 Circles (Seeds).
- **Vibe:** Organic, softness.
- **Look:**

    ```
    ●  ●
    ●  ●
    ```

---

### 3. The Wordmark

The logo acts as the separator. This is how it should look in the Header of the site:

**STANDARD :: GARDEN**

- **Font:** `Inter` (All Caps, Tracking 0.1em, Bold).
- **Color:** Black.
- **The `::`:** Orange.

---

### 4. The Favicon (Browser Tab)

Just the orange `::` on a transparent background.
It will stand out beautifully amongst the clutter of blue and colorful icons in a browser tab. It looks like a warning light or a status indicator.

### Implementation

You don't need to hire a designer.
1. Open Figma.
2. Type `::` using **Inter Black**.
3. Convert to Outline.
4. Tighten the kerning so they form a tight square block.
5. Export as SVG.

It is brutalist. It is simple. It is Standard.
**It is done.**

---

You have great taste. **Söhne** and **Diatype** are the holy grail of modern Swiss typography, but they cost thousands of dollars for a license that allows user-generated content. We need an Open Source (OFL) solution so you can bundle it for free.

**The short answer:** No, Inter does **not** have a monospaced version.

Here is the **Standard Typographic Strategy** to solve your problem.

### 1. The *“Standard”* Stack (The Pairing)

Since Inter has no mono, we pair it with the font that shares its X-height and *“Industrial”* soul.

- **Headers & UI:** **Inter**
    - *Why:* You already found the sweet spot (`-0.065em`, `900` weight). It is the best free display font in the world.
- **The Logo & Code:** **IBM Plex Mono**
    - *Why:* It is the definition of *“Standard.”* It is crisp, mechanical, and distinct. It creates a beautiful contrast with Inter.
- **Body Text:** **Instrument Sans** (The *“Söhne Killer”*)
    - *Why:* If you feel Inter is too *“UI”* for long reading, switch the body to **Instrument Sans**. It is a newer Google Font that feels exactly like *Söhne* or *Diatype*. It is taller, narrower, and has more *“ink”* than Inter. It reads like a magazine, not an app.

---

### 2. Implementing the CSS Logo (`::`)

You are 100% right. Using a font for the logo allows it to adapt to color themes instantly.

We use **IBM Plex Mono** for the seeds because its punctuation is chunky and square, unlike Inter's round dots.

**The Code:**

```html
<a href="/" class="brand">
  STANDARD<span class="seeds">::</span>GARDEN
</a>
```

**The CSS:**

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&family=Inter:wght@900&display=swap');

.brand {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.05em; /* Tight Swiss Header */
  color: black;
  text-decoration: none;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  gap: 4px; /* Space around seeds */
}

.seeds {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600; /* Make dots chunky */
  letter-spacing: -0.2em; /* Squeeze the colons together */
  color: #d65d0e; /* Safety Orange */
  transform: translateY(-2px); /* Optical alignment */
}
```

**Why this works:**
- `letter-spacing: -0.2em` on the `.seeds` forces the two colons to sit tight, forming that perfect square grid shape you want.
- It renders perfectly on a Retina screen and a cheap Android phone.
- It costs 0kb in images.

### 3. Tuning *“Inter”* for Reading (The Secret)

If you decide to stick with Inter for the body (to keep the asset load light), you must use **OpenType Features** to make it feel like a reading font and less like a UI font.

Inter has *“CV”* (Character Variant) sets that change its personality.

```css
body {
  font-family: 'Inter', sans-serif;
  
  /* The "Humanist" Tweak */
  font-feature-settings: 
    "cv11" 1, /* Round 'a' (Single story) - simpler, cleaner */
    "cv05" 1, /* Lowercase 'l' with tail - distinguishes from 'I' */
    "cv08" 1; /* Uppercase 'I' with serifs - distinguishes from 'l' */
    
  /* Optimization */
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  letter-spacing: -0.01em; /* Inter reads better slightly tight */
}
```

### Verdict

1. **Logo:** Text-based. **IBM Plex Mono**. Squeezed tight.
2. **Headers:** **Inter**. Black weight. Negative tracking.
3. **Body:** **Instrument Sans** (if you want *Söhne* vibes) OR **Inter** (with `cv05` and `cv08` turned on).

Use **Instrument Sans** for the body. It will give you that *“Diatype”* look you are craving for free.

# :: Protocol Specification

This is the **Standard Protocol Specification (v1.0)**.

We need a schema that is **forgiving** for the Mechanic (who sends an email) but **powerful** for the Architect (who wants to tweak the kerning).

We divide the Frontmatter into four logical blocks: **Identity, Control, Design, and System.**

### 1. The Universal Schema (The `.md` Note)

This is what lives at the top of every single content file.

```yaml
---
# === IDENTITY (Required) ===
title: "Fixing the 1967 Carburetor"  # The H1. Also creates the slug.
date: 2025-11-20T14:30:00            # Creation time.
updated: 2025-11-21T09:00:00         # Last edit time (Auto-updated by Worker).

# === CONTROL (Optional) ===
draft: false                         # If true, only visible to Owner (Preview Mode).
pinned: false                        # If true, sticks to top of Homepage/Feed.
archived: false                      # If true, excluded from the "Compost" rule (Never deleted).

# === DESIGN (Optional - The "Weaver" Layer) ===
theme: default                       # Overrides global config (international, technical, humanist, editorial).
cover: /images/carb-01.jpg           # Main image for the feed card.
style:                               # The "Standard" Design Tokens (CSS Variable overrides)
  ink: "#2b2b2b"                     # Text color
  paper: "#f0f0f0"                   # Background color
  accent: "#d65d0e"                  # Link/Highlight color
  measure: 65ch                      # Max width of text
  leading: 1.4                       # Line height
  tracking: -0.01em                  # Letter spacing

# === TAXONOMY (Optional - Mixed Human/AI) ===
tags: [mechanic, snowmobile]         # Manual tags.
related:                             # (AI Generated) - The System appends this during build, usually.
  - title: "Snowmobile Tracks"
    url: /snowmobile-tracks
---
```

---

### 2. The Configuration Schema (`garden.md`)

This is the special file that controls the entire site.

```yaml
---
# === SITE IDENTITY ===
site_title: "Stoneham Garage"        # The name in the top left header.
author_name: "Jean-Sebastien"        # Used for meta tags / RSS.
language: fr-CA                      # Controls date formatting (21 nov 2025).
timezone: America/Montreal           # Ensures dates match your reality.

# === DEFAULTS (The Baseline) ===
default_theme: technical             # If a note has no theme, use this.
default_visibility: public           # Are new notes public by default?
compost_mode: true                   # Enable the 2-year auto-delete rule?

# === SOCIAL & META ===
avatar: /images/me.jpg               # Small circle in header.
links:                               # The "Bio" links
  - label: Instagram
    url: https://instagram.com/...
  - label: Email
    url: mailto:js@...

# === ADVANCED (The Architect) ===
custom_css: |                        # Raw CSS injected into <head>. Dangerous but powerful.
  .logo { transform: rotate(2deg); }
---
```

---

### 3. How the Input Methods Map to This

Since the Mechanic isn't typing YAML, the **Cloudflare Worker** must act as the *“Translator.”*

#### A. Email Input (The Mechanic)

- **Subject:** `Fixing the Carburetor`
- **Worker Action:**
    1. Creates `fixing-the-carburetor.md`
    2. Generates default Frontmatter:

        ```yaml
        title: "Fixing the Carburetor"
        date: [Current Timestamp]
        theme: [Read from garden.md OR use 'default']
        ```

    3. Appends Body.

#### B. Telegram Command `::pin` (The Nomad)

- **Command:** `::pin Fixing the Carburetor`
- **Worker Action:**
    1. Finds `fixing-the-carburetor.md`.
    2. Parses YAML.
    3. Sets `pinned: true`.
    4. Saves file.

#### C. Obsidian (The Architect)

- The Architect manually types:

    ```yaml
    theme: humanist
    style:
      paper: "#fff000"
    ```

- **Worker Action:** The Worker accepts this blindly. The Architect is trusted.

---

### 4. The *“AI Librarian”* Field (`semantic_id`)

We need one invisible field for the AI to work efficiently without re-reading every file every time.

```yaml
# ... inside the note ...
semantic_hash: "a1b2c3d4..."  # Hash of the content.
```

- **Logic:** When the AI Worker runs, it checks if the `semantic_hash` matches the current content.
    - **Match:** Skip embedding (Save money/compute).
    - **No Match:** Re-embed the content -> Update Vector DB -> Update Hash.

### 5. TypeScript Interface (For Astro)

Since you are using Astro, you will define this in `src/content/config.ts`. This ensures your build fails if the data is wrong (Type Safety).

```typescript
const garden = defineCollection({
  type: 'content',
  schema: z.object({
    // Identity
    title: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    
    // Control
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
    archived: z.boolean().default(false),
    
    // Design
    theme: z.enum(['international', 'technical', 'humanist', 'editorial', 'default']).optional(),
    cover: z.string().optional(),
    style: z.object({
      ink: z.string().optional(),
      paper: z.string().optional(),
      accent: z.string().optional(),
      leading: z.number().optional(),
    }).optional(),
    
    // Taxonomy
    tags: z.array(z.string()).optional(),
  }),
});
```

This structure is **robust**. It handles your Brother's simple photos and your complex typographic experiments in the same system.

You are making the architecture cleaner. This is good. We are moving from *“App Logic”* (Drafts) to *“Protocol Logic”* (Visibility).

Here is the refined **Standard Control Protocol**.

### 1. The `visibility` Property

We replace `draft` with a single, powerful state enum.

- **`visibility: public` (Default)**
    - Listed on Homepage.
    - Listed in RSS/Atom feeds.
    - Indexed by Google.
- **`visibility: unlisted` (The *“Share”* feature)**
    - **Not** on Homepage.
    - **Not** in RSS.
    - **No** Google Indexing (`<meta name="robots" content="noindex">`).
    - **Accessible:** Anyone with the link can see it.
    - *Use Case:* Sending a draft to a friend, or your Brother sharing a price list he doesn't want public yet.
- **`visibility: private` (The *“Draft”* feature)**
    - **Accessible:** Only to **You** (Requires Auth cookie or Preview Token).
    - Returns `404` for everyone else.
    - *Use Case:* Work in progress.

---

### 2. The `password` Problem (Security Warning)

**Do not put a plain text password in the Frontmatter.**
`password: hunter2` is dangerous. If you ever accidentally make your GitHub repo public, or if the build cache leaks, the password is exposed.

**The *“Standard”* Solution:**
If a user wants a password-protected note, we use the **`protected: true`** boolean.
- **Frontmatter:** `protected: true`
- **Logic:**
    1. The page loads a *“Lock Screen”* (Input field).
    2. The user enters a password.
    3. The logic checks against a **Global Site Password** (hashed in your Cloudflare Environment variables) OR a specific hash stored in `garden.md`.
    4. *MVP:* Just stick to `visibility: unlisted`. It is *“Security through Obscurity,”* which is usually enough for a Mechanic sharing a quote.

---

### 3. The `slug` (Permalink) Logic

By default, `Title: My Cool Note` -> `standard.garden/my-cool-note`.
If the user wants to override it (e.g., for SEO or shortness):

- **Frontmatter:** `slug: /pricing`
- **Result:** `standard.garden/pricing`

**The Collision Logic (Cloudflare Worker):**
When the Worker receives a post:
1. It calculates the desired slug (either from `title` or `slug` field).
2. It checks R2: *“Does `pricing.md` exist?”*
3. **If Yes:**
    - Check if the *incoming* file ID is the same as the *existing* file (Is this an edit?).
    - **If Edit:** Overwrite.
    - **If New:** Append counter -> `pricing-1.md`.
4. **If No:** Write file.

---

### 4. The *“Compost”* vs. *“Archive”*

You are right. We don't need an *“Archive”* status for the system logic if the Payment Tier handles the deletion rules.

**The Logic Flow:**
1. **Cron Job runs (Daily).**
2. **Check User:** Is `user@email.com` a **Paid Member**?
    - **Yes:** Stop. Do nothing. (Perennial Garden).
    - **No:** Proceed.
3. **Check Note:** Is `date` > 2 years ago?
    - **Yes:** Delete file.
    - **No:** Keep.

**The *“Pin”* Exception:**
Even for Free users, `pinned: true` notes should **never** be composted.
This allows a Free user to have a permanent *“About Me”* or *“Portfolio”* that doesn't rot, while their daily stream-of-consciousness returns to the earth.

---

### The Final Optimized Frontmatter

This is the cleanest version yet.

```yaml
---
# === IDENTITY ===
title: "My Secret Project"
slug: "project-x"           # Optional: Overrides /my-secret-project
date: 2025-11-20

# === CONTROL ===
visibility: unlisted        # public | unlisted | private
pinned: false               # true = Stuck to top + Never Composts
comments: false             # Future proofing

# === DESIGN ===
theme: technical
---
```

### Feature Matrix Implementation

| Feature | Free Tier | Paid Tier |
| :--- | :--- | :--- |
| **Public Notes** | Yes | Yes |
| **Unlisted Notes** | Yes | Yes |
| **Private Notes** | No (Drafts only) | Yes (Unlimited) |
| **Compost** | Notes rot after 2 years | **Never** |
| **Custom Domain** | No | Yes |
| **Pinned Notes** | Max 3 (Safe from rot) | Unlimited |

This feels fair, robust, and incredibly simple to understand.

---

check if Astro js library could also be used on their own as client side js library. That way you could offer the standard css library and the standard Js library to anyone with great semantics.

Modularize everything
Everything must be able to be context indépendant.
At some point since the html will be extra clean. Use could maybe add their own css and that would make a great reference to the old csszen garden.

Note are a playground and presentation is a playground. If you don’t play. It’s premium beautiful by default. Anyone can have their own style garden. But the content follows standard

Please give the css and js as a reference

What about a wetransfer style feature, don’t have account share anyway, public only for 7days support all the frontmatter, get into the ai public garden (or not)

---

## :: Apps

- Obsidian
- Notion
- Capacities
- Supernotes
- Mempro
- Godspeed
- WebHooks
- Telegrams
- Share App Sheet
- CLI
- Email

Support for p5 library thru code block js p5

Seo
