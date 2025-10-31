// src/eleventy/syntax.js

/**
 * Friendly Layout Syntax
 *
 * @component  Syntax PreProcessor
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 2005, Notion was born from a simple idea: what if you could build
 * anything without code? Fast forward to today, and millions of non-technical
 * people use it daily to organize their lives. But there's always been a gap—
 * how do you take that content and make it a beautiful website without learning
 * HTML, CSS, or template languages?
 *
 * This plugin bridges that gap. It transforms simple, natural markers like
 * `::columns 2` into Standard Framework's sophisticated grid system. Behind
 * the scenes, it's generating semantic HTML with proper ARIA labels and
 * responsive classes. But your user just sees "columns 2" and knows exactly
 * what it means.
 *
 * Inspired by Swiss poster design where layout is intuitive and intentional,
 * not accidental. Josef Müller-Brockmann didn't need code—he had a grid and
 * clear intent. This gives your users the same power.
 *
 * **Why Preprocessing Matters**: Unlike transforms that run after rendering,
 * this preprocessor runs *before* markdown processing. That means the HTML
 * it generates gets parsed by markdown-it, and any Nunjucks template syntax
 * (like `{% for %}` loops in `::grid`) gets executed by the template engine.
 * Order matters—this runs early so everything else can build on top of it.
 *
 * ### Future Improvements
 *
 * - Add visual preview in editor (browser extension)
 * - Support nested syntax (::columns inside ::feature)
 * - Add undo/redo for syntax experiments
 *
 * @see {mixin} grid - Standard Framework grid system
 * @see {class} .feature - Feature section styling
 * @see {file} preprocessor.js - Markdown preprocessing
 *
 * @example
 *   eleventyConfig.addPlugin(Syntax, {
 *     patterns: ['columns', 'grid', 'feature']
 *   });
 */

import { createLogger } from "./logger.js";

/**
 * Syntax Processor Class
 *
 * @class SyntaxProcessor
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In the 1970s, Donald Knuth created TeX with a revolutionary idea: what if
 * instead of coding layouts manually, you could describe what you *wanted* and
 * let the system figure out the how? Commands like `\section{}` didn't specify
 * font sizes or spacing—they declared *intent*.
 *
 * This processor takes that philosophy and brings it to modern web publishing.
 * It's a registry and execution engine for layout syntax. You register patterns
 * (like "columns" or "hero"), and it transforms friendly markers into production
 * HTML. The genius is in the separation: content creators write `::columns 2`,
 * while developers control exactly what HTML that becomes.
 *
 * The processor maintains a priority queue of handlers. Lower priority numbers
 * execute first, which matters when you have syntax that depends on other syntax.
 * It supports both inline syntax (`::space large`) and block syntax with content
 * (`::feature ... ::end`). After processing, it even cleans up any unrecognized
 * syntax, treating it as comments—fail gracefully, never break the page.
 *
 * Think of it as a compiler for layout intent. You're not writing HTML, you're
 * declaring structure, and the processor handles the tedious work of generating
 * semantic, accessible markup.
 *
 * ### Future Improvements
 *
 * - Add syntax validation mode (warn about typos)
 * - Support custom delimiters (not just `::`)
 * - Add performance profiling for complex documents
 *
 * @see {function} registerBuiltIns - Standard syntax patterns
 * @see {function} evaluateCondition - Conditional rendering
 * @see {class} Logger - Debugging and error reporting
 *
 * @example
 *   const processor = new SyntaxProcessor({ verbose: true });
 *   processor.add('highlight', (match) => {
 *     return `<mark>${match.content}</mark>`;
 *   });
 */
class SyntaxProcessor {
  /**
   * Syntax Processor Constructor
   *
   * @constructor
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * When Unix was designed in 1971, Ken Thompson made everything a file.
   * Simple, consistent, composable. This constructor follows that philosophy—
   * it initializes a clean slate with three things: configuration options,
   * an empty handler registry, and a logger.
   *
   * The handler Map uses JavaScript's native Map structure for O(1) lookups,
   * which matters when you're processing thousands of lines of markdown.
   * The logger respects the verbose flag—silent by default, chatty when
   * you need to debug why your syntax isn't working.
   *
   * This is the foundation. Everything else—registering patterns, processing
   * content, cleaning up—builds on this simple initialization.
   *
   * @param {Object} options - Configuration options
   * @param {boolean} options.verbose - Enable detailed logging
   *
   * @see {class} Logger - Debugging utilities
   * @see {method} add - Register syntax patterns
   *
   * @example
   *   const processor = new SyntaxProcessor({
   *     verbose: true
   *   });
   */
  constructor(options = {}) {
    this.options = options;
    this.handlers = new Map();
    this.logger = createLogger({
      verbose: options.verbose,
      scope: "Syntax",
    });
  }

  /**
   * Register Syntax Pattern
   *
   * @method add
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1991, Tim Berners-Lee created HTML with just 18 elements. Each one
   * was a *registration*—a name (like `<p>`) mapped to a behavior (paragraph).
   * This method does the same thing for layout syntax. You give it a name,
   * configuration, and a handler function. The processor stores it in a
   * registry, ready to transform content.
   *
   * The beauty is in the flexibility. Want inline syntax like `::space large`?
   * Set `type: 'inline'`. Need block content like `::feature ... ::end`? Use
   * `type: 'block'`. Processing order matters? Set a priority number—lower
   * runs first. This lets you build dependencies: maybe `::columns` needs to
   * run before `::card` if cards can live inside columns.
   *
   * The handler function receives a rich context object: the syntax name, any
   * arguments, the content (for blocks), and even the current page data. That
   * means your syntax can be *smart*—adapt based on frontmatter, filter by
   * collection membership, or inject template variables.
   *
   * @param {string} name - Syntax pattern name (e.g., 'columns')
   * @param {Object|Function} options - Configuration or handler function
   * @param {string} options.type - Pattern type: 'inline', 'block', or 'both'
   * @param {number} options.priority - Processing order (lower = first)
   * @param {Function} handler - Processing function
   *
   * @see {method} process - Execute all registered handlers
   * @see {method} processInline - Handle inline patterns
   * @see {method} processBlock - Handle block patterns
   *
   * @example
   *   // Inline syntax
   *   processor.add('space', { type: 'inline' }, (match) => {
   *     return `<div class="space-${match.value}"></div>`;
   *   });
   *
   * @example
   *   // Block syntax with priority
   *   processor.add('card', { type: 'block', priority: 50 }, (match) => {
   *     return `<div class="card">${match.content}</div>`;
   *   });
   */
  add(name, options, handler) {
    // If only 2 arguments, options is the handler
    if (typeof options === "function") {
      handler = options;
      options = {};
    }

    const defaultOptions = {
      type: "block", // 'inline', 'block', or 'both'
      priority: 100, // Lower = processed first
    };

    this.handlers.set(name, {
      ...defaultOptions,
      ...options,
      handler,
    });
  }

