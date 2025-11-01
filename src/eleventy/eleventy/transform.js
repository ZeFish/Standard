/**
 * Transform Plugin - Post-Render HTML Enhancement Pipeline
 *
 * @group 11ty-plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In the world of publishing, there's always been a distinction between
 * composition and imposition. Composition is setting the type—choosing fonts,
 * spacing, hierarchy. Imposition is the final layout—folding, binding, trimming.
 * In medieval scriptoria, these were separate craftsmen: the scribe who wrote,
 * and the binder who assembled.
 *
 * Eleventy's transform system embodies this same separation. Preprocessors work
 * during composition—they modify your markdown before it becomes HTML. Transforms
 * work during imposition—they enhance the final HTML structure before it's
 * written to disk. This is where you add wrappers, inject metadata, optimize
 * assets, or restructure elements that only make sense as HTML.
 *
 * Think of transforms as your digital bindery: the content is set, the ink is
 * dry, but you still have one final pass to perfect the presentation. These
 * modifications happen after markdown rendering, after template includes, after
 * everything is HTML. It's the last mile of your content pipeline.
 *
 * ### Future Improvements
 *
 * - [ ] Add configurable transform priority/ordering
 * - [ ] Create transform performance profiling
 * - [ ] Support conditional transforms based on output path
 * - [ ] Add transform chaining with context passing
 *
 * ### Related
 *
 * @see {function} addTransform - 11ty's transform registration system
 * @see {file} preprocessor.js - Pre-render content pipeline
 * @see {file} transform-plugin.md - Generated documentation
 *
 * @link https://www.11ty.dev/docs/config/#transforms 11ty Transform Documentation
 */

export default function (eleventyConfig, options = {}) {
  const {
    wrapperClass = "scroll",
    onlyHtml = true,
    skipWrappedTables = true,
  } = options;

  /**
   * Table Wrapper Transform - Responsive Overflow Container Injection
   *
   * @name Table Wrapper Transform
   * @group transforms
   *
   * In 1969, when IBM designed their Selectric typewriter, they faced a brutal
   * constraint: 80 characters per line. That limitation carried forward into
   * early computing terminals, and it's why programmers still debate line length
   * today. But tables? Tables have always been anarchists. They refuse to fit.
   *
   * When Edward Tufte published "The Visual Display of Quantitative Information"
   * in 1983, he showed that data tables often need more width than comfortable
   * reading allows. The solution in print was simple: rotate the page, fold it
   * out, or shrink the font. On the web, we need something smarter.
   *
   * This transform wraps every HTML table in a responsive container div, creating
   * a horizontal scroll zone. The table can be as wide as it needs to be—your
   * typography stays readable, your layout doesn't break, and users can swipe or
   * scroll to see all columns. It's the digital equivalent of Tufte's foldout
   * pages: respect the data's natural width while preserving the reading experience.
   *
   * Unlike preprocessors that work on markdown, this transform operates on the
   * final HTML structure. It runs after all templating, after all includes, when
   * every `<table>` element is fully rendered. This makes it bulletproof: tables
   * from markdown, from shortcodes, from data files—all get wrapped consistently.
   *
   * The transform is smart enough to skip tables already wrapped (preventing
   * nested wrappers) and only processes HTML files (ignoring JSON, XML, or other
   * output formats). You can customize the wrapper class name, making it fit
   * seamlessly into any design system.
   *
   * ### Future Improvements
   *
   * - [ ] Add data attributes for column count and scroll width
   * - [ ] Support optional caption positioning outside wrapper
   * - [ ] Create automatic column width optimization hints
   * - [ ] Add touch-scroll indicators for mobile devices
   * - [ ] Support table-specific wrapper classes based on content
   * - [ ] Add option to wrap only tables exceeding a width threshold
   *
   * ### Related
   *
   * @see {preprocessor} escapeCodeBlock - Similar protection approach
   * @see {class} .table-wrapper - CSS styles for responsive tables
   * @see {mixin} rhythm - Vertical spacing for wrapped tables
   *
   * @link https://en.wikipedia.org/wiki/Edward_Tufte Data visualization pioneer
   * @link https://www.w3.org/WAI/tutorials/tables/ W3C Table Accessibility
   *
   * @example html - Input HTML (from markdown or templates)
   *   <table>
   *     <thead>
   *       <tr><th>Name</th><th>Value</th></tr>
   *     </thead>
   *     <tbody>
   *       <tr><td>Flow</td><td>1.5rem</td></tr>
   *     </tbody>
   *   </table>
   *
   * @example html - Output HTML (wrapped)
   *   <div class="table-wrapper">
   *     <table>
   *       <thead>
   *         <tr><th>Name</th><th>Value</th></tr>
   *       </thead>
   *       <tbody>
   *         <tr><td>Flow</td><td>1.5rem</td></tr>
   *       </tbody>
   *     </table>
   *   </div>
   *
   * @example javascript - Plugin configuration
   *   eleventyConfig.addPlugin(TransformPlugin, {
   *     wrapperClass: "table-wrapper",     // Custom class name
   *     onlyHtml: true,                     // Only process .html files
   *     skipWrappedTables: true            // Prevent double-wrapping
   *   });
   *
   * @param {String} content - Fully rendered HTML content
   * @param {String} outputPath - Output file path (e.g., "_site/blog/post.html")
   * @returns {String} HTML with all <table> elements wrapped in divs
   */
  eleventyConfig.addTransform("wrapTables", function (content) {
    // Only process HTML files if option is enabled
    if (
      onlyHtml &&
      (!this.page.outputPath || !this.page.outputPath.endsWith(".html"))
    ) {
      return content;
    }

    // Skip tables already wrapped to prevent nested wrappers
    if (skipWrappedTables) {
      // Replace tables that aren't already inside the wrapper class
      // Uses negative lookbehind to check if table is preceded by wrapper div
      const wrappedPattern = new RegExp(
        `<div class="${wrapperClass}">\\s*<table[^>]*>[\\s\\S]*?<\\/table>\\s*<\\/div>`,
        "gi",
      );
      const alreadyWrapped = content.match(wrappedPattern);

      // Replace all unwrapped tables
      return content.replace(/(<table[^>]*>[\s\S]*?<\/table>)/gi, (match) => {
        // Check if this specific table is already wrapped
        const isWrapped =
          alreadyWrapped &&
          alreadyWrapped.some((wrapped) => wrapped.includes(match));

        return isWrapped
          ? match
          : `<div class="${wrapperClass}">${match}</div>`;
      });
    }

    // Simple replacement without checking for existing wrappers
    return content.replace(
      /(<table[^>]*>[\s\S]*?<\/table>)/gi,
      `<div class="${wrapperClass}">$1</div>`,
    );
  });
}
