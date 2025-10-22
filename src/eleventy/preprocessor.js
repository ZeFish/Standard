/**
 * @component Markdown Preprocessor Plugin
 * @category 11ty Plugins
 * @description Preprocesses markdown content before rendering. Removes comments,
 * handles syntax highlighting markers, escapes code blocks, and fixes date formats.
 * Supports HTML comments (%% ... %%), highlighting syntax (== ... ==), and
 * configurable code block language escaping.
 *
 * @prop {preprocessor} comment Remove HTML comments (%% ... %%)
 * @prop {preprocessor} commentCallouts Remove comment callout blocks
 * @prop {preprocessor} highlight Convert highlight syntax == text == to <mark>
 * @prop {preprocessor} escapeCodeBlock Escape specified language code blocks
 * @prop {preprocessor} fixDates Convert date strings to Date objects
 * @prop {option} escapeCodeBlocks Array of languages to escape (e.g., ["html", "xml"])
 *
 * @example
 * // In markdown, remove comments
 * %% This comment will be removed %%
 *
 * // Highlight text
 * This text is == highlighted == with yellow background
 *
 * // Code block escaping (configured in front matter)
 * escapeCodeBlocks: ["html"]
 *
 * ```html
 * <div>This block escapes backticks</div>
 * ```
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  const { escapeCodeBlocks: globalEscapeCodeBlocks = [] } = options;

  /**
   * Remove HTML comments from markdown
   * Syntax: %% comment text %%
   */
  eleventyConfig.addPreprocessor("comment", "md", (data, content) => {
    return content.replaceAll(/%%(.|\n|\s)*?%%/g, "");
  });
  eleventyConfig.addPreprocessor("commentCallouts", "md", (data, content) => {
    return content.replace(/(^> \[!comments?\][^\n]*\n(?:^>.*\n?)*)/gm, "");
  });
  eleventyConfig.addPreprocessor("highlight", "md", (data, content) => {
    return content.replace(/==(.+?)==/g, "<mark>$1</mark>");
  });
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
