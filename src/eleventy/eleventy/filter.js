/**
 * @component Eleventy Filter Plugin
 * @category 11ty Plugins
 * @description Provides template filters for content processing including excerpt
 * generation, image extraction, HTML manipulation, date formatting, and data filtering.
 * All filters handle both Markdown and HTML input gracefully.
 *
 * @prop {filter} excerpt Extract content summary with customizable options
 * @prop {filter} extractFirstImage Get first image URL from content
 * @prop {filter} firstParagraph Extract first paragraph
 * @prop {filter} excerptWords Limit excerpt to N words
 * @prop {filter} htmlDateString Format date for HTML
 * @prop {filter} dateToXmlschema ISO 8601 date format
 * @prop {filter} removeTags Remove specific HTML tags
 * @prop {filter} filterTags Keep only specific tags
 * @prop {filter} removeEmptyTags Clean empty elements
 * @prop {filter} dotDate Format date as YY.MM.DD
 *
 * @example
 * // In template
 * {{ post.content | excerpt(maxWords: 50) }}
 * {{ post.content | extractFirstImage }}
 * {{ post.date | dateToXmlschema }}
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  // Extract first image from content
  eleventyConfig.addFilter("extractFirstImage", (content) => {
    if (typeof content !== "string") return null;
    const match = content.match(/<img[^>]*src=["']([^"']+)["']/);
    return match ? match[1] : null;
  });

  /**
   * Excerpt Filter
   *
   * @filter excerpt
   * @category Text Processing
   * @since 0.1.0
   *
   * In the early days of blogging, RSS feeds needed a way to show previews
   * of articles without transmitting entire posts. The concept of an "excerpt"
   * was born - a carefully crafted snippet that entices readers while respecting
   * bandwidth constraints. Today, excerpts serve SEO (meta descriptions), social
   * sharing (OpenGraph), and user experience (article previews).
   *
   * This filter intelligently extracts meaningful previews from your content,
   * handling both Markdown and HTML. It strips formatting, removes code blocks,
   * and truncates to your exact specifications - whether by word count or
   * character length. Smart enough to respect word boundaries, it never cuts
   * words in half, ensuring professional, readable excerpts every time.
   *
   * The filter knows the difference between structural markup (headings, lists,
   * code blocks) and readable prose. It finds the first real paragraph of text,
   * ignoring frontmatter and formatting, giving you the actual beginning of
   * your article - the hook that draws readers in.
   *
   * ### Why Two Truncation Methods?
   *
   * **Word-based** (`maxWords`) feels natural for editorial content. "Show me
   * the first 50 words" matches how we think about reading. Perfect for blog
   * listings and article previews.
   *
   * **Character-based** (`maxChars`) serves technical constraints. Google's
   * meta descriptions max out at 160 characters. Twitter cards stop at 200.
   * OpenGraph recommends 300. Character limits ensure your content fits the
   * container, whether that's a search result or a social card.
   *
   * ### Future Improvements
   *
   * - Sentence-aware truncation (stop at sentence boundaries)
   * - Custom ellipsis styles (…, [...], read more →)
   * - HTML entity decoding
   * - Multi-language sentence detection
   *
   * @example njk - Meta description (SEO)
   *   <meta name="description" content="{{ content | excerpt({ maxChars: 155 }) }}">
   *
   * @example njk - Blog post preview
   *   {% for post in collections.posts %}
   *     <article>
   *       <h2>{{ post.data.title }}</h2>
   *       <p>{{ post.templateContent | excerpt({ maxWords: 40 }) }}</p>
   *     </article>
   *   {% endfor %}
   *
   * @example njk - Social sharing cards
   *   <meta property="og:description" content="{{ content | excerpt({ maxChars: 300 }) }}">
   *   <meta name="twitter:description" content="{{ content | excerpt({ maxChars: 200 }) }}">
   *
   * @example njk - Custom options
   *   {{ content | excerpt({
   *     maxChars: 500,
   *     stripHtml: false,
   *     useFirstParagraph: true,
   *     respectWordBoundaries: true,
   *     endWithEllipsis: true
   *   }) }}
   *
   * @param {String} content - The content to excerpt (HTML or Markdown)
   * @param {Object} options - Configuration options
   * @param {Number} options.maxWords - Maximum number of words (default: 50)
   * @param {Number} options.maxChars - Maximum characters (overrides maxWords if set)
   * @param {Number} options.maxSentences - Maximum sentences (default: 2)
   * @param {Boolean} options.stripHtml - Remove HTML tags (default: true)
   * @param {Boolean} options.useFirstParagraph - Extract first paragraph only (default: true)
   * @param {Boolean} options.endWithEllipsis - Add ellipsis when truncated (default: true)
   * @param {Boolean} options.respectWordBoundaries - Don't cut words in half (default: true)
   *
   * @returns {String} Excerpted content
   */
  eleventyConfig.addFilter("excerpt", (content, options = {}) => {
    // Return empty string if no content provided
    if (!content) return "";
    let text = String(content);

    // ===== DEFINE DEFAULTS =====
    const defaults = {
      maxWords: 50, // Word limit (default truncation method)
      maxChars: null, // Character limit (takes priority over maxWords)
      maxSentences: 2, // Sentence limit (future feature)
      stripHtml: true, // Remove HTML tags
      useFirstParagraph: true, // Extract first paragraph only
      endWithEllipsis: true, // Add "…" when truncated
      respectWordBoundaries: true, // Don't break words when using maxChars
    };

    // Merge user options with defaults
    const config = { ...defaults, ...options };

    // ===== NORMALIZE QUOTES =====
    // Convert straight double quotes to single quotes (simpler for attribute values)
    text = text.replace(/"/g, "'");

    // ===== REMOVE MARKDOWN SYNTAX =====

    // Remove markdown images: ![alt text](image.jpg)
    text = text.replace(/!\[.*?\]\(.*?\)/g, " ");

    // Remove markdown links but preserve link text: [text](url) → text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove markdown headers: ## Header → Header
    text = text.replace(/^#{1,6}\s+/gm, "");

    // Remove markdown bold: **text** or __text__ → text
    text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");

    // Remove markdown italic: *text* or _text_ → text
    text = text.replace(/(\*|_)(.*?)\1/g, "$2");

    // Remove inline code: `code` → code
    text = text.replace(/`([^`]+)`/g, "$1");

    // Remove markdown list items (ordered and unordered)
    text = text.replace(/^\s*([-*+]|\d+\.)\s+.*$/gm, " ");

    // Remove code blocks (fenced and indented)
    text = text.replace(/```[\s\S]*?```/g, " "); // Fenced: ```code```
    text = text.replace(/^    .*$/gm, " "); // Indented: 4 spaces

    // ===== EXTRACT FIRST PARAGRAPH =====
    if (config.useFirstParagraph) {
      // Try to match HTML paragraph first
      const pMatch = text.match(/<p[^>]*>(.*?)<\/p>/s);

      if (pMatch) {
        // Found HTML paragraph - use its content
        text = pMatch[1];
      } else {
        // No HTML paragraph - split by double newlines (Markdown paragraphs)
        const paragraphs = text.split(/\n\s*\n/);

        // Find first substantial text paragraph
        for (const para of paragraphs) {
          const cleanPara = para.trim();

          // Skip empty paragraphs, frontmatter, and very short text
          if (
            cleanPara && // Not empty
            !cleanPara.startsWith("---") && // Not frontmatter delimiter
            cleanPara.length > 10 // Substantial text
          ) {
            text = cleanPara;
            break;
          }
        }
      }
    }

    // ===== STRIP HTML TAGS =====
    if (config.stripHtml) {
      // Remove all HTML tags: <tag>content</tag> → content
      text = text.replace(/<[^>]*>/g, " ");
    }

    // ===== CLEAN UP WHITESPACE =====
    // Collapse multiple spaces into single space and trim
    text = text.replace(/\s+/g, " ").trim();

    // ===== CHARACTER-BASED TRUNCATION =====
    // If maxChars is set, use character limit (takes priority over word limit)
    if (config.maxChars && text.length > config.maxChars) {
      // Truncate to maximum character length
      text = text.substring(0, config.maxChars);

      // Respect word boundaries - don't cut words in half
      if (config.respectWordBoundaries) {
        // Find last space before the cutoff point
        const lastSpace = text.lastIndexOf(" ");

        // Only truncate at word boundary if we found a space
        // (and it's not at the very beginning)
        if (lastSpace > 0) {
          text = text.substring(0, lastSpace);
        }
      }

      // Add ellipsis if enabled
      if (config.endWithEllipsis) {
        text = text.trim() + "…";
      }

      // Return character-truncated text
      return text;
    }

    // ===== WORD-BASED TRUNCATION =====
    // If maxWords is set (and maxChars wasn't used), truncate by word count
    if (config.maxWords) {
      // Split text into array of words
      const words = text.split(/\s+/);

      // Check if we need to truncate
      if (words.length > config.maxWords) {
        // Take only the first maxWords words
        text = words.slice(0, config.maxWords).join(" ");

        // Add ellipsis if enabled
        if (config.endWithEllipsis) {
          text = text.trim() + "…";
        }
      }
    }

    // Return final excerpted text
    return text;
  });

  // Filtre année robuste
  eleventyConfig.addFilter("year", (date) => {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d)) return "";
    return String(d.getFullYear());
  });

  // Simpler excerpt filter that just gets first paragraph (handles Markdown)
  eleventyConfig.addFilter("firstParagraph", (content) => {
    if (!content) return "";

    let text = String(content);
    text = text.replace(/"/g, "'");

    // Remove markdown images
    text = text.replace(/!\[.*?\]\(.*?\)/g, " ");

    // Remove markdown links but keep the text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove markdown headers
    text = text.replace(/^#{1,6}\s+/gm, "");

    // Remove markdown formatting
    text = text.replace(/(\*\*|__)(.*?)\1/g, "$2"); // bold
    text = text.replace(/(\*|_)(.*?)\1/g, "$2"); // italic
    text = text.replace(/`([^`]+)`/g, "$1"); // inline code

    // Remove markdown unordered and ordered list items
    text = text.replace(/^\s*([-*+]|\d+\.)\s+.*$/gm, " ");

    // First try to get first <p> tag content (for HTML)
    const pMatch = text.match(/<p[^>]*>(.*?)<\/p>/s);
    if (pMatch) {
      let firstPara = pMatch[1];
      // Strip any remaining HTML
      firstPara = firstPara.replace(/<[^>]*>/g, " ");
      // Clean whitespace
      firstPara = firstPara.replace(/\s+/g, " ").trim();
      return firstPara;
    }

    // For Markdown content - split by double newlines and find first text paragraph
    const paragraphs = text.split(/\n\s*\n/);
    for (const para of paragraphs) {
      let cleanPara = para.trim();

      // Skip frontmatter, empty paragraphs, and very short content
      if (!cleanPara || cleanPara.startsWith("---") || cleanPara.length < 10) {
        continue;
      }

      // Strip any remaining HTML
      cleanPara = cleanPara.replace(/<[^>]*>/g, " ");

      // Clean whitespace
      cleanPara = cleanPara.replace(/\s+/g, " ").trim();

      if (cleanPara) {
        return cleanPara;
      }
    }

    return "";
  });

  // Word-limited excerpt (handles Markdown)
  eleventyConfig.addFilter("excerptWords", (content, maxWords = 30) => {
    if (!content) return "";

    let text = String(content);

    text = text.replace(/"/g, "'");

    // Remove markdown images
    text = text.replace(/!\[.*?\]\(.*?\)/g, " ");

    // Remove markdown links but keep the text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove markdown headers
    text = text.replace(/^#{1,6}\s+/gm, "");

    // Remove markdown formatting
    text = text.replace(/(\*\*|__)(.*?)\1/g, "$2"); // bold
    text = text.replace(/(\*|_)(.*?)\1/g, "$2"); // italic
    text = text.replace(/`([^`]+)`/g, "$1"); // inline code

    // Remove markdown unordered and ordered list items
    text = text.replace(/^\s*([-*+]|\d+\.)\s+.*$/gm, " ");

    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, " ");
    text = text.replace(/^    .*$/gm, " "); // indented code blocks

    // Strip HTML
    text = text.replace(/<[^>]*>/g, " ");

    // Clean whitespace
    text = text.replace(/\s+/g, " ").trim();

    // Skip frontmatter and find actual content
    const paragraphs = text.split(/\n\s*\n/);
    let cleanText = "";

    for (const para of paragraphs) {
      const cleanPara = para.trim();
      if (cleanPara && !cleanPara.startsWith("---") && cleanPara.length > 5) {
        cleanText += cleanPara + " ";
      }
    }

    text = cleanText.trim();
    if (!text) return "";

    const words = text.split(" ").filter((word) => word.length > 0);
    if (words.length <= maxWords) return text;

    return words.slice(0, maxWords).join(" ") + "...";
  });

  // Remove specific HTML tags
  eleventyConfig.addFilter("removeTags", (content, tags = "p") => {
    if (!content) return "";

    // Handle array, comma-separated string, or single tag
    let tagArray;
    if (Array.isArray(tags)) {
      tagArray = tags;
    } else if (typeof tags === "string") {
      tagArray = tags.split(",").map((tag) => tag.trim());
    } else {
      tagArray = [tags];
    }

    let result = content;
    tagArray.forEach((tag) => {
      let regex;
      if (tag === "img") {
        regex = new RegExp(`<${tag}[^>]*>`, "gs");
      } else {
        regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, "gs");
      }
      result = result.replace(regex, "");
    });

    return result;
  });

  // Keep only specific HTML tags
  eleventyConfig.addFilter("filterTags", (content, tags = "p") => {
    if (!content) return "";
    const source = String(content);

    let tagArray;
    if (Array.isArray(tags)) {
      tagArray = tags;
    } else if (typeof tags === "string") {
      tagArray = tags.split(",").map((tag) => tag.trim());
    } else {
      tagArray = [tags];
    }

    let matches = [];
    tagArray.forEach((tag) => {
      let regex;
      if (tag === "img") {
        regex = new RegExp(`<${tag}[^>]*>`, "gs");
      } else {
        regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, "gs");
      }
      const found = source.match(regex);
      if (found) {
        matches = matches.concat(found);
      }
    });

    return matches.join("");
  });

  // Remove empty HTML tags
  eleventyConfig.addFilter("removeEmptyTags", (content) => {
    if (!content) return "";
    let result = String(content);
    // This regex finds tags that are empty or contain only whitespace.
    return result.replace(/<(\w+)[^>]*>\s*<\/(\1)>/g, "");
  });

  eleventyConfig.addFilter("stripText", (content) => {
    if (!content) return "";
    const tags = String(content).match(/<[^>]*>/g);
    return tags ? tags.join("") : "";
  });

  // New filter to keep only <p> tags containing an <img> tag
  eleventyConfig.addFilter("keepParagraphsWithImages", (content) => {
    if (!content) return "";
    const source = String(content);
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gs;
    const paragraphs = source.match(paragraphRegex);

    // Filter the paragraphs to keep only those containing an <img> tag
    const paragraphsWithImages = paragraphs.filter((p) => {
      // Use a regex to test if an <img> tag exists within the paragraph
      return /<img[^>]*>/.test(p);
    });

    // Join the filtered paragraphs back into a single string
    return paragraphsWithImages.join("");
  });

  eleventyConfig.addFilter("sliceFromFirstImage", (content) => {
    if (!content) return "";
    const source = String(content);
    const startIndex = source.search(/<p[^>]*>\s*<img/);
    return startIndex !== -1 ? source.slice(startIndex) : "";
  });

  eleventyConfig.addFilter("sliceBeforeFirstImage", (content) => {
    if (!content) return "";
    const source = String(content);
    const endIndex = source.search(/<p[^>]*>\s*<img/);
    return endIndex !== -1 ? source.slice(0, endIndex) : source;
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // Returns YYYY-MM-DD format for HTML datetime attributes
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return isNaN(d) ? "" : d.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("dateToXmlschema", (dateObj) => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return isNaN(d) ? "" : d.toISOString();
  });

  eleventyConfig.addFilter("numberOfWords", (text) => {
    if (typeof text !== "string") return 0;
    return text.trim().length ? text.trim().split(/\s+/).length : 0;
  });

  eleventyConfig.addFilter("dotDate", (dateObj) => {
    const year = String(dateObj.getFullYear()).slice(-2);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  });

  // Add split filter
  eleventyConfig.addFilter("split", (text, separator) => {
    if (typeof text !== "string") {
      return text;
    }
    return text.split(separator || ",");
  });

  // Add filterData filter
  // {% set public_backlinks = backlinks | filterData("data.visibility", "private") %}
  // {% if public_backlinks.length > 0 %}
  eleventyConfig.addFilter("filterData", (arr, propertyPath, value) => {
    if (!Array.isArray(arr)) {
      return arr;
    }
    return arr.filter((item) => {
      let current = item;
      const path = propertyPath.split(".");
      for (let i = 0; i < path.length; i++) {
        if (current === undefined || current === null) {
          return false;
        }
        current = current[path[i]];
      }
      return current !== value;
    });
  });

  // Add external link class to URLs starting with http:// or https://
  // Usage: {% if url | isExternal %}<a href="{{ url }}" class="external-link">{% endif %}
  eleventyConfig.addFilter("isExternal", (url) => {
    if (typeof url !== "string") {
      return false;
    }
    return url.startsWith("http://") || url.startsWith("https://");
  });
}
