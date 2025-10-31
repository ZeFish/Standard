/**
 * Markdown Preprocessor Plugin - Content Pipeline Orchestrator
 *
 * @group 11ty-plugins
 * @author Francis Fontaine
 * @since 0.1.0
 *
 * When Donald Knuth wrote about "literate programming" in 1984, he proposed
 * something radical: that code should read like prose, woven together with human
 * explanation. This plugin embraces that philosophy for your markdown content.
 *
 * Before your markdown reaches the renderer, it passes through a series of
 * transformations. Think of it like an editor's desk—each pass removes clutter,
 * adds emphasis, normalizes format quirks. The preprocessor runs these passes
 * automatically, turning raw markdown into polished content.
 *
 * The plugin works as a content pipeline: comments are stripped (keeping only
 * your public words), semantic highlights are transformed into HTML markup,
 * fragile code blocks are protected, and temporal metadata is converted to
 * proper Date objects. It's invisible work—the reader never sees it, but
 * they feel its effects.
 *
 * ### Future Improvements
 *
 * - [ ] Add syntax for inline code escaping
 * - [ ] Support conditional preprocessing based on content type
 * - [ ] Add plugin-level performance metrics
 * - [ ] Create preprocessor chaining for complex pipelines
 *
 * ### Related
 *
 * @see {function} addPreprocessor - 11ty's preprocessor registration system
 * @see {file} markdown-preprocessor-plugin.md - Generated documentation
 *
 * @link https://en.wikipedia.org/wiki/Literate_programming Knuth's Literate Programming
 */

