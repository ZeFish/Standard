# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Standard Framework** is a fine-art typography framework implementing classical design principles with mathematical precision (golden ratio). It's a multi-component design system consisting of:

- **11ty Plugin System** - Complete static site generator integration
- **CSS Framework** - Typography, grid, spacing, colors (15KB gzipped)
- **JavaScript Library** - Typography engine with smart quotes, widow prevention (2KB gzipped)
- **Cloudflare Functions** - Serverless API endpoints for comments and contact forms

**Philosophy**: Zero-configuration beauty. Professional typography and layouts out of the box.

## Essential Commands

### Development
```bash
npm start              # Dev server with live reload (port 8090)
npm run dev            # Watch CSS/JS and rebuild on changes
npm run build          # Full production build (CSS + JS + 11ty site)
```

### Build Individual Components
```bash
npm run build:css      # Compile SCSS → dist/standard.min.css
npm run build:js       # Minify JS → dist/standard.min.js
```

### Utilities
```bash
npm run clean:ports    # Kill processes on port 8083
npm run validate       # Validate front matter in markdown files
npm run commit         # Auto-generate commit message with opencommit
```

### Release
```bash
npm run changelog      # Generate CHANGELOG.md
npm run release        # Version bump + npm publish + GitHub release
```

## Code Architecture

### Repository Structure

```
Standard/
├── src/                          # Source code
│   ├── eleventy/                 # 11ty plugin system
│   │   ├── standard.js           # Main plugin orchestrator
│   │   ├── markdown.js           # Enhanced markdown parser
│   │   ├── filter.js             # Template filters
│   │   ├── shortcode.js          # Template shortcodes
│   │   ├── backlinks.js          # Wiki-style [[links]]
│   │   ├── encryption.js         # Content password protection
│   │   ├── doc-generator.js      # Auto-generate docs from JSDoc
│   │   └── cloudflare.js         # Serverless functions integration
│   ├── js/                       # Client-side JavaScript
│   │   ├── standard.js           # Typography engine (smart quotes, etc)
│   │   ├── standard.comment.js   # GitHub comments client library
│   │   └── standard.lab.js       # Experimental features
│   ├── styles/                   # SCSS architecture (ITCSS-inspired)
│   │   ├── standard.scss         # Entry point
│   │   ├── _standard-00-variables.scss   # CSS custom properties
│   │   ├── _standard-01-token.scss       # Design tokens
│   │   ├── _standard-02-color.scss       # Color system
│   │   ├── _standard-03-typography.scss  # Font scales
│   │   ├── _standard-04-elements.scss    # HTML elements
│   │   ├── _standard-05-rhythm.scss      # Vertical rhythm
│   │   ├── _standard-06-grid.scss        # 12-column grid
│   │   ├── _standard-07-prose.scss       # Reading layouts
│   │   ├── _standard-08-img.scss         # Image system
│   │   ├── _standard-09-md.scss          # Markdown elements
│   │   ├── _standard-10-components.scss  # UI components
│   │   ├── _standard-98-utilities.scss   # Utility classes
│   │   └── _standard-99-debug.scss       # Debug helpers
│   ├── layouts/                  # Nunjucks templates
│   └── cloudflare/               # Serverless function handlers
│       └── api/
│           ├── comments.js       # Comments API endpoint
│           └── contact.js        # Contact form handler
├── content/                      # Documentation site content
│   ├── 11ty/                     # 11ty guides
│   ├── css/                      # CSS documentation
│   ├── cloudflare/               # Cloudflare docs
│   └── docs/                     # Auto-generated API docs
├── scripts/                      # Build scripts
│   ├── build-css.js              # SCSS compiler
│   └── build-js.js               # JS minifier
├── dist/                         # Compiled CSS/JS (output)
├── _site/                        # Built documentation site (output)
└── eleventy.config.js            # 11ty configuration
```

### SCSS Layer System (ITCSS-Inspired)

The CSS is organized in numbered layers that must be imported in order:

| Layer | File | Purpose |
|-------|------|---------|
| 00 | variables | CSS custom properties, design tokens |
| 01 | token | Token system setup |
| 02 | color | Color system, light/dark themes |
| 03 | typography | Font scales, weights, line heights |
| 04 | elements | Styled HTML elements (h1-h6, buttons, forms) |
| 05 | rhythm | Vertical rhythm, spacing system |
| 06 | grid | 12-column responsive grid |
| 07 | prose | Reading layouts (measure, flow) |
| 08 | img | Image system |
| 09 | md | Markdown-specific styling |
| 10 | components | UI components (themes, etc.) |
| 98 | utilities | Utility classes |
| 99 | debug | Debug helpers |

**Important**: When adding new SCSS, place it in the appropriate layer. Lower numbers = more generic, higher numbers = more specific.

### 11ty Plugin Architecture

The main plugin (`src/eleventy/standard.js`) orchestrates all sub-plugins:

