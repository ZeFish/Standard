// src/eleventy/syntax.js

/**
 * @component friendly-layout-syntax
 * @category 11ty-plugins/content-authoring
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * @concept
 * In 1989, Tim Berners-Lee invented HTML with a simple philosophy: markup should
 * be readable by humans, not just machines. But as the web evolved, authoring
 * content became increasingly complex. Want a two-column layout? Write nested
 * divs with cryptic class names. Need a card grid? Copy-paste twenty lines of
 * boilerplate HTML. Markdown promised simplicity but lacked layout primitives.
 *
 * The Friendly Layout Syntax bridges this gap. Inspired by Obsidian's callout
 * syntax and MDX's component model, it introduces a minimal, readable notation
 * for common layout patterns. Instead of wrestling with HTML or learning a
 * complex templating language, authors write:
 *
 *   ::columns 2
 *   First column content here.
 *   ---
 *   Second column content here.
 *   ::end
 *
 * That's it. The system transforms this into a semantic, accessible grid layout
 * with responsive behavior built-in. No classes to remember, no HTML to write,
 * no cognitive overhead.
 *
 * This approach follows the Unix philosophy: small, composable tools that do one
 * thing well. Each syntax pattern (::columns, ::card, ::hero) is atomic and
 * predictable. Patterns compose naturally—nest a ::quote inside a ::feature
 * container, or combine ::split with ::image. The syntax never fights you.
 *
 * The system supports three pattern types:
 *
 * 1. **Inline patterns** — Single-line directives that expand in place:
 *    ::space medium
 *    ::note This is important
 *
 * 2. **Block patterns** — Multi-line containers with ::end delimiter:
 *    ::hero center
 *    # Welcome
 *    Your content here
 *    ::end
 *
 * 3. **Conditional patterns** — Dynamic content based on page data:
 *    ::if featured
 *    This only appears on featured posts.
 *    ::end
 *
 * Built-in patterns cover 90% of layout needs: columns, grids, cards, heroes,
 * galleries, forms, callouts, and more. But the real power is extensibility—
 * add custom patterns via the exposed `Syntax` processor API.
 *
 * @theory
 * The syntax preprocessor runs BEFORE Markdown processing, transforming layout
 * directives into HTML that Markdown parsers ignore. This two-phase approach
 * preserves content flow while enabling rich layouts.
 *
 * The parser uses position-zero detection for tags (^:: at line start) and lazy
 * regex matching for content extraction. Handlers receive structured match objects
 * with parsed arguments, inner content, and page context. This design enables:
 *
 * - **Deterministic output** — Same input always produces same HTML
 * - **Composability** — Patterns nest without conflicts
 * - **Performance** — Single-pass processing with minimal overhead
 * - **Debuggability** — Unprocessed patterns logged as warnings
 *
 * The priority system (lower numbers first) ensures predictable execution order.
 * AI patterns run asynchronously BEFORE layout patterns to allow AI-generated
 * content to participate in layout directives.
 *
 * @implementation
 * The `SyntaxProcessor` class manages pattern registration and execution.
 * Handlers register with type ('inline', 'block', or 'both') and priority.
 * During processing, the system:
 *
 * 1. Sorts handlers by priority (ascending)
 * 2. Applies inline patterns (single-line matches)
 * 3. Applies block patterns (multi-line with ::end)
 * 4. Warns about unprocessed patterns
 *
 * Block patterns use regex: `^::name([^\n]*)\n([\s\S]*?)^::end` (multiline mode)
 * Inline patterns use: `^::name\s+([^\n]+)` (global multiline mode)
 *
 * Content splitting (`splitContent`) divides inner blocks on delimiter (default: ---)
 * for column/card layouts. Grid calculations use 12-column math: colSpan = 12 / count.
 *
 * The AI preprocessor runs BEFORE the main syntax processor, resolving ::ai
 * directives via the Standard AI system (if enabled). This allows prompts like:
 *
 *   ::ai Write a brief introduction to typography
 *
 * The output becomes markdown that layout patterns can wrap.
 *
 * @class SyntaxProcessor - Main processor managing pattern handlers
 * @function registerBuiltIns - Registers 20+ built-in layout patterns
 * @function evaluateCondition - Evaluates ::if conditionals against page data
 *
 * @example md - Two-column layout
 *   ::columns 2
 *   Left column with **markdown** support.
 *   ---
 *   Right column with images and links.
 *   ::end
 *
 * @example md - Asymmetric split layout
 *   ::split 8/4
 *   Main content area (8 columns).
 *   ---
 *   Sidebar content (4 columns).
 *   ::end
 *
 * @example md - Card grid
 *   ::cards 3
 *   ## Card One
 *   Content here.
 *   ---
 *   ## Card Two
 *   More content.
 *   ---
 *   ## Card Three
 *   Final card.
 *   ::end
 *
 * @example md - Hero section
 *   ::hero center
 *   # Welcome to Standard
 *   Beautiful typography meets Swiss grid systems.
 *   ::end
 *
 * @example md - Obsidian-style callouts
 *   ::callout + tip
 *   This callout starts collapsed (+ = foldable, open).
 *   Supports all Obsidian callout types: note, warning, tip, etc.
 *   ::end
 *
 * @example md - Conditional content
 *   ::if featured
 *   This badge only appears on featured posts.
 *   ::end
 *
 * @example md - AI-generated content (inline)
 *   ::ai Write a haiku about typography
 *
 * @example md - AI-generated content (block)
 *   ::ai model=gpt-4
 *   Explain the golden ratio in typography.
 *   Provide historical context and modern applications.
 *   ::end
 *
 * @example js - Custom pattern registration
 *   eleventyConfig.Syntax.add('banner', { type: 'block' }, (match) => {
 *     return `<div class="banner ${match.args}">${match.content}</div>`;
 *   });
 *
 * @example js - Inline pattern with arguments
 *   eleventyConfig.Syntax.add('emoji', { type: 'inline' }, (match) => {
 *     const emojis = { wave: '👋', heart: '❤️', star: '⭐' };
 *     return emojis[match.value] || match.value;
 *   });
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} site - Site configuration (includes standard.verbose)
 * @returns {SyntaxProcessor} Configured processor instance
 *
 * @related markdown, preprocessor, ai-integration, obsidian-callouts
 * @reading https://help.obsidian.md/Editing+and+formatting/Callouts Obsidian Callouts
 * @reading https://mdxjs.com/ MDX — Markdown for the component era
 * @reading https://www.11ty.dev/docs/config/#transforms-example-minify-html-output 11ty Preprocessors
 *
 * @see {class} SyntaxProcessor - Main processor class
 * @see {function} registerBuiltIns - Built-in pattern registration
 * @see {file} src/eleventy/markdown.js - Markdown processing pipeline
 * @see {file} src/eleventy/ai.js - AI integration system
 */