export default function (eleventyConfig, site = {}) {
  const globalEscapeCodeBlocks = Array.isArray(site.standard?.escapeCodeBlocks)
    ? site.standard.escapeCodeBlocks
    : site.standard?.escapeCodeBlocks === true
      ? ["html", "xml"]
      : []; // optional default if boolean true

  /**
   * Comment Removal - Author's Internal Monologue Stripping
   *
   * @name Comment Removal
   * @group preprocessors
   *
   * Writers have always needed thinking space. In printed books, editors would
   * mark marginal notes with daggers (†) and asterisks (*)—private thoughts
   * alongside the public text. In the digital age, you need the same freedom
   * to write your internal notes without them bleeding into the final output.
   *
   * This preprocessor removes any content wrapped in %\% delimiters, treating
   * them as your thinking space. You can write reminders, questions, revision
   * notes, or anything you need to remember while drafting—they vanish before
   * publication. It's a simple but powerful form of cognitive freedom: write
   * for yourself first, the audience second.
   *
   * ### Future Improvementss
   *
   * - Support nested comment delimiters
   * - Option to preserve comments in draft mode
   *
   * @see {preprocessor} commentCallouts - Removes structured comment blocks
   *
   * @example markdown - Using author's notes
   *   This is published text.
   *   %\% TODO: expand this section with more examples %\%
   *   This continues the published thought.
   *   Here the %\% are escaped for demonstration.
   *
   * @param {Object} data - Front matter data
   * @param {String} content - Raw markdown content
   * @returns {String} Content with %% %% comments removed
   */
  eleventyConfig.addPreprocessor("comment", "md", (data, content) => {
    return content.replaceAll(/%%[\s\S]*?%%/g, "");
  });
  /**
   * Comment Callouts Removal - Structured Annotation Filtering
   *
   * @name Comment Callouts Removal
   * @group preprocessors
   *
   * Markdown's callout syntax—those `> [!NOTE]` and `> [!WARNING]` blocks—is
   * powerful for reader guidance. But sometimes you need a callout syntax just
   * for yourself: editorial notes, fact-checking markers, revision suggestions.
   * The `[!comments]` and `[!comment]` callouts serve exactly this purpose.
   *
   * This preprocessor strips these self-directed callouts before rendering,
   * leaving all other callouts intact. It's like having a digital margin of
   * your manuscript where you can annotate, question, and refine—then hand off
   * a clean copy to readers.
   *
   * ## 🚀 Future Improvements
   *
   * - [ ] Add callout preservation for draft/preview modes
   * - [ ] Support custom callout types for different annotation purposes
   *
   * ## 🔗 Related
   *
   * @see {preprocessor} comment - Simple comment delimiter removal
   *
   * @example markdown - Using comment callouts
   *   > [!comments]
   *   > This section needs verification
   *   > before publishing
   *
   * @param {Object} data - Front matter data
   * @param {String} content - Raw markdown content
   * @returns {String} Content with [!comment(s)] callout blocks removed
   */
  eleventyConfig.addPreprocessor("commentCallouts", "md", (data, content) => {
    return content.replace(/(^> \[!comments?\][^\n]*\n(?:^>.*\n?)*)/gm, "");
  });
  /**
   * Highlight Syntax Conversion - Semantic Emphasis Transformation
   *
   * @name Highlight Syntax Conversion
   * @group preprocessors
   *
   * Before digital highlighters existed, readers used actual markers: fluorescent
   * yellows and pinks to flag important passages. The tradition runs deep—back
   * to medieval monks rubricating manuscripts in red ochre, marking the sacred
   * passages for reference.
   *
   * The `== text ==` syntax brings this tactile, visual practice into markdown.
   * It's more semantic than bold or italic: you're not emphasizing tone or voice,
   * you're marking *importance*. This preprocessor converts that syntax into
   * proper `<mark>` elements—the HTML5 way of saying "this is highlighted by
   * the author." Readers see the yellow background, but developers see semantic HTML.
   *
   * ## 🚀 Future Improvements
   *
   * - [ ] Support multiple highlight colors with syntax variants
   * - [ ] Add highlight removal option for alternate stylesheets
   * - [ ] Create highlight analytics tracking
   *
   * ## 🔗 Related
   *
   * @see {preprocessor} escapeCodeBlock - Code protection in highlights
   *
   * @example markdown - Marking important content
   *   The baseline grid is ==the foundation of readable typography==.
   *   Every element should sit on this invisible framework.
   *
   * @param {Object} data - Front matter data
   * @param {String} content - Raw markdown content
   * @returns {String} Content with == text == converted to <mark> elements
   */
  eleventyConfig.addPreprocessor("highlight", "md", (data, content) => {
    return content.replace(/==(.+?)==/g, "<mark>$1</mark>");
  });
  /**
   * Code Block Escaping - Fragile Syntax Protection Protocol
   *
   * @name Code Block Escaping
   * @group preprocessors
   *
   * Some languages live dangerously close to markdown syntax. HTML with its angle
   * brackets, XML with its declarative nature—both can confuse a preprocessor
   * if treated carelessly. When you write about code *in* code blocks, the
   * preprocessor might interpret the markdown and corrupt your examples.
   *
   * This preprocessor protects fragile code blocks by removing their markdown
   * code fence markers (the backticks), rendering them as raw text. This prevents
   * accidental transformations. The language is configured per-document via front
   * matter (`escapeCodeBlocks: ["html", "xml"]`), or globally when the plugin loads.
   * Document settings take precedence—you can override global behavior on a
   * per-file basis for maximum control.
   *
   * Think of it as creating a protected zone: "this code is fragile, don't touch it."
   *
   * ## 🚀 Future Improvements
   *
   * - [ ] Add whitespace preservation options
   * - [ ] Support inline code escaping
   * - [ ] Create escape level control (partial vs. full)
   *
   * ## 🔗 Related
   *
   * @see {preprocessor} highlight - Works alongside code protection
   *
   * @example markdown - Front matter configuration
   *   ---
   *   escapeCodeBlocks: ["html", "xml"]
   *   ---
   *
   * @example markdown - Protected HTML block
   *   ```html
   *   <div class="protected">This won't be preprocessed</div>
   *   ```
   *
   * @param {Object} data - Front matter data (checked for escapeCodeBlocks array)
   * @param {String} content - Raw markdown content
   * @returns {String} Content with specified language code blocks unescaped
   */
  eleventyConfig.addPreprocessor("escapeCodeBlock", "md", (data, content) => {
    // Get escape languages from front matter or use global setting
    // Front matter takes precedence: escapeCodeBlocks: ["html", "xml"]
    const escapeLanguages = data.escapeCodeBlocks || globalEscapeCodeBlocks;

    if (!escapeLanguages || escapeLanguages.length === 0) {
      return content;
    }

    // Create a regex pattern for each language to match code blocks
    escapeLanguages.forEach((lang) => {
      // Match ```language\n content \n``` and remove backticks
      // The 's' flag makes '.' match newlines, allowing multiline content
      const pattern = new RegExp(`^\`\`\`${lang}\n(.*?)\n\`\`\`$`, "gms");
      content = content.replace(pattern, "$1");
    });

    return content;
  });
  /**
   * Date Format Normalization - Temporal Metadata Standardization
   *
   * @name Date Format Normalization
   * @group preprocessors
   *
   * Front matter in markdown is notoriously finicky about dates. Write them one
   * way in YAML and they're strings; write them another and they're parsed as
   * JavaScript Date objects. This inconsistency breaks templating, sorting, and
   * filtering—the three pillars of content management.
   *
   * The YAML 1.1 specification (which Jekyll popularized) tries to be helpful by
   * auto-parsing timestamps. But it's unreliable across systems and configurations.
   * This preprocessor takes the author's intent—a readable timestamp like
   * "2024-10-25 14:30"—and guarantees it becomes a proper JavaScript Date object
   * before any templating runs.
   *
   * It's defensive programming for content: assume strings, validate carefully,
   * transform only when safe, and preserve originals if anything seems wrong.
   * Your dates become predictable, sortable, and reliable throughout the pipeline.
   *
   * ## 🚀 Future Improvements
   *
   * - [ ] Support timezone specification in timestamps
   * - [ ] Add date range parsing for duration fields
   * - [ ] Create ISO 8601 validation strictness option
   *
   * ## 🔗 Related
   *
   * @see {preprocessor} comment - Other metadata transformations
   *
   * @example markdown - Front matter dates
   *   ---
   *   created: 2024-10-25 14:30
   *   modified: 2024-10-25 15:45
   *   ---
   *
   * @param {Object} data - Front matter data with optional `created` and `modified` fields
   * @param {String} content - Raw markdown content (unchanged by this preprocessor)
   * @returns {String} Content unchanged; modifies data.created and data.modified in place
   */
  eleventyConfig.addPreprocessor("fixDates", "md", (data, content) => {
    const fixDateString = (value) => {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ) {
        const date = new Date(value.replace(" ", "T"));
        // If the date is invalid, return the original value to prevent errors
        return isNaN(date.getTime()) ? value : date;
      }
      return value;
    };

    // Fix only known fields
    if (data.created) data.created = fixDateString(data.created);
    if (data.modified) data.modified = fixDateString(data.modified);

    return content;
  });
}