```javascript
import Standard from "@zefish/standard";

eleventyConfig.addPlugin(Standard, {
  outputDir: "assets/standard",     // Where to copy files
  copyFiles: true,                  // Copy from node_modules
  useCDN: false,                    // Use local vs CDN
  cloudflare: { enabled: true },    // Enable Cloudflare Functions
  comments: { enabled: true }       // Enable GitHub comments
});
```

**Key Sub-Plugins**:
- `Markdown` - Enhanced markdown with syntax highlighting, callouts, footnotes
- `Filter` - Template filters (excerpt, date formatting, image extraction)
- `ShortCode` - Custom shortcodes (`{% standardAssets %}`, `{% standardMenu %}`)
- `Backlinks` - Wiki-style `[[page]]` linking with auto-generated backlinks
- `Encryption` - Password-protected content (client-side decryption)
- `DocGenerator` - Auto-generates API docs from JSDoc comments

### Typography Engine (`src/js/standard.js`)

Implements classical typography rules that CSS cannot handle:

**Features**:
- Smart quotes (locale-aware: `"hello"` → `"hello"`)
- Em/en dashes (`--` → `—`, `-` → `–`)
- Fractions (`1/2` → `½`)
- Widow prevention (prevents single word on last line)
- Number formatting (locale-specific thousands separators)
- Symbols (`->` → `→`, `(c)` → `©`)

**Supported Locales**: `en`, `fr`, `de`, `es`, `it`

**Auto-initializes** on page load. Skips `<code>`, `<pre>`, and elements with `translate="no"`.

## Build System

### CSS Build Process (`scripts/build-css.js`)

1. Compile SCSS files using Sass
2. Minify with CleanCSS
3. Create bundles (standard.bundle.css)
4. Output to `dist/`

**Output Files**:
- `standard.min.css` - Core framework
- `standard.theme.min.css` - Theme system
- `standard.bundle.css` - Combined bundle

### JS Build Process (`scripts/build-js.js`)

1. Minify JavaScript with Terser
2. Create bundles with htmx and other dependencies
3. Output to `dist/`

**Output Files**:
- `standard.min.js` - Core typography engine
- `standard.comment.js` - Comments system
- `standard.lab.js` - Experimental features
- `standard.bundle.js` - With htmx
- `standard.bundle.full.js` - Everything included

### Documentation Build

**README Sync**: `README.md` (root) is automatically copied to `content/README.md` before each build, preventing duplication.

**Auto-Generated Docs**: `DocGenerator` scans source files for JSDoc comments with `@component` tags and generates markdown in `content/docs/`.

**Site Generation**: 11ty builds `content/` → `_site/` using layouts from `src/layouts/`.

## Development Workflow

### Adding New Features

1. **Write code** in appropriate `src/` directory
2. **Add JSDoc comments** with `@component`, `@category`, `@description`, `@example` tags
3. **Update hand-written docs** in `content/` if needed
4. **Build**: `npm run build`
5. **Verify**: Check `_site/` for generated docs
6. **Commit**: Include both code and documentation changes

### JSDoc Documentation Template

```javascript
/**
 * @component Component Name
 * @category Category (e.g., "Typography", "Grid", "11ty Plugins")
 * @description Clear description of what this does and why.
 *
 * @param {type} paramName Description
 * @returns {type} What it returns
 *
 * @example
 * // Show usage
 * const result = myFunction(input);
 *
 * @since 0.10.0
 */
```

### SCSS Development

When modifying styles:

1. **Find the right layer** - Check the table above
2. **Edit the partial** - e.g., `_standard-03-typography.scss`
3. **Build**: `npm run build:css`
4. **Test**: Run dev server to see changes

**Watch mode**: `npm run watch:css` rebuilds automatically.

### Adding a New 11ty Plugin Feature

1. Create new file in `src/eleventy/` or add to existing plugin
2. Add JSDoc documentation
3. Register in `src/eleventy/standard.js`
4. Update `content/11ty/index.md`
5. Build and test

### Cloudflare Functions

**Architecture**: Functions are copied from `src/cloudflare/` to `functions/` during build. Cloudflare Pages deploys them automatically.

**Environment Variables** (set in Cloudflare Pages dashboard):
- `GITHUB_TOKEN` - Personal access token with repo scope
- `GITHUB_OWNER` - GitHub username
- `GITHUB_REPO` - Repository name
- `GITHUB_COMMENTS_PATH` - Path for comments (default: `data/comments`)
- `MODERATION_EMAIL` - Admin email for moderation

**Comments System**:
- Endpoint: `/api/comments`
- Storage: GitHub repository as markdown files
- Client: `standard.comment.js` handles rendering and submission

## Key Design Principles

### 1. Mathematical Precision
- **Golden ratio (φ = 1.618)** applied to all proportions
- **Vertical rhythm** using `1rlh` units for baseline grid alignment
- **Scale system** derives font sizes from golden ratio

### 2. Zero Configuration
- Works beautifully out of the box
- Sensible defaults for everything
- Customization via CSS variables is optional