import Logger from "../core/logger.js";

/**
 * Syntax Processor Class
 *
 * Manages registration and execution of layout syntax patterns.
 * Handlers execute in priority order (lower = first). Supports
 * inline (single-line) and block (multi-line with ::end) patterns.
 *
 * @class
 * @param {Object} site - Site configuration object
 * @param {Object} site.standard - Standard framework config
 * @param {boolean} site.standard.verbose - Enable verbose logging
 */
class SyntaxProcessor {
  constructor(site = {}) {
    this.options = site;
    this.handlers = new Map();
    this.logger = Logger({
      verbose: site.standard.verbose,
      scope: "Syntax",
    });
  }

  /**
   * Register a syntax pattern handler
   *
   * @param {string} name - Pattern name (used as ::name)
   * @param {Object|Function} options - Configuration or handler function
   * @param {string} options.type - Pattern type: 'inline', 'block', or 'both'
   * @param {number} options.priority - Execution order (lower = first, default: 100)
   * @param {Function} handler - Handler function receiving match object
   *
   * @example
   *   processor.add('highlight', { type: 'inline' }, (match) => {
   *     return `<mark>${match.value}</mark>`;
   *   });
   */
  add(name, options, handler) {
    if (typeof options === "function") {
      handler = options;
      options = {};
    }

    const defaultOptions = {
      type: "block", // 'inline', 'block', or 'both'
      priority: 100, // Lower processed first
    };

    this.handlers.set(name, {
      ...defaultOptions,
      ...options,
      handler,
    });
  }