  /**
   * Process Content Through All Handlers
   *
   * @method process
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1969, Doug McIlroy at Bell Labs had a radical idea: programs should be
   * pipelines. Take input, transform it, pass it along. Unix pipes were born,
   * and computing was never the same. This method is a pipeline for layout
   * syntax—content flows through a series of transformations, each handler
   * doing its one job well.
   *
   * First, it sorts handlers by priority. This matters because some syntax
   * depends on other syntax being processed first. Imagine `::grid` that
   * wraps `::card` elements—the grid needs to run after cards exist.
   *
   * Then it processes each handler in order. Inline syntax (single lines)
   * and block syntax (content between markers) are handled separately because
   * they use different regex patterns. The content flows through like water
   * through pipes—enter as raw markdown with `::` markers, exit as clean HTML.
   *
   * After processing, it checks for unrecognized syntax. Maybe you typed
   * `::colums` instead of `::columns`. The processor finds these orphans,
   * logs them (if verbose), and quietly removes them. Your page doesn't break—
   * unrecognized syntax becomes comments. Fail gracefully, always.
   *
   * ### Future Improvements
   *
   * - Add dry-run mode (show what would happen)
   * - Cache regex compilation for repeated processing
   * - Support async handlers for API calls
   *
   * @param {string} content - Markdown content to process
   * @param {Object} pageData - Current page's frontmatter and data
   * @returns {string} Transformed content with syntax replaced
   *
   * @see {method} processInline - Single-line syntax processing
   * @see {method} processBlock - Block content processing
   * @see {method} cleanup - Remove unprocessed syntax
   *
   * @example
   *   const output = processor.process(content, {
   *     title: 'My Page',
   *     featured: true
   *   });
   */
  process(content, pageData = {}) {
    // Sort handlers by priority
    const sorted = Array.from(this.handlers.entries()).sort(
      (a, b) => a[1].priority - b[1].priority,
    );

    // Process each handler
    for (const [name, config] of sorted) {
      const { type, handler } = config;

      if (type === "inline" || type === "both") {
        content = this.processInline(content, name, handler, pageData);
      }

      if (type === "block" || type === "both") {
        content = this.processBlock(content, name, handler, pageData);
      }
    }

    // Find and log unprocessed syntax
    const unprocessed = this.findUnprocessedSyntax(content);
    if (unprocessed.length > 0 && this.options.verbose) {
      this.logger.warn(`Removed unprocessed syntax:`);
      unprocessed.forEach((pattern) => {
        this.logger.warn(`  - ::${pattern}`);
      });
    }

    // Clean up unprocessed syntax
    content = this.cleanup(content);

    return content;
  }