### 3. Progressive Enhancement
- Core experience without JavaScript
- JavaScript enhances (smart quotes, widow prevention)
- Mobile-first responsive design

### 4. Single Responsibility
- Each SCSS layer has one purpose
- Each plugin handles one feature
- Clear separation of concerns

### 5. Documentation-as-Code
- JSDoc comments auto-generate API docs
- Hand-written guides explain concepts
- README syncs to homepage automatically

## Common Patterns

### Responsive Grid Classes

```html
<div class="grid">
  <div class="col-12 md:col-6 lg:col-4">
    Full width → half → third
  </div>
</div>
```

### Reading Layout

```html
<article class="prose md">
  <!-- Optimized for ~60 characters per line -->
  <p>Beautiful typography automatically.</p>
</article>
```

### Wiki-Style Links

```markdown
Learn about [[Typography]] and [[Grid System]].
```

Auto-generates backlinks on linked pages.

### Password Protection

```markdown
---
layout: base.njk
password: secret-key
---

# Protected Content

Only visible after entering password.
```

## Testing

Currently no automated tests. Manual testing workflow:

1. Build: `npm run build`
2. Start dev server: `npm start`
3. Check `localhost:8090`
4. Test responsive breakpoints
5. Test typography enhancements
6. Verify documentation generation

## Release Process

1. Make changes and commit
2. Update version: `npm version patch|minor|major`
3. Generate changelog: `npm run changelog`
4. Build assets: `npm run build`
5. Release: `npm run release` (requires `GITHUB_TOKEN` in `.env`)

**Release-it Configuration**: Handles version bumping, changelog, git tags, npm publish, GitHub releases.

## Important Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, version, exports |
| `eleventy.config.js` | 11ty configuration for docs site |
| `src/eleventy/standard.js` | Main plugin entry point |
| `src/styles/standard.scss` | CSS entry point |
| `scripts/build-css.js` | CSS build script |
| `scripts/build-js.js` | JS build script |
| `.rules` | Cursor/AI assistant rules (1600+ lines) |
| `site.config.yml` | Site metadata for documentation |

## Gotchas and Important Notes

### 1. README Sync
- **Edit `README.md` in root**, not `content/README.md`
- Changes sync automatically during build
- Watch mode detects changes

### 2. SCSS Layer Order
- Layers must be imported in numbered order (00 → 99)
- Adding new SCSS? Use appropriate layer number
- Utilities come last (layer 98), debug last of all (99)

### 3. Typography Engine
- Auto-initializes aggressively on page load
- Can be disabled per-element with `data-standard-quotes="false"`
- Processes in batches to avoid blocking UI
- Uses MutationObserver for dynamic content

### 4. Cloudflare Functions
- Uses **Cloudflare Pages Functions**, NOT Wrangler
- Functions auto-deploy when you push to GitHub
- Must set environment variables in Cloudflare dashboard

### 5. Documentation Generation
- Only regenerates if source files change (SHA256 hash check)
- Cache stored in `.doc-generator-hash` (don't commit)
- Auto-generated docs in `content/docs/` (don't edit manually)

### 6. Git Workflow
- Commit `src/` and `content/` (source files)
- Don't commit `_site/`, `dist/`, `.doc-generator-hash` (generated)
- `content/docs/` regenerates automatically

## Package Exports

```javascript
import Standard from "@zefish/standard";           // 11ty plugin
import "@zefish/standard/css";                     // CSS only
import "@zefish/standard/theme";                   // Theme system
import "@zefish/standard/js";                      // JS only
import Cloudflare from "@zefish/standard/cloudflare"; // Functions
```

## Performance Notes

- **CSS**: 15KB gzipped (highly optimized)
- **JS**: 2KB gzipped (minimal footprint)
- **Typography Engine**: Batch processing prevents UI blocking
- **Build Time**: ~2-3 seconds for full rebuild
- **Documentation**: Caching prevents unnecessary regeneration

## Debugging

### Debug Utilities (Layer 99)

```html
<div class="debug">
  <!-- Shows outline, grid, spacing helpers -->
</div>
```

### Verbose Logging

```javascript
eleventyConfig.addPlugin(Standard, {
  verbose: true  // Enables detailed logging
});
```

### CSS Watch Issues

If watch mode isn't picking up changes:
```bash
npm run clean:ports  # Kill stuck processes
npm run dev          # Restart watch
```

## Links

- **Homepage**: https://standard.ffp.co
- **GitHub**: https://github.com/ZeFish/Standard
- **npm**: https://www.npmjs.com/package/@zefish/standard
- **Cheat Sheet**: https://standard.ffp.co/cheat-sheet

---

**Last Updated**: October 2024  
**Framework Version**: 0.13.12  
**Maintained By**: Francis Fontaine

For detailed architecture documentation, see `content/claude.md` (1600+ lines) which is rendered at https://standard.ffp.co/claude/