  /**
   * Process content through all registered handlers
   *
   * @param {string} content - Raw markdown content
   * @param {Object} pageData - 11ty page data object
   * @returns {string} Processed content with layout directives expanded
   */
  process(content, pageData = {}) {
    const sorted = Array.from(this.handlers.entries()).sort(
      (a, b) => a[1].priority - b[1].priority,
    );

    for (const [name, config] of sorted) {
      const { type, handler } = config;

      if (type === "inline" || type === "both") {
        content = this.processInline(content, name, handler, pageData);
      }

      if (type === "block" || type === "both") {
        content = this.processBlock(content, name, handler, pageData);
      }
    }

    const unprocessed = this.findUnprocessedSyntax(content);
    unprocessed.forEach((pattern) => {
      this.logger.warn(`Unprocessed  - ::${pattern}`);
    });
    return content;
  }

  /**
   * Process inline patterns (single-line directives)
   * Matches: ::name value
   */
  processInline(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}\\s+([^\\n]+)`, "gm");

    return content.replace(regex, (fullMatch, value) => {
      try {
        return handler({
          type: "inline",
          name,
          value: String(value).trim(),
          args: String(value).trim(),
          raw: fullMatch,
          pageData,
        });
      } catch (error) {
        this.logger.error(`Error in ${name}:`, error);
        return fullMatch;
      }
    });
  }

  /**
   * Process block patterns (multi-line with ::end delimiter)
   * Matches: ::name args\ncontent\n::end
   */
  processBlock(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}([^\\n]*)\\n([\\s\\S]*?)^::end`, "gm");

    return content.replace(regex, (fullMatch, args, innerContent) => {
      try {
        return handler({
          type: "block",
          name,
          args: String(args || "").trim(),
          content: String(innerContent || "").trim(),
          raw: fullMatch,
          pageData,
        });
      } catch (error) {
        this.logger.error(`Error in ${name}:`, error);
        return fullMatch;
      }
    });
  }

  /**
   * Find unprocessed syntax patterns (for debugging)
   * Warns about directives that didn't match any handler
   */
  findUnprocessedSyntax(content) {
    const patterns = [];
    const regex = /^::([\w-]+)/gm;
    let match;

    while ((match = regex.exec(content)) !== null) {
      patterns.push(match[1]);
    }

    return [...new Set(patterns)];
  }

  /**
   * Parse key=value arguments from directive args string
   *
   * @param {string} argsString - Raw arguments (e.g., 'key1="value1" key2=value2')
   * @returns {Object} Parsed arguments object
   */
  parseArgs(argsString) {
    const args = {};
    const regex = /(\w+)=["']?([^"' \t]+)["']?/g;
    let match;

    while ((match = regex.exec(argsString)) !== null) {
      args[match[1]] = match[2];
    }

    return args;
  }

  /**
   * Split block content on delimiter (default: ---)
   * Used for multi-column and card layouts
   *
   * @param {string} content - Inner content to split
   * @param {string} delimiter - Split delimiter (default: '---')
   * @returns {string[]} Array of content chunks
   */
  splitContent(content, delimiter = "---") {
    return String(content || "")
      .split(new RegExp(`\\n${delimiter}\\n`))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Format seconds as MM:SS timestamp
   * Helper utility for media-related patterns
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

// ... rest of the implementation remains the same ...

/**
 * Register Built-In Syntax Patterns
 */
function registerBuiltIns(processor) {
  // Columns
  processor.add("columns", (match) => {
    const cols = match.args || 2;
    const html = `  <div class="columns-${cols}">\n\n${match.content}\n\n</div>\n`;
    return html;
  });

  // Split
  processor.add("split", (match) => {
    const sizes = (match.args || "")
      .split("/")
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n) && n > 0);
    const cols = processor.splitContent(match.content);

    let html = '<div class="grid">\n';
    cols.forEach((col, i) => {
      const span = sizes[i] || Math.max(1, Math.floor(12 / cols.length));
      html += `  <div class="sm:row col-${span}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Collection (dynamic via template)
  processor.add("collection", (match) => {
    const [collection, columns] = (match.args || "").split(/\s+/);
    const colCount = Math.max(1, parseInt(columns || "3", 10));
    const colSpan = Math.max(1, Math.floor(12 / colCount));
    const itemTemplate =
      match.content ||
      `
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
    `;

    return `
<div class="grid">
{% for item in ${collection} %}
  <div class="sm:row col-${colSpan}">
${itemTemplate}
  </div>
{% endfor %}
</div>`.trim();
  });

  // Grid (static content layout)
  processor.add("grid", (match) => {
    const items = processor.splitContent(match.content);
    const count = items.length; // Auto-detect!
    const colSpan = Math.max(1, Math.floor(12 / count));

    let html = `<div class="grid-${count}">\n`;
    items.forEach((item) => {
      html += `  <div class="sm:row">\n\n${item}\n\n</div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Containers
  processor.add(
    "small",
    (match) => `<div class="container-small">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add(
    "accent",
    (match) => `<div class="container-accent">\n\n${match.content}\n\n</div>\n`,
  );
  processor.add(
    "feature",
    (match) =>
      `<div class="container-feature">\n\n${match.content}\n\n</div>\n`,
  );

  // Hero
  processor.add("hero", (match) => {
    const align = (match.args || "").trim();
    const alignClass = align ? `text-${align}` : "";
    return `<div class="container-hero ${alignClass}">\n\n${match.content}\n\n</div>\n`;
  });

  processor.add("cards", (match) => {
    const cards = processor.splitContent(match.content);
    const count = cards.length; // Auto!
    const colSpan = Math.max(1, Math.floor(12 / count));

    let html = `<div class="grid-${count}">\n`;
    cards.forEach((card) => {
      html += `  <div class="sm:row card">
    \n\n${card}\n\n
  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Card + Cards
  processor.add(
    "card",
    (match) => `<div class="card">\n\n${match.content}\n\n</div>\n`,
  );

  // Image
  processor.add("image", (match) => {
    const variant = (match.args || "").trim();
    const lines = String(match.content || "").split("\n");
    const url = (lines[0] || "").trim();
    const caption = lines.slice(1).join("\n").trim();

    let html = `<figure class="image-${variant}">\n`;
    html += `  <img src="${url}" alt="${caption || ""}">\n`;
    if (caption) html += `  <figcaption>${caption}</figcaption>\n`;
    html += `</figure>\n`;
    return html;
  });

  // Gallery
  processor.add("gallery", (match) => {
    const images = processor.splitContent(match.content);
    const count = images.length; // Auto!
    const colSpan = Math.max(1, Math.floor(12 / count));

    let html = '<div class="gallery grid gap-4">\n';
    images.forEach((img) => {
      const url = String(img || "").trim();
      html += `  <div class="col-12 md:col-${colSpan}">\n`;
      html += `    <img src="${url}" alt="">\n`;
      html += `  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // Utilities
  processor.add("space", { type: "inline" }, (match) => {
    const sizeMap = { small: "2", medium: "4", large: "6", xlarge: "8" };
    const size = (match.value || "").trim();
    return `<div class="space-${sizeMap[size] || "4"}"></div>\n`;
  });

  processor.add(
    "center",
    (match) => `<div class="center">\n\n${match.content}\n\n</div>\n`,
  );
  // Obsidian-style callout system
  const DEFAULT_OBSIDIAN_ICONS = {
    abstract:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
    bug: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>',
    danger:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    example:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
    failure:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    question:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    quote:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
    success:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
    tip: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    todo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    warning:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  };

  // Aliases
  DEFAULT_OBSIDIAN_ICONS.attention = DEFAULT_OBSIDIAN_ICONS.warning;
  DEFAULT_OBSIDIAN_ICONS.caution = DEFAULT_OBSIDIAN_ICONS.warning;
  DEFAULT_OBSIDIAN_ICONS.check = DEFAULT_OBSIDIAN_ICONS.success;
  DEFAULT_OBSIDIAN_ICONS.cite = DEFAULT_OBSIDIAN_ICONS.quote;
  DEFAULT_OBSIDIAN_ICONS.done = DEFAULT_OBSIDIAN_ICONS.success;
  DEFAULT_OBSIDIAN_ICONS.error = DEFAULT_OBSIDIAN_ICONS.danger;
  DEFAULT_OBSIDIAN_ICONS.fail = DEFAULT_OBSIDIAN_ICONS.failure;
  DEFAULT_OBSIDIAN_ICONS.faq = DEFAULT_OBSIDIAN_ICONS.question;
  DEFAULT_OBSIDIAN_ICONS.help = DEFAULT_OBSIDIAN_ICONS.question;
  DEFAULT_OBSIDIAN_ICONS.hint = DEFAULT_OBSIDIAN_ICONS.tip;
  DEFAULT_OBSIDIAN_ICONS.important = DEFAULT_OBSIDIAN_ICONS.tip;
  DEFAULT_OBSIDIAN_ICONS.missing = DEFAULT_OBSIDIAN_ICONS.failure;
  DEFAULT_OBSIDIAN_ICONS.summary = DEFAULT_OBSIDIAN_ICONS.abstract;
  DEFAULT_OBSIDIAN_ICONS.tldr = DEFAULT_OBSIDIAN_ICONS.abstract;

  // Legacy inline handlers for backward compatibility

  processor.add(
    "muted",
    { type: "inline" },
    (match) => `<p class="muted">${match.value}</p>`,
  );

  processor.add(
    "subtle",
    { type: "inline" },
    (match) => `<p class="subtle">${match.value}</p>`,
  );

  processor.add(
    "note",
    { type: "inline" },
    (match) => `<aside class="note">${match.value}</aside>`,
  );

  processor.add(
    "error",
    { type: "inline" },
    (match) => `<div class="alert error">${match.value}</div>`,
  );

  processor.add(
    "alert",
    { type: "inline" },
    (match) => `<div class="alert">${match.value}</div>`,
  );

  processor.add(
    "warning",
    { type: "inline" },
    (match) => `<div class="alert warning">${match.value}</div>`,
  );

  processor.add(
    "success",
    { type: "inline" },
    (match) => `<div class="alert success">${match.value}</div>`,
  );

  // Block-style callout with ::end delimiter
  processor.add("callout", (match) => {
    const args = String(match.args || "").trim();
    const content = String(match.content || "");

    // Parse args to extract fold indicator and title
    const argsMatch = args.match(/^([+-])?\s*(.+)$/);
    if (!argsMatch) {
      return match.raw;
    }

    const [, fold, header] = argsMatch;
    const type = header.toLowerCase();
    const title = header.charAt(0).toUpperCase() + header.slice(1);
    const isCollapsible = fold === "+" || fold === "-";
    const isOpen = fold === "+";

    const calloutContent = content.trim();
    const icon = DEFAULT_OBSIDIAN_ICONS[type] || DEFAULT_OBSIDIAN_ICONS.note;

    if (isCollapsible) {
      return `<details class="callout" data-callout="${type}"${isOpen ? " open" : ""}>
<summary class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</summary>
<div class="callout-content">${calloutContent}</div>
</details>`;
    } else {
      return `<div class="callout" data-callout="${type}">
<div class="callout-title">
<div class="callout-title-icon">${icon}</div>
<div class="callout-title-inner">${title}</div>
</div>
<div class="callout-content">${calloutContent}</div>
</div>`;
    }
  });

  // Button
  processor.add("button", (match) => {
    const variant = (match.args || "").trim();
    const linkMatch = String(match.content || "").match(
      /\[([^\]]+)\]\(([^)]+)\)/,
    );
    if (linkMatch) {
      const [, text, url] = linkMatch;
      const classes = variant ? `button button-${variant}` : "button";
      return `<a href="${url}" class="${classes}">${text}</a>\n`;
    }
    return match.raw;
  });

  // Form
  processor.add("form", (match) => {
    const formType = (match.args || "").trim() || "contact";
    const fields = String(match.content || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    let html = `<form class="form form-${formType}" method="POST" action="/api/${formType}">\n`;
    fields.forEach((field) => {
      const fieldName = field.toLowerCase();
      const fieldType =
        fieldName === "email"
          ? "email"
          : fieldName === "message"
            ? "textarea"
            : "text";

      html += `  <div class="form-field">\n`;
      html += `    <label for="${fieldName}">${field}</label>\n`;
      if (fieldType === "textarea") {
        html += `    <textarea id="${fieldName}" name="${fieldName}" required></textarea>\n`;
      } else {
        html += `    <input type="${fieldType}" id="${fieldName}" name="${fieldName}" required>\n`;
      }
      html += `  </div>\n`;
    });
    html += `  <button type="submit" class="button button-primary">Send</button>\n`;
    html += `</form>\n`;
    return html;
  });

  // Stack-mobile
  processor.add("stack-mobile", (match) => {
    const cols = processor.splitContent(match.content);
    const colSpan = Math.max(1, Math.floor(12 / Math.max(1, cols.length)));

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";
    return html;
  });

  // If (conditional)
  processor.add("if", (match) => {
    const shouldShow = evaluateCondition(
      match.args || "",
      match.pageData || {},
    );
    return shouldShow ? `\n${match.content}\n` : "";
  });
}

/**
 * Evaluate simple conditions against pageData
 */
function evaluateCondition(condition, pageData) {
  const cond = String(condition || "").trim();
  if (!cond) return false;

  if (cond.startsWith("!")) {
    const key = cond.slice(1).trim();
    return !pageData[key];
  }
  if (cond.includes("==")) {
    const [key, value] = cond.split("==").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) === cleanValue;
  }
  if (cond.includes("!=")) {
    const [key, value] = cond.split("!=").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) !== cleanValue;
  }
  if (cond.includes(">")) {
    const [key, value] = cond.split(">").map((s) => s.trim());
    return Number(pageData[key]) > Number(value);
  }
  if (cond.includes("<")) {
    const [key, value] = cond.split("<").map((s) => s.trim());
    return Number(pageData[key]) < Number(value);
  }
  return !!pageData[cond];
}

/**
 * Syntax Plugin Export (default)
 */
export default function Syntax(eleventyConfig, site = {}) {
  const processor = new SyntaxProcessor(site);

  // Register built-in syntax
  registerBuiltIns(processor);

  // Expose processor for custom syntax
  eleventyConfig.Syntax = processor;

  // 1) Async AI inline preprocessor (must run BEFORE the sync Syntax preprocessor)
  //    Replaces lines like: ::ai say hello
  eleventyConfig.addPreprocessor(
    "ai-inline",
    "md",
    async function (data, content) {
      const file = this?.inputPath || data?.page?.inputPath || "(unknown)";
      let text = String(content || "");

      // Only proceed when ::ai is present (allow leading spaces)
      if (!/^\s*::ai\s+/m.test(text)) {
        return content;
      }

      const stdAI = eleventyConfig.stdAI;

      // If AI unavailable, annotate and return
      if (!stdAI || !stdAI.enabled) {
        return text.replace(
          /^\s*::ai[^\n]*$/gm,
          '<aside class="note">[AI disabled]</aside>',
        );
      }

      // Replace each ::ai ... with AI output
      const matches = [...text.matchAll(/^\s*::ai\s+(.+)$/gm)];
      if (matches.length === 0) return text;

      for (const m of matches) {
        const full = m[0];
        let value = (m[1] || "").trim();

        // Optional inline model override: ::ai model=MODEL prompt...
        const mm = value.match(/^model=([^\s]+)\s+(.*)$/);
        const opts = {};
        if (mm) {
          opts.model = mm[1];
          value = mm[2];
        }

        try {
          const result = await stdAI.call(value, opts);
          const replacement = (typeof result === "string" ? result : "") || "";
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(new RegExp(escaped, "g"), replacement);
        } catch (e) {
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(
            new RegExp(escaped, "g"),
            `<aside class="note">[AI Error: ${e?.message || "unknown"}]</aside>`,
          );
        }
      }

      return text;
    },
  );

  // 1b) Async AI block preprocessor (must run BEFORE the sync Syntax preprocessor)
  //     Matches:
  //       ::ai
  //       ...content...
  //       ::end
  //     Or with args:
  //       ::ai model=MODEL
  //       ...content...
  //       ::end
  eleventyConfig.addPreprocessor(
    "ai-block",
    "md",
    async function (data, content) {
      const file = this?.inputPath || data?.page?.inputPath || "(unknown)";
      let text = String(content || "");

      // Quick check to avoid needless work
      if (!/^\s*::ai(?:\s|$)/m.test(text)) {
        return content;
      }

      const stdAI = eleventyConfig.stdAI;

      // If AI unavailable, annotate and return
      if (!stdAI || !stdAI.enabled) {
        return text.replace(
          // Block form
          /^\s*::ai[^\n]*\n([\s\S]*?)^\s*::end/gm,
          '<aside class="warning">[AI disabled]</aside>',
        );
      }

      // Regex for block: leading spaces allowed
      // Captures optional args on the first line and the inner content
      const blockRe = /^\s*::ai([^\n]*)\n([\s\S]*?)^\s*::end/gm;

      // Resolve blocks sequentially (safe and deterministic)
      let match;
      while ((match = blockRe.exec(text)) !== null) {
        const full = match[0]; // entire block
        const rawArgs = (match[1] || "").trim();
        const inner = (match[2] || "").trim();

        // Parse simple key=value args (e.g., model=MODEL)
        const args = {};
        rawArgs.replace(/(\w+)=["']?([^"' \t]+)["']?/g, (_, k, v) => {
          args[k] = v;
          return "";
        });

        const opts = {};
        if (args.model) opts.model = args.model;

        const prompt = inner || rawArgs || "Say hello";

        try {
          const result = await stdAI.call(prompt, opts);
          const replacement = (typeof result === "string" ? result : "") || "";
          // Replace exactly this block instance
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(new RegExp(escaped, "g"), replacement);
        } catch (e) {
          const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(
            new RegExp(escaped, "g"),
            `<aside class="error">[AI Error: ${e?.message || "unknown"}]</aside>`,
          );
        }
      }

      return text;
    },
  );

  // 2) Synchronous preprocessor for layout directives (runs AFTER ai-inline)
  eleventyConfig.addPreprocessor("syntax", "md", (data, content) => {
    return processor.process(content, data);
  });
  processor.logger.success();
  return processor;
}

/**
 * Optional class export for advanced usage
 */
export { SyntaxProcessor };