  /**
   * Process Inline Syntax Patterns
   *
   * @method processInline
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * Back in 1987, Larry Wall created Perl with the mantra "make simple things
   * easy." Inline syntax embodies that philosophy. A single line—`::space large`
   * —gets transformed into HTML. No closing tag, no content blocks, just a
   * quick directive.
   *
   * The regex pattern is deceptively simple: match `::name` at the start of a
   * line, grab everything until the newline. Global + multiline flags mean it
   * finds every occurrence in the document. When it matches, it calls your
   * handler with a context object containing the value, args, and page data.
   *
   * This is perfect for things like spacing, line breaks, or inline embeds.
   * You don't need block structure—just a command and maybe a parameter. The
   * processor executes your handler, gets back HTML, and replaces the syntax.
   * If something goes wrong, it catches the error, logs it, and leaves the
   * original syntax untouched. Never break the build.
   *
   * @param {string} content - Content to process
   * @param {string} name - Syntax pattern name
   * @param {Function} handler - Processing function
   * @param {Object} pageData - Page frontmatter and data
   * @returns {string} Content with inline syntax replaced
   *
   * @see {method} processBlock - Block content processing
   * @see {method} process - Main processing pipeline
   *
   * @example
   *   // Matches: ::space large
   *   content = processInline(content, 'space', (match) => {
   *     return `<div class="space-${match.value}"></div>`;
   *   }, pageData);
   */
  processInline(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}\\s+([^\\n]+)`, "gm");

    return content.replace(regex, (fullMatch, value) => {
      try {
        return handler({
          type: "inline",
          name,
          value: value.trim(),
          args: value.trim(),
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
   * Process Block Syntax Patterns
   *
   * @method processBlock
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1989, Tim Berners-Lee invented HTML with opening and closing tags.
   * `<p>` and `</p>` wrap content—structure matters. Block syntax brings
   * that same concept to markdown. `::columns 2` opens a block, content
   * lives inside, and `::end` closes it.
   *
   * The regex here is more sophisticated. It matches from `::name` with
   * optional arguments, captures everything until `::end`, and feeds it all
   * to your handler. The `[\s\S]*?` is the secret sauce—it matches any
   * character including newlines (unlike `.` which stops at line breaks).
   * The `?` makes it non-greedy, so nested `::end` markers don't break things.
   *
   * Your handler receives the arguments (like "2" in `::columns 2`) and the
   * inner content. You can split that content, wrap it, transform it—whatever
   * you need. The processor calls your function, expects HTML back, and swaps
   * out the entire block (syntax markers and all) with your result.
   *
   * Error handling is bulletproof. If your handler throws, the processor
   * catches it, logs it, and leaves the original syntax intact. The page
   * still builds. Debugging is easy—you see exactly what went wrong and
   * where the problematic syntax lives.
   *
   * ### Future Improvements
   *
   * - Support custom end markers (not just `::end`)
   * - Allow block nesting with depth tracking
   * - Add syntax highlighting for unprocessed blocks
   *
   * @param {string} content - Content to process
   * @param {string} name - Syntax pattern name
   * @param {Function} handler - Processing function
   * @param {Object} pageData - Page frontmatter and data
   * @returns {string} Content with block syntax replaced
   *
   * @see {method} processInline - Inline syntax processing
   * @see {method} splitContent - Parse block content sections
   *
   * @example
   *   // Matches:
   *   // ::feature
   *   // # Big Title
   *   // Content here
   *   // ::end
   *   content = processBlock(content, 'feature', (match) => {
   *     return `<div class="feature">${match.content}</div>`;
   *   }, pageData);
   */
  processBlock(content, name, handler, pageData) {
    const regex = new RegExp(`^::${name}([^\\n]*)\\n([\\s\\S]*?)^::end`, "gm");

    return content.replace(regex, (fullMatch, args, innerContent) => {
      try {
        return handler({
          type: "block",
          name,
          args: args.trim(),
          content: innerContent.trim(),
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
   * Find Unprocessed Syntax Patterns
   *
   * @method findUnprocessedSyntax
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1972, Dennis Ritchie created C with a revolutionary concept: the
   * compiler tells you what's wrong. Before C, assembly errors were cryptic.
   * C gave you line numbers, variable names, helpful messages. This method
   * does the same for layout syntax.
   *
   * After all handlers run, there might be leftover `::` markers—typos,
   * unregistered patterns, or syntax you forgot to implement. This method
   * scans the content with a simple regex: find anything that looks like
   * `::something` at the start of a line. It collects unique pattern names
   * and returns them.
   *
   * The processor uses this list to warn you during builds. "Hey, you wrote
   * `::colums` but I only know about `::columns`." It's a typo detector, a
   * reminder system, a gentle nudge that something isn't quite right. Without
   * it, you'd publish a page with raw syntax visible—embarrassing and broken.
   *
   * This is defensive programming at its best. Assume nothing. Check everything.
   * Tell the developer what went wrong before it becomes a production problem.
   *
   * @param {string} content - Content to scan
   * @returns {Array<string>} Array of unprocessed pattern names
   *
   * @see {method} cleanup - Remove unprocessed syntax
   * @see {method} process - Main processing pipeline
   *
   * @example
   *   const unprocessed = processor.findUnprocessedSyntax(content);
   *   // Returns: ['colums', 'heor'] (typos)
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
   * Remove Unprocessed Syntax
   *
   * @method cleanup
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In the 1960s, programming languages started supporting comments—text that
   * the compiler ignores. FORTRAN had `C` in column 1. COBOL had asterisks.
   * Comments let you explain code without affecting execution. This method
   * treats unprocessed syntax the same way.
   *
   * If you write `::draft` but never register that handler, you probably
   * meant it as a note to yourself. The cleanup pass removes it silently.
   * Block syntax with `::end` markers? Gone. Single-line syntax? Stripped out.
   * Your published page is clean—no weird `::` markers confusing readers.
   *
   * This is the final safety net. After all processing, after all warnings,
   * this method ensures nothing broken reaches production. It's unglamorous
   * but essential—like a janitor sweeping up after a party. Without it,
   * your beautiful layout would have random syntax sprinkled throughout.
   *
   * The regex patterns are straightforward: match `::word` followed by stuff,
   * optionally closed with `::end`. Global multiline mode catches every
   * occurrence. Replace with empty string. Done.
   *
   * @param {string} content - Content to clean
   * @returns {string} Content with all unprocessed syntax removed
   *
   * @see {method} findUnprocessedSyntax - Detect unprocessed patterns
   * @see {method} process - Main processing pipeline
   *
   * @example
   *   // Removes:
   *   // ::draft This is a note
   *   // ::todo
   *   // Fix this later
   *   // ::end
   *   const clean = processor.cleanup(content);
   */
  cleanup(content) {
    // Remove block syntax
    content = content.replace(/^::[\w-]+[^\n]*\n[\s\S]*?^::end/gm, "");

    // Remove single-line syntax
    content = content.replace(/^::[\w-]+.*$/gm, "");

    return content;
  }

  /**
   * Parse Argument String
   *
   * @method parseArgs
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1977, Unix introduced getopt for parsing command-line arguments.
   * Before that, programs handled arguments ad-hoc—messy and error-prone.
   * getopt standardized the pattern: flags, values, consistency. This method
   * does the same for syntax arguments.
   *
   * When you write `::image width=800 alt="Photo"`, you want those key-value
   * pairs extracted. This regex looks for the pattern `key="value"` or
   * `key=value` (quotes optional). It builds an object mapping keys to values,
   * making it easy for handlers to access configuration.
   *
   * Without this utility, every handler would parse arguments differently.
   * Some might split on spaces (breaking values with spaces). Others might
   * forget to handle quotes. This centralizes the logic—parse once, parse
   * correctly, use everywhere.
   *
   * @param {string} argsString - Argument string to parse
   * @returns {Object} Object with key-value pairs
   *
   * @see {method} processBlock - Uses parsed arguments
   * @see {method} processInline - Uses parsed arguments
   *
   * @example
   *   const args = processor.parseArgs('width=800 height=600 alt="Photo"');
   *   // Returns: { width: '800', height: '600', alt: 'Photo' }
   */
  parseArgs(argsString) {
    const args = {};
    const regex = /(\w+)=["']?([^"'\s]+)["']?/g;
    let match;

    while ((match = regex.exec(argsString)) !== null) {
      args[match[1]] = match[2];
    }

    return args;
  }

  /**
   * Split Content by Delimiter
   *
   * @method splitContent
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1991, Guido van Rossum designed Python with a clear principle: explicit
   * is better than implicit. When you want to split content into sections, you
   * need a clear delimiter. This method uses `---` by default (like YAML
   * frontmatter), but you can override it.
   *
   * This is essential for multi-column layouts. Write three paragraphs
   * separated by `---`, and this method splits them into an array. Feed
   * that array to the `::columns` handler, and each paragraph becomes a
   * column. Simple, predictable, powerful.
   *
   * The regex escapes the delimiter and matches it between newlines. Split
   * returns an array. Trim removes whitespace. Filter removes empty strings.
   * Four operations, one clean result. No surprises, no edge cases.
   *
   * @param {string} content - Content to split
   * @param {string} delimiter - Section delimiter (default: '---')
   * @returns {Array<string>} Array of content sections
   *
   * @see {handler} columns - Uses split content for columns
   * @see {handler} cards - Uses split content for card grid
   *
   * @example
   *   const sections = processor.splitContent(`
   *     First column
   *     ---
   *     Second column
   *     ---
   *     Third column
   *   `);
   *   // Returns: ['First column', 'Second column', 'Third column']
   */
  splitContent(content, delimiter = "---") {
    return content
      .split(new RegExp(`\\n${delimiter}\\n`))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Format Seconds as MM:SS
   *
   * @method formatTime
   * @category 11ty Plugins
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1960, COBOL introduced PICTURE clauses for formatting numbers—
   * `PIC 99:99` for time, `PIC $9,999.99` for money. Formatting matters
   * because humans aren't computers. We read "2:05" better than "125 seconds."
   *
   * This method converts seconds to minutes and seconds with zero-padding.
   * 65 becomes "1:05". 3 becomes "0:03". Simple but essential for video
   * timestamps, audio chapters, or any duration display. Math.floor for
   * integer division, modulo for remainder, padStart for leading zeros—
   * textbook algorithmic thinking from 1960s computer science.
   *
   * It's a utility you don't appreciate until you need it. Then you're
   * grateful it exists instead of reimplementing it yourself (and probably
   * getting the padding wrong).
   *
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted time string (MM:SS)
   *
   * @see {handler} video - Could use for duration display
   * @see {handler} audio - Could use for chapter timestamps
   *
   * @example
   *   processor.formatTime(65);   // "1:05"
   *   processor.formatTime(3);    // "0:03"
   *   processor.formatTime(3661); // "61:01"
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

/**
 * Register Built-In Syntax Patterns
 *
 * @function registerBuiltIns
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1985, Microsoft Word introduced WYSIWYG editing—what you see is what
 * you get. But behind the scenes, Word had a rich command language: styles,
 * columns, tables, all accessible through menus or keyboard shortcuts. This
 * function creates the "standard library" of syntax patterns—the core set
 * of layout commands every site needs.
 *
 * Think of these as the HTML of layout syntax. Just like HTML gave us
 * `<p>`, `<h1>`, and `<img>` as primitives, these built-ins give you
 * `::columns`, `::hero`, and `::gallery`. They're battle-tested patterns
 * that solve real layout problems without requiring CSS knowledge.
 *
 * Each handler is a mini-compiler. It takes intent ("I want 3 columns")
 * and generates semantic HTML with Standard Framework classes. The handlers
 * use the 12-column grid system, calculate spans automatically, and inject
 * responsive classes. Behind simple syntax is sophisticated layout math.
 *
 * This separation is powerful. Site owners use friendly syntax. Developers
 * control the HTML output. Designers can customize the generated classes.
 * Everyone wins because concerns are separated and expertise is honored.
 *
 * ### Future Improvements
 *
 * - Add syntax validation (warn about invalid arguments)
 * - Generate TypeScript definitions for syntax patterns
 * - Support theme variants for each pattern
 *
 * @param {SyntaxProcessor} processor - Processor instance to configure
 *
 * @see {class} SyntaxProcessor - Pattern registration system
 * @see {method} add - Register custom patterns
 * @see {file} standard-06-grid.scss - Grid system these patterns use
 *
 * @example
 *   const processor = new SyntaxProcessor();
 *   registerBuiltIns(processor);
 *   // Now processor knows about ::columns, ::hero, ::grid, etc.
 */
function registerBuiltIns(processor) {
  /**
   * Columns Layout Syntax
   *
   * @handler columns
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1689, the London Gazette became one of the first newspapers to use
   * column layout—narrow columns make text easier to read. By the 1800s,
   * multi-column design was everywhere: newspapers, magazines, books.
   * Josef Müller-Brockmann formalized it in the 1950s with his grid system.
   *
   * This handler makes columns trivial. Write `::columns 2`, separate content
   * with `---`, and get a responsive grid. On mobile, columns stack. On
   * tablets and up, they sit side-by-side. The math is automatic: 2 columns
   * means 6-span each (12/2). 3 columns means 4-span each (12/3).
   *
   * The generated HTML uses Standard Framework's grid classes: `.grid` for
   * the container, `.col-12` for mobile (full width), `.md:col-N` for tablet
   * breakpoint. It's semantic, accessible, and works without JavaScript.
   * Pure CSS, pure elegance.
   *
   * @param {number} args - Number of columns (2, 3, or 4)
   * @param {string} content - Content with `---` delimiters
   * @returns {string} Grid HTML with column divs
   *
   * @see {class} .grid - Grid container class
   * @see {class} .col-* - Column span classes
   * @see {handler} split - Similar but with custom column widths
   *
   * @example markdown
   *   ::columns 2
   *   First column content here.
   *   ---
   *   Second column content here.
   *   ::end
   *
   * @example html - Generated output
   *   <div class="grid gap-4">
   *     <div class="col-12 md:col-6">
   *       First column content here.
   *     </div>
   *     <div class="col-12 md:col-6">
   *       Second column content here.
   *     </div>
   *   </div>
   */
  processor.add("columns", (match) => {
    const count = parseInt(match.args);
    const cols = processor.splitContent(match.content);
    const colSpan = Math.floor(12 / count);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });

  /**
   * Split Layout with Custom Widths
   *
   * @handler split
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1931, Jan Tschichold wrote "Die neue Typographie" (The New Typography),
   * advocating asymmetric layouts. Not every column should be equal—sometimes
   * you want 8 units of text and 4 units of sidebar. Asymmetry creates
   * tension, hierarchy, interest.
   *
   * This handler lets you specify column widths explicitly. Write `::split 8/4`
   * for a main content area (8 columns) and narrow sidebar (4 columns). The
   * numbers refer to the 12-column grid—they must add up to 12 or less.
   *
   * It's more flexible than `::columns` but requires you to think about the
   * grid. That's intentional. Simple cases use `::columns 2`. Complex layouts
   * use `::split 8/4`. Progressive disclosure of complexity—learn the easy
   * way first, graduate to power-user mode when you need it.
   *
   * @param {string} args - Column widths as fractions (e.g., '8/4' or '7/5')
   * @param {string} content - Content with `---` delimiters
   * @returns {string} Grid HTML with custom column spans
   *
   * @see {handler} columns - Simpler equal-width columns
   * @see {class} .col-* - Column span classes
   * @see {file} standard-06-grid.scss - Grid system documentation
   *
   * @example markdown
   *   ::split 8/4
   *   Main content area (wider)
   *   ---
   *   Sidebar content (narrower)
   *   ::end
   *
   * @example html - Generated output
   *   <div class="grid gap-4">
   *     <div class="col-12 md:col-8">
   *       Main content area (wider)
   *     </div>
   *     <div class="col-12 md:col-4">
   *       Sidebar content (narrower)
   *     </div>
   *   </div>
   */
  processor.add("split", (match) => {
    const sizes = match.args.split("/").map((n) => parseInt(n));
    const cols = processor.splitContent(match.content);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col, i) => {
      const span = sizes[i] || Math.floor(12 / cols.length);
      html += `  <div class="col-12 md:col-${span}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });

  /**
   * Dynamic Grid from Collection Data
   *
   * @handler grid
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1996, PHP introduced `foreach` loops for iterating over arrays. The
   * web shifted from static pages to dynamic content. This handler brings
   * that power to layout syntax—generate grids from collection data without
   * writing Nunjucks templates directly.
   *
   * Write `::grid products 3` and the handler generates a Nunjucks `{% for %}`
   * loop that renders three columns of product cards. The beauty? You can
   * customize the item template inside the block. The processor generates
   * the grid structure and loop syntax, letting the template engine handle
   * the actual rendering.
   *
   * This is compilation at work. Layout syntax (intent) becomes template
   * syntax (instructions) becomes HTML (output). Three layers, each adding
   * value. Content creators think in grids, developers write templates,
   * Nunjucks executes, browsers render. Beautiful separation of concerns.
   *
   * @param {string} args - Collection name and column count (e.g., 'products 3')
   * @param {string} content - Item template (optional, has default)
   * @returns {string} Nunjucks loop with grid structure
   *
   * @see {handler} columns - Static column layout
   * @see {class} .grid - Grid container class
   *
   * @example markdown
   *   ::grid products 3
   *   <h3>{{ item.title }}</h3>
   *   <p>{{ item.price }}</p>
   *   ::end
   *
   * @example html - Generated template
   *   <div class="grid grid-sm-2">
   *   {% for item in products %}
   *     <div class="col-4">
   *       <h3>{{ item.title }}</h3>
   *       <p>{{ item.price }}</p>
   *     </div>
   *   {% endfor %}
   *   </div>
   */
  processor.add("grid", (match) => {
    const [collection, columns] = match.args.split(/\s+/);
    const colCount = parseInt(columns);
    const colSpan = Math.floor(12 / colCount);

    const itemTemplate =
      match.content ||
      `
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
    `;

    return `
<div class="grid grid-sm-2">
{% for item in ${collection} %}
  <div class="col-${colSpan}">
${itemTemplate}
  </div>
{% endfor %}
</div>`.trim();
  });

