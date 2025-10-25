You're absolutely right! I missed the **Future Improvements** section from the original document. Let me add that complete section back in. Here's the corrected section to insert into the `claude.md` file:

```markdown
---

## Future Improvements & Roadmap

### High Priority (Should Consider Soon)

🟡 **RSS/Atom Feed Plugin**
- **Observation**: No built-in feed generation for blog/content sites
- **Suggestion**: Add `@11ty/eleventy-plugin-rss` integration
- **Implementation**:
  ```javascript
  eleventyConfig.addPlugin(feedPlugin, {
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
  ```
- **Benefit**: Standard SEO/syndication support out of the box
- **Impact**: Low - optional plugin
- **Related Files**: New plugin in `src/eleventy/feed.js`

🟡 **Sitemap Generation**
- **Observation**: No automatic sitemap.xml generation
- **Suggestion**: Add sitemap layout that auto-generates from public collection
- **Implementation**: Create `src/layouts/sitemap.njk` that iterates over `collections.public`
- **Benefit**: Better SEO, easier for search engines to crawl
- **Impact**: Low - single template file
- **Related Files**: New file `src/layouts/sitemap.njk`

🟡 **Image Service Integration (Cloudflare Images)**
- **Observation**: No automatic image optimization/resizing
- **Suggestion**: Add Cloudflare Images integration for automatic responsive images
- **Features**:
  - Automatic WebP/AVIF conversion
  - Responsive srcset generation
  - On-the-fly resizing
  - CDN delivery
- **Benefit**: Faster page loads, better Core Web Vitals
- **Impact**: Medium - requires Cloudflare Images account
- **Related Files**: New plugin `src/eleventy/images.js`

🟡 **Code Block Horizontal Scrolling**
- **Observation**: Long code lines can break layout on mobile
- **Suggestion**: Add wrapper with horizontal scroll for `<pre><code>` blocks
- **Implementation**:
  ```scss
  pre {
    overflow-x: auto;
    max-width: 100%;
  }
  ```
- **Benefit**: Better mobile experience, prevents layout breaks
- **Impact**: Low - CSS only
- **Related Files**: `src/styles/standard-09-md.scss`

🟡 **Table Horizontal Scrolling**
- **Observation**: Wide tables break layout on mobile
- **Suggestion**: Wrap tables in scrollable container
- **Implementation**:
  ```scss
  .prose table {
    display: block;
    overflow-x: auto;
    max-width: 100%;
  }
  ```
- **Benefit**: Better mobile experience for data tables
- **Impact**: Low - CSS only
- **Related Files**: `src/styles/standard-07-prose.scss`

🟡 **Contact Form Handler**
- **Observation**: Comments system exists, but no general contact form
- **Suggestion**: Add generic contact form Cloudflare function
- **Current**: `src/cloudflare/api/contact.js` exists but not documented
- **Benefit**: Easy contact forms without third-party services
- **Impact**: Low - already exists, needs documentation
- **Related Files**: `src/cloudflare/api/contact.js`, add shortcode

🟡 **Standardized Shortcode Naming**
- **Observation**: Some shortcodes use camelCase, others use different conventions
- **Suggestion**: Standardize all shortcodes to consistent naming
- **Current**: `{% standardAssets %}`, `{% standardComment %}`
- **Proposed**: Keep `standard` prefix for all framework shortcodes
- **Benefit**: Clearer API, easier to remember
- **Impact**: Low - documentation update
- **Related Files**: `src/eleventy/shortcode.js`

### Medium Priority (Nice to Have)

🟢 **Rename `.flow` to `.column`**
- **Observation**: `.flow` class name is not immediately intuitive
- **Suggestion**: Rename to `.column` for clearer semantic meaning
- **Rationale**: "Column" better describes vertical stacking layout
- **Breaking Change**: Yes - requires migration guide
- **Impact**: Medium - affects existing users
- **Related Files**: `src/styles/standard-05-rhythm.scss`

🟢 **Localization System**
- **Observation**: Typography supports 5 locales, but no i18n for UI strings
- **Suggestion**: Add localization system for UI strings (nav, buttons, forms)
- **Implementation**:
  - JSON files for each locale (`src/locales/en.json`, `fr.json`, etc.)
  - Filter: `{{ "contact.submit" | t }}`
  - Auto-detect from `<html lang>` attribute
- **Benefit**: True multi-language site support
- **Impact**: Medium - new system to maintain
- **Related Files**: New directory `src/locales/`, new filter in `filter.js`

🟢 **Print Stylesheet**
- **Observation**: No optimized print styles
- **Suggestion**: Add print-specific CSS for better printed output
- **Implementation**:
  ```scss
  @media print {
    .no-print,
    .no-print *,
    .footer,
    .header {
      display: none !important;
    }
    body {
      padding: 0;
    }
    a[href]:after {
      content: " (" attr(href) ")";
    }
  }
  ```
- **Benefit**: Better printed documentation, accessible offline
- **Impact**: Low - CSS only
- **Related Files**: New file `src/styles/standard-10-print.scss`

🟢 **Dark Mode Toggle Component**
- **Observation**: Dark mode exists but no UI toggle
- **Suggestion**: Add optional shortcode for dark/light mode toggle button
- **Implementation**: `{% darkModeToggle %}` shortcode with localStorage persistence
- **Benefit**: User control over theme preference
- **Impact**: Low - optional shortcode
- **Related Files**: New shortcode in `shortcode.js`

🟢 **Performance Profiling System**
- **Observation**: No metrics for build-time typography processing
- **Suggestion**: Add optional performance tracking mode (dev only)
  ```javascript
  enablePerformanceMeasurement: false,
  // Tracks: processTime, elementsProcessed, batchCount
  ```
- **Benefit**: Helps optimize large documents, debugging slow builds
- **Impact**: Medium - adds event data
- **Related Files**: `src/eleventy/markdown.js`, `filter.js`

🟢 **Error Reporting Improvements**
- **Observation**: Limited error messages for configuration issues
- **Suggestion**: Add user-friendly error messages with suggestions
- **Example**: If `locale` is invalid, suggest valid options
- **Impact**: Low - improves DevX
- **Related Files**: `src/eleventy/eleventy.js`, `markdown.js`

### Low Priority (Enhancement Ideas)

💡 **Locale Expansion**
- **Observation**: Supports 5 locales (EN, FR, DE, ES, IT)
- **Suggestion**: Add community-contributed locales (PT, NL, RU, ZH, JA)
- **Benefit**: Extends framework utility globally
- **Impact**: Low - data-driven, can be gradual
- **Related Files**: `src/eleventy/markdown.js` or `filter.js` (typography rules)

💡 **Typography Rule Customization**
- **Observation**: Typography rules are hardcoded per locale
- **Suggestion**: Allow users to override rules:
  ```javascript
  eleventyConfig.addPlugin(Standard, {
    typography: {
      customRules: {
        en: {
          emDash: "—", // Override default
          leftDoubleQuote: "«" // Mix rules
        }
      }
    }
  });
  ```
- **Benefit**: Supports regional variations within locales
- **Impact**: Medium - adds complexity but very flexible
- **Related Files**: `src/eleventy/markdown.js`, `filter.js`

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

💡 **Markdown Extensions**
- **Observation**: Basic markdown support, could be enhanced
- **Suggestion**: Add support for:
  - Definition lists
  - Task lists (`- [ ]` checkboxes)
  - Admonitions/callouts (beyond current implementation)
  - Mermaid diagrams
  - Math equations (KaTeX)
- **Benefit**: Richer content possibilities
- **Impact**: Medium - requires additional markdown-it plugins
- **Related Files**: `src/eleventy/markdown.js`

💡 **Component Library**
- **Observation**: Framework provides primitives, but no pre-built components
- **Suggestion**: Add optional component library:
  - Card layouts
  - Hero sections
  - Navigation patterns
  - Footer templates
  - Form layouts
- **Benefit**: Faster prototyping, common patterns
- **Impact**: High - new maintenance burden
- **Related Files**: New directory `src/components/`

### Architecture Improvements

✅ **Current Strengths**
- Excellent separation of concerns
- Zero runtime dependencies (minimal attack surface)
- Progressive enhancement throughout
- Mathematical principles consistently applied
- Comprehensive JSDoc with auto-doc generation
- Typography processing at build-time (fast, SEO-friendly)

🔧 **Potential Refactoring**
1. **Typography Engine**
   - Currently split across `markdown.js` and `filter.js`
   - Consider: Consolidate into single `typography.js` module
   - Benefit: Easier to maintain, clearer API
   - Impact: Medium refactor

2. **CSS Architecture**
   - 12 SCSS layers is well-organized
   - Monitor total CSS size (currently well under 50KB uncompressed)
   - Consider: CSS custom properties for all design tokens
   - Benefit: Runtime theme switching without rebuild

3. **Plugin System**
   - Consider generic plugin interface/base class
   - Current: Each plugin self-contained (good)
   - Could standardize lifecycle hooks for consistency

### Code Quality Notes

✨ **Exemplary Patterns**
- Locale-specific typography rules are elegant (single configuration per locale)
- Build-time processing preserves HTML structure
- Smart caching with `.doc-generator-hash` prevents unnecessary regeneration
- Educational JSDoc connects modern code to 500 years of design history

⚠️ **Watch Out For**
- Typography processing happens during build - test thoroughly on large sites
- Regex patterns in punctuation processing could match unintended patterns
- Markdown-it plugin order matters - document dependencies

### Documentation Opportunities

📚 **Content to Add**
- [ ] Performance benchmarks for large sites (build time)
- [ ] Browser compatibility matrix (updated)
- [ ] Accessibility audit results (WCAG AA compliance)
- [ ] Use case studies or examples
- [ ] Contributing guide for translations
- [ ] Troubleshooting guide for common issues
- [ ] Video tutorials for getting started
- [ ] Migration guide from v0.10.x to v0.11.x

---

## How to Use This Section

This "Future Improvements" log serves as:
- **Idea capture** — Document thoughts as they arise
- **Priority tracking** — Focus efforts on high-impact items
- **Decision log** — Record why something wasn't implemented
- **Future reference** — Plan next version features
- **Community input** — Suggestions from users

**When to update**:
- After code review (add observations)
- When planning releases (prioritize items)
- Before major refactor (reference for scope)
- After user feedback (add suggestions)
- During architecture discussions

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
```

This is the complete **Future Improvements** section from your original document, including:

1. ✅ **RSS/Atom Feed Plugin** - Integration with eleventy-plugin-rss
2. ✅ **Sitemap Generation** - Auto-generated sitemap.xml
3. ✅ **Image Service** - Cloudflare Images integration
4. ✅ **Code/Table Scrolling** - Horizontal scroll for mobile
5. ✅ **Contact Form** - Generic contact handler
6. ✅ **Shortcode Naming** - Standardization
7. ✅ **`.flow` → `.column` rename** - Better semantics
8. ✅ **Localization System** - i18n for UI strings
9. ✅ **Print Stylesheet** - Optimized print output
10. ✅ **All other improvements** from your original list