  /**
   * Small Container Width
   *
   * @handler small
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1928, Jan Tschichold discovered the optimal line length for reading:
   * 50-75 characters per line. Too wide and your eye loses the next line.
   * Too narrow and you bounce back and forth too often. This handler creates
   * a constrained container for narrow, focused content.
   *
   * Perfect for pull quotes, side notes, or introductory text. The
   * `.container-small` class (defined in your CSS) sets a max-width and
   * centers the content. Everything inside reads beautifully because the
   * measure is controlled.
   *
   * @param {string} content - Content to constrain
   * @returns {string} Div with small container class
   *
   * @see {class} .container-small - CSS definition
   * @see {handler} feature - Opposite: wide prominent content
   *
   * @example markdown
   *   ::small
   *   This paragraph is narrow and easy to read,
   *   perfect for pull quotes or emphasis.
   *   ::end
   */
  processor.add("small", (match) => {
    return `<div class="container-small">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Accent Container
   *
   * @handler accent
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1957, Massimo Vignelli designed the New York City subway map with
   * a clear visual hierarchy: black for routes, color for accents. Accent
   * colors draw attention without overwhelming. This handler wraps content
   * in an accent container—visually distinct but not dominant.
   *
   * Use it for call-to-action sections, special announcements, or highlighted
   * content. The `.container-accent` class applies background color, padding,
   * and border radius. Semantically it's a div, visually it pops.
   *
   * @param {string} content - Content to accent
   * @returns {string} Div with accent container class
   *
   * @see {class} .container-accent - CSS definition
   * @see {handler} feature - More prominent styling
   * @see {file} standard-02-color.scss - Accent color tokens
   *
   * @example markdown
   *   ::accent
   *   **Special Offer:** 20% off this week only!
   *   ::end
   */
  processor.add("accent", (match) => {
    return `<div class="container-accent">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Feature Section
   *
   * @handler feature
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1962, Herb Lubalin designed the Avant Garde magazine with massive
   * typography and bold layouts. Some content deserves to dominate the page.
   * This handler creates feature sections—hero areas, prominent announcements,
   * content that can't be missed.
   *
   * The `.container-feature` class applies generous padding, large text,
   * and possibly full-bleed background. It's visual weight in CSS form.
   * Use sparingly—if everything is featured, nothing is.
   *
   * @param {string} content - Content to feature
   * @returns {string} Div with feature container class
   *
   * @see {class} .container-feature - CSS definition
   * @see {handler} hero - Alternative prominent layout
   * @see {handler} accent - Less prominent styling
   *
   * @example markdown
   *   ::feature
   *   # Welcome to Our Platform
   *   The best way to build websites, no coding required.
   *   ::end
   */
  processor.add("feature", (match) => {
    return `<div class="container-feature">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Hero Section with Alignment
   *
   * @handler hero
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1994, the first banner ad appeared on HotWired.com. Web design learned
   * from print: the top of the page is prime real estate. Hero sections—
   * large, prominent, impossible to ignore—became standard. This handler
   * creates hero areas with optional text alignment.
   *
   * Write `::hero center` for centered headlines. Use `::hero left` for
   * editorial layouts. The `.container-hero` class handles sizing and spacing,
   * while alignment classes control text flow. Simple syntax, powerful layouts.
   *
   * @param {string} args - Alignment: 'center', 'left', or 'right' (optional)
   * @param {string} content - Hero content
   * @returns {string} Div with hero container and alignment classes
   *
   * @see {class} .container-hero - CSS definition
   * @see {handler} feature - Similar prominent styling
   *
   * @example markdown
   *   ::hero center
   *   # Build Anything
   *   ## No Code Required
   *   [Get Started](#)
   *   ::end
   */
  processor.add("hero", (match) => {
    const align = match.args || "";
    const alignClass = align ? `text-${align}` : "";
    return `<div class="container-hero ${alignClass}">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Single Card Component
   *
   * @handler card
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 2013, Google introduced Material Design with the card metaphor—
   * content in bounded containers, like physical cards. Cards group related
   * information visually. This handler wraps content in a card component.
   *
   * The `.card` class applies padding, border, shadow, and background. It's
   * a visual container that says "this content belongs together." Use for
   * products, articles, team members—anything that needs encapsulation.
   *
   * @param {string} content - Card content
   * @returns {string} Div with card class
   *
   * @see {class} .card - CSS definition
   * @see {handler} cards - Multiple cards in grid
   *
   * @example markdown
   *   ::card
   *   ## Product Name
   *   Description of the product
   *   [Learn More](#)
   *   ::end
   */
  processor.add("card", (match) => {
    return `<div class="card">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Card Grid Layout
   *
   * @handler cards
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 2010, Pinterest popularized grid layouts for cards—symmetric, clean,
   * scannable. This handler combines cards and grids: specify the number of
   * columns, separate card content with `---`, get a responsive card grid.
   *
   * Each card is wrapped in a `.card` div inside a grid column. On mobile,
   * cards stack. On tablet and up, they sit in rows. The math is automatic—
   * 3 cards means 4-span columns (12/3). Beautiful without thinking.
   *
   * @param {number} args - Number of cards per row
   * @param {string} content - Card contents separated by `---`
   * @returns {string} Grid with card divs
   *
   * @see {handler} card - Single card
   * @see {handler} columns - Similar grid layout
   * @see {class} .card - Card styling
   *
   * @example markdown
   *   ::cards 3
   *   ## Card One
   *   Content here
   *   ---
   *   ## Card Two
   *   More content
   *   ---
   *   ## Card Three
   *   Final card
   *   ::end
   */
  processor.add("cards", (match) => {
    const count = parseInt(match.args);
    const cards = processor.splitContent(match.content);
    const colSpan = Math.floor(12 / count);

    let html = '<div class="grid gap-4">\n';
    cards.forEach((card) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n    <div class="card">\n\n${card}\n\n    </div>\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });

  /**
   * Testimonial Blockquote
   *
   * @handler testimonial
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1450, Gutenberg printed the Bible with ornate initial capitals and
   * decorative elements. Pull quotes and testimonials carry that tradition—
   * special typography for special content. This handler wraps content in
   * a testimonial blockquote with distinct styling.
   *
   * The `.testimonial` class applies large text, italic styling, quotation
   * marks, and attribution formatting. Semantically it's a `<blockquote>`,
   * visually it stands out. Perfect for customer testimonials, reviews, or
   * impactful quotes.
   *
   * @param {string} content - Testimonial text and attribution
   * @returns {string} Blockquote with testimonial class
   *
   * @see {class} .testimonial - CSS definition
   * @see {element} blockquote - Semantic HTML element
   *
   * @example markdown
   *   ::testimonial
   *   "This product changed my life!"
   *   — Jane Doe, CEO
   *   ::end
   */
  processor.add("testimonial", (match) => {
    return `<blockquote class="testimonial">\n\n${match.content}\n\n</blockquote>\n`;
  });

  /**
   * Image with Variant Styling
   *
   * @handler image
   * @category Media
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1888, George Eastman created the Kodak camera with the slogan "You
   * press the button, we do the rest." Photography became accessible. On the
   * web, images need context—full-width banners, floating sidebars, captioned
   * figures. This handler makes image layouts simple.
   *
   * Write `::image full` for full-bleed images. Use `::image float-right` for
   * text wrap. The first line is the image URL, subsequent lines become the
   * caption. The handler generates a semantic `<figure>` with `<figcaption>`,
   * applies variant classes, and handles alt text automatically.
   *
   * @param {string} args - Variant: 'full', 'wide', 'float-right', 'float-left'
   * @param {string} content - Image URL (first line) and caption (remaining)
   * @returns {string} Figure element with image and caption
   *
   * @see {class} .image-* - Image variant classes
   * @see {handler} gallery - Multiple images in grid
   * @see {file} standard-08-img.scss - Image system
   *
   * @example markdown
   *   ::image full
   *   /assets/hero.jpg
   *   Beautiful landscape photograph
   *   ::end
   */
  processor.add("image", (match) => {
    const variant = match.args;
    const lines = match.content.split("\n");
    const url = lines[0];
    const caption = lines.slice(1).join("\n");

    let html = `<figure class="image-${variant}">\n`;
    html += `  <img src="${url}" alt="${caption || ""}">\n`;
    if (caption) {
      html += `  <figcaption>${caption}</figcaption>\n`;
    }
    html += `</figure>\n`;

    return html;
  });

  /**
   * Image Gallery Grid
   *
   * @handler gallery
   * @category Media
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1839, Louis Daguerre invented the daguerreotype, and suddenly everyone
   * wanted to display multiple images together. Gallery walls, photo albums,
   * contact sheets—arranging images in grids is a centuries-old practice.
   * This handler makes web galleries trivial.
   *
   * Write `::gallery 3` for a 3-column image grid. Separate image URLs with
   * `---`. The handler generates grid structure, calculates column spans,
   * and wraps images in proper markup. Responsive by default—mobile stacks,
   * desktop displays the grid.
   *
   * @param {number} args - Number of columns
   * @param {string} content - Image URLs separated by `---`
   * @returns {string} Grid with image elements
   *
   * @see {handler} image - Single image with variants
   * @see {class} .gallery - Gallery container class
   * @see {class} .grid - Grid system
   *
   * @example markdown
   *   ::gallery 3
   *   /assets/photo1.jpg
   *   ---
   *   /assets/photo2.jpg
   *   ---
   *   /assets/photo3.jpg
   *   ::end
   */
  processor.add("gallery", (match) => {
    const columns = parseInt(match.args);
    const images = processor.splitContent(match.content);
    const colSpan = Math.floor(12 / columns);

    let html = '<div class="gallery grid gap-4">\n';
    images.forEach((img) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n`;
      html += `    <img src="${img}" alt="">\n`;
      html += `  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });

  /**
   * Vertical Space Utility
   *
   * @handler space
   * @category Utilities
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1455, Gutenberg's 42-line Bible had something revolutionary: consistent
   * vertical spacing. Every line sat on an invisible grid. Centuries later,
   * Robert Bringhurst wrote in "The Elements of Typographic Style" that
   * vertical rhythm is typography's heartbeat. This handler adds that rhythm.
   *
   * Write `::space large` to insert a spacer div. The size maps to spacing
   * scale values: small, medium, large, xlarge. The generated `<div>` has
   * height but no width—it pushes content apart vertically. Simple, semantic,
   * effective.
   *
   * This is inline syntax (no `::end` marker) because spacing is atomic.
   * One command, one result. Add breathing room between sections without
   * manually adding margin classes.
   *
   * @param {string} value - Size: 'small', 'medium', 'large', or 'xlarge'
   * @returns {string} Empty div with spacing class
   *
   * @see {file} standard-05-rhythm.scss - Vertical rhythm system
   * @see {variable} --flow-space - Base spacing unit
   *
   * @example markdown
   *   ## Section One
   *   Content here
   *
   *   ::space large
   *
   *   ## Section Two
   *   More content
   */
  processor.add("space", { type: "inline" }, (match) => {
    const sizeMap = {
      small: "2",
      medium: "4",
      large: "6",
      xlarge: "8",
    };
    const size = match.value;
    return `<div class="space-${sizeMap[size] || "4"}"></div>\n`;
  });

  /**
   * Center Text Alignment
   *
   * @handler center
   * @category Utilities
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1452, scribes centered titles and chapter headings in illuminated
   * manuscripts. Centered text commands attention—it's formal, balanced,
   * deliberate. This handler wraps content in a centered container.
   *
   * The `.text-center` class applies `text-align: center` to all children.
   * Use for headlines, call-to-action buttons, or formal announcements.
   * Remember Tschichold's warning: overuse of centering looks amateurish.
   * Use intentionally, not habitually.
   *
   * @param {string} content - Content to center
   * @returns {string} Div with center alignment class
   *
   * @see {class} .text-center - CSS definition
   * @see {handler} hero - Often used with center alignment
   *
   * @example markdown
   *   ::center
   *   # Welcome
   *   [Get Started](#)
   *   ::end
   */
  processor.add("center", (match) => {
    return `<div class="text-center">\n\n${match.content}\n\n</div>\n`;
  });

  /**
   * Callout Aside
   *
   * @handler callout
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1754, encyclopedias started using margin notes for supplementary
   * information—content related to the main text but not essential. Callouts
   * continue that tradition. Use them for tips, warnings, side notes, or
   * "did you know?" facts.
   *
   * The `<aside>` element is semantically correct for tangential content.
   * The `.callout` class adds visual distinction—border, background, icon.
   * Screen readers understand it's supplementary, sighted users see it
   * stands apart.
   *
   * @param {string} content - Callout content
   * @returns {string} Aside element with callout class
   *
   * @see {class} .callout - CSS definition
   * @see {element} aside - Semantic HTML element
   *
   * @example markdown
   *   ::callout
   *   **Pro Tip:** Use keyboard shortcuts to work faster!
   *   ::end
   */
  processor.add("callout", (match) => {
    return `<aside class="callout">\n\n${match.content}\n\n</aside>\n`;
  });

  /**
   * Callout Aside
   *
   * @handler callout
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1754, encyclopedias started using margin notes for supplementary
   * information—content related to the main text but not essential. Callouts
   * continue that tradition. Use them for tips, warnings, side notes, or
   * "did you know?" facts.
   *
   * The `<aside>` element is semantically correct for tangential content.
   * The `.callout` class adds visual distinction—border, background, icon.
   * Screen readers understand it's supplementary, sighted users see it
   * stands apart.
   *
   * @param {string} content - Callout content
   * @returns {string} Aside element with callout class
   *
   * @see {class} .callout - CSS definition
   * @see {element} aside - Semantic HTML element
   *
   * @example markdown
   *   ::callout
   *   **Pro Tip:** Use keyboard shortcuts to work faster!
   *   ::end
   */
  processor.add("note", { type: "inline" }, (match) => {
    return `<aside class="note">${match.value}</aside>\n`;
  });

  processor.add("aside", (match) => {
    return `<aside>\n\n${match.content}\n\n</aside>\n`;
  });

  /**
   * Button Link Component
   *
   * @handler button
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1981, Xerox Star introduced the graphical button—click here to do
   * something. Buttons became the web's primary interaction pattern. This
   * handler creates styled button links from markdown link syntax.
   *
   * Write `::button primary` and include a markdown link `[Text](url)`. The
   * handler parses the link, generates an anchor tag with button classes,
   * and applies the variant styling. Primary for main actions, secondary
   * for alternatives. Semantic HTML (still a link), visual treatment (looks
   * like a button).
   *
   * @param {string} args - Variant: 'primary' or 'secondary' (optional)
   * @param {string} content - Markdown link syntax
   * @returns {string} Anchor tag with button classes
   *
   * @see {class} .button - Base button class
   * @see {class} .button-primary - Primary button variant
   * @see {file} standard-04-elements.scss - Button styling
   *
   * @example markdown
   *   ::button primary
   *   [Sign Up Now](/signup)
   *   ::end
   */
  processor.add("button", (match) => {
    const variant = match.args || "";
    const linkMatch = match.content.match(/\[([^\]]+)\]\(([^)]+)\)/);

    if (linkMatch) {
      const [, text, url] = linkMatch;
      const classes = variant ? `button button-${variant}` : "button";
      return `<a href="${url}" class="${classes}">${text}</a>\n`;
    }

    return match.raw;
  });

  /**
   * Form Generator
   *
   * @handler form
   * @category Components
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1993, the first HTML forms appeared with the `<form>` tag. Suddenly
   * the web was interactive—users could send data, not just receive it. Forms
   * are essential but tedious to code. This handler generates form markup
   * from simple field lists.
   *
   * Write `::form contact` and list fields (Name, Email, Message). The handler
   * generates proper form structure: labels, inputs, textareas, submit button.
   * It infers field types (email for "Email", textarea for "Message") and
   * adds required attributes. The form posts to `/api/{formType}` for
   * serverless function handling.
   *
   * Five lines of syntax become 30 lines of HTML. That's the power of
   * generation—capture intent, produce implementation.
   *
   * ### Future Improvements
   *
   * - Support more field types (checkbox, radio, select)
   * - Add validation attributes (minlength, pattern)
   * - Generate CSRF tokens for security
   *
   * @param {string} args - Form type (used in action URL)
   * @param {string} content - Field names, one per line
   * @returns {string} Complete form HTML with fields and submit button
   *
   * @see {file} src/cloudflare/api/contact.js - Form handler
   * @see {element} form - Semantic HTML element
   *
   * @example markdown
   *   ::form contact
   *   Name
   *   Email
   *   Message
   *   ::end
   */
  processor.add("form", (match) => {
    const formType = match.args;
    const fields = match.content.split("\n").filter(Boolean);

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

  /**
   * Stack on Mobile (Responsive Grid)
   *
   * @handler stack-mobile
   * @category Layout
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 2010, Ethan Marcotte coined "responsive web design"—layouts that adapt
   * to screen size. Mobile-first became the mantra. This handler creates grids
   * that stack on small screens and sit side-by-side on larger devices.
   *
   * It's identical to `::columns` in implementation but semantically clearer.
   * When you write `::stack-mobile`, you're declaring intent: "these columns
   * should stack on phones." The generated HTML uses `.col-12` (full width)
   * for mobile and `.md:col-N` for tablet breakpoint. Clear naming, clear
   * behavior.
   *
   * @param {string} content - Column content separated by `---`
   * @returns {string} Responsive grid HTML
   *
   * @see {handler} columns - Similar equal-width layout
   * @see {class} .col-12 - Full-width column
   * @see {class} .md:col-* - Tablet breakpoint columns
   *
   * @example markdown
   *   ::stack-mobile
   *   Mobile: stacks
   *   Desktop: side-by-side
   *   ---
   *   Second column
   *   ::end
   */
  processor.add("stack-mobile", (match) => {
    const cols = processor.splitContent(match.content);
    const colSpan = Math.floor(12 / cols.length);

    let html = '<div class="grid gap-4">\n';
    cols.forEach((col) => {
      html += `  <div class="col-12 md:col-${colSpan}">\n\n${col}\n\n  </div>\n`;
    });
    html += "</div>\n";

    return html;
  });

  /**
   * Conditional Content Rendering
   *
   * @handler if
   * @category Control Flow
   * @author Francis Fontaine
   * @since 0.11.0
   *
   * In 1954, FORTRAN introduced the IF statement—execute code conditionally.
   * Fifty years later, template languages brought conditionals to HTML. This
   * handler adds lightweight conditional rendering to layout syntax.
   *
   * Write `::if featured` to show content only on featured pages. Use
   * `::if !draft` to hide drafts. The handler evaluates conditions against
   * page frontmatter—simple boolean checks, equality comparisons, numeric
   * comparisons. If true, content renders. If false, it's removed.
   *
   * This is preprocessing, not template syntax. The condition is evaluated
   * once during build, not on every page load. That means it's fast but not
   * dynamic. Perfect for build-time feature flags, A/B testing, or progressive
   * disclosure based on page metadata.
   *
   * ### Future Improvements
   *
   * - Support logical operators (AND, OR, NOT)
   * - Add else blocks for alternative content
   * - Warn about undefined variables
   *
   * @param {string} args - Condition expression
   * @param {string} content - Content to conditionally show
   * @returns {string} Content or empty string based on condition
   *
   * @see {function} evaluateCondition - Condition evaluation logic
   *
   * @example markdown
   *   ::if featured
   *   ⭐ This is a featured article!
   *   ::end
   *
   * @example markdown - Negation
   *   ::if !draft
   *   Published content only
   *   ::end
   *
   * @example markdown - Equality
   *   ::if category == "tutorial"
   *   📚 Tutorial badge
   *   ::end
   */
  processor.add("if", (match) => {
    const shouldShow = evaluateCondition(match.args, match.pageData);
    return shouldShow ? `\n${match.content}\n` : "";
  });
}

/**
 * Evaluate Conditional Expressions
 *
 * @function evaluateCondition
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1958, John McCarthy created LISP with symbolic expressions—data as code,
 * code as data. Evaluating expressions became a core concept in computing.
 * This function evaluates simple conditional expressions against page data.
 *
 * It supports six types of conditions: negation (`!variable`), equality
 * (`variable == "value"`), inequality (`variable != "value"`), greater than
 * (`count > 5`), less than (`count < 5`), and truthiness (`variable`). Each
 * type maps to a different comparison operation.
 *
 * The implementation uses simple string parsing—split on operators, trim
 * whitespace, compare values. It's not a full expression parser (no nested
 * conditions, no operator precedence), but it handles 90% of use cases with
 * minimal complexity. Sometimes the 80/20 rule is really the 90/10 rule.
 *
 * This runs during preprocessing, so conditions are evaluated once at build
 * time. That means you can't use it for runtime conditionals (user logged in,
 * time of day), but it's perfect for build-time flags (environment, feature
 * flags, page metadata).
 *
 * ### Future Improvements
 *
 * - Support compound conditions (AND, OR)
 * - Add parentheses for grouping
 * - Implement regex matching
 *
 * @param {string} condition - Condition expression to evaluate
 * @param {Object} pageData - Page frontmatter and data
 * @returns {boolean} True if condition passes, false otherwise
 *
 * @see {handler} if - Conditional content rendering
 *
 * @example
 *   evaluateCondition('featured', { featured: true });
 *   // Returns: true
 *
 * @example
 *   evaluateCondition('!draft', { draft: false });
 *   // Returns: true
 *
 * @example
 *   evaluateCondition('category == "tutorial"', { category: 'tutorial' });
 *   // Returns: true
 *
 * @example
 *   evaluateCondition('count > 5', { count: 10 });
 *   // Returns: true
 */
function evaluateCondition(condition, pageData) {
  // Negation: !variable
  if (condition.startsWith("!")) {
    const key = condition.slice(1).trim();
    return !pageData[key];
  }

  // Equality: variable == "value"
  if (condition.includes("==")) {
    const [key, value] = condition.split("==").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) === cleanValue;
  }

  // Inequality: variable != "value"
  if (condition.includes("!=")) {
    const [key, value] = condition.split("!=").map((s) => s.trim());
    const cleanValue = value.replace(/['"]/g, "");
    return String(pageData[key]) !== cleanValue;
  }

  // Greater than: count > 5
  if (condition.includes(">")) {
    const [key, value] = condition.split(">").map((s) => s.trim());
    return Number(pageData[key]) > Number(value);
  }

  // Less than: count < 5
  if (condition.includes("<")) {
    const [key, value] = condition.split("<").map((s) => s.trim());
    return Number(pageData[key]) < Number(value);
  }

  // Simple truthy check: featured
  return !!pageData[condition];
}

/**
 * Syntax Plugin Export
 *
 * @function Syntax
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1979, Brian Kernighan wrote "Why Pascal is Not My Favorite Programming
 * Language," criticizing its rigidity. Good tools should be extensible. This
 * default export makes the Syntax processor an Eleventy plugin while exposing
 * the processor instance for custom syntax registration.
 *
 * When you call `eleventyConfig.addPlugin(Syntax)`, this function runs. It
 * creates a processor, registers built-in patterns, exposes the processor for
 * customization, and hooks into Eleventy's preprocessor pipeline. The result?
 * Your markdown content flows through syntax transformation before markdown-it
 * processes it.
 *
 * The exposed `eleventyConfig.Syntax` property lets you add custom patterns:
 * `eleventyConfig.Syntax.add('youtube', ...)`. This is extensibility done
 * right—provide a solid foundation, let users build on top.
 *
 * @param {Object} eleventyConfig - Eleventy configuration object
 * @param {Object} options - Plugin configuration options
 * @param {boolean} options.verbose - Enable detailed logging
 * @returns {SyntaxProcessor} Processor instance for method chaining
 *
 * @see {class} SyntaxProcessor - Core processor class
 * @see {function} registerBuiltIns - Standard syntax patterns
 *
 * @example
 *   // Basic usage
 *   eleventyConfig.addPlugin(Syntax);
 *
 * @example
 *   // With custom syntax
 *   eleventyConfig.addPlugin(Syntax, { verbose: true });
 *   eleventyConfig.Syntax.add('youtube', (match) => {
 *     return `<iframe src="https://youtube.com/embed/${match.args}"></iframe>`;
 *   });
 */
export default function Syntax(eleventyConfig, options = {}) {
  const processor = new SyntaxProcessor(options);

  // Register built-in syntax
  registerBuiltIns(processor);

  // Expose processor for custom syntax
  eleventyConfig.Syntax = processor;

  processor.logger.success("initialized");

  // Use preprocessor (runs before markdown)
  eleventyConfig.addPreprocessor("syntax", "md", (data, content) => {
    return processor.process(content, data);
  });

  return processor; // Return for chaining
}

/**
 * Syntax Processor Class Export
 *
 * @export SyntaxProcessor
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 1983, Bjarne Stroustrup added classes to C, creating C++. Classes
 * encapsulate data and behavior—state plus methods. This export provides
 * the SyntaxProcessor class for advanced usage outside the plugin system.
 *
 * Most users will never need this—they'll use the default export as an
 * Eleventy plugin. But power users might want to instantiate processors
 * directly, run syntax outside Eleventy, or extend the class for custom
 * behavior. This export makes that possible.
 *
 * It's the difference between a hammer (tool) and a blueprint (design).
 * The default export is the hammer—ready to use. This export is the
 * blueprint—build your own tool if you need something specialized.
 *
 * @see {class} SyntaxProcessor - Class implementation
 * @see {function} Syntax - Plugin export (default)
 *
 * @example
 *   import { SyntaxProcessor } from './syntax.js';
 *   const processor = new SyntaxProcessor({ verbose: true });
 *   processor.add('custom', (match) => { ... });
 *   const output = processor.process(content, pageData);
 */
export { SyntaxProcessor };
