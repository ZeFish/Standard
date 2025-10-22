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
    const match = content.match(/<img[^>]*src=["']([^"']+)["']/);
    return match ? match[1] : null;
  });

  // Extract excerpt from content (handles both HTML and Markdown)
  eleventyConfig.addFilter("excerpt", (content, options = {}) => {
    if (!content) return "";

    const defaults = {
      maxWords: 50,
      maxSentences: 2,
      stripHtml: true,
      useFirstParagraph: true,
      endWithEllipsis: true,
    };

    const config = { ...defaults, ...options };
    let text = content;

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

    // If useFirstParagraph is true, try to get the first paragraph
    if (config.useFirstParagraph) {
      // For HTML content
      const pMatch = text.match(/<p[^>]*>(.*?)<\/p>/s);
      if (pMatch) {
        text = pMatch[1];
      } else {
        // For Markdown content - split by double newlines and find first text paragraph
        const paragraphs = text.split(/\n\s*\n/);
        for (const para of paragraphs) {
          const cleanPara = para.trim();
          // Skip empty paragraphs and frontmatter
          if (
            cleanPara &&
            !cleanPara.startsWith("---") &&
            cleanPara.length > 10
          ) {
            text = cleanPara;
            break;
          }
        }
      }
    }

    // Strip HTML if requested
    if (config.stripHtml) {
      text = text.replace(/<[^>]*>/g, " ");
    }

    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();

    if (!text) return "";

    // Limit by sentences first (more natural)
    if (config.maxSentences > 0) {
      const sentences = text.match(/[^\.!?]+[\.!?]+/g);
      if (sentences && sentences.length > config.maxSentences) {
        text = sentences.slice(0, config.maxSentences).join("");
        return text.trim() + (config.endWithEllipsis ? "..." : "");
      }
    }

    // Fallback to word limit
    const words = text.split(" ");
    if (words.length > config.maxWords) {
      text = words.slice(0, config.maxWords).join(" ");
      if (config.endWithEllipsis) {
        text += "...";
      }
    }

    return text.trim();
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

    let text = content;
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

    let text = content;

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
      const found = content.match(regex);
      if (found) {
        matches = matches.concat(found);
      }
    });

    return matches.join("");
  });

  // Remove empty HTML tags
  eleventyConfig.addFilter("removeEmptyTags", (content) => {
    if (!content) return "";
    // This regex finds tags that are empty or contain only whitespace.
    return content.replace(/<(\w+)[^>]*>\s*<\/(\1)>/g, "");
  });

  eleventyConfig.addFilter("stripText", (content) => {
    if (!content) {
      return "";
    }
    // Regular expression to match all HTML tags
    const tags = content.match(/<[^>]*>/g);

    // Join all matched tags together
    return tags ? tags.join("") : "";
  });

  // New filter to keep only <p> tags containing an <img> tag
  eleventyConfig.addFilter("keepParagraphsWithImages", (content) => {
    if (!content) {
      return "";
    }

    // Regular expression to find all <p>...</p> blocks
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gs;
    const paragraphs = content.match(paragraphRegex);

    // If no paragraphs are found, return an empty string
    if (!paragraphs) {
      return "";
    }

    // Filter the paragraphs to keep only those containing an <img> tag
    const paragraphsWithImages = paragraphs.filter((p) => {
      // Use a regex to test if an <img> tag exists within the paragraph
      return /<img[^>]*>/.test(p);
    });

    // Join the filtered paragraphs back into a single string
    return paragraphsWithImages.join("");
  });

  eleventyConfig.addFilter("sliceFromFirstImage", (content) => {
    if (!content) {
      return "";
    }

    // This regex finds the starting position of a <p> tag that contains an <img> tag.
    // It correctly handles attributes on the <p> tag (like <p class="...">)
    // and any whitespace between the <p> and <img> tags.
    const searchPattern = /<p[^>]*>\s*<img/;

    // Find the index of the first match
    const startIndex = content.search(searchPattern);

    // If a match is found (startIndex is not -1), slice the string from that index.
    // Otherwise, return an empty string.
    return startIndex !== -1 ? content.slice(startIndex) : "";
  });

  eleventyConfig.addFilter("sliceBeforeFirstImage", (content) => {
    if (!content) {
      return "";
    }

    // The same pattern to find the start of a <p> with an <img> inside.
    const searchPattern = /<p[^>]*>\s*<img/;

    // Find the index of the first match.
    const endIndex = content.search(searchPattern);

    // If a match is found, slice the string from the beginning up to that index.
    // If no match is found, return the entire original content.
    return endIndex !== -1 ? content.slice(0, endIndex) : content;
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // Returns YYYY-MM-DD format for HTML datetime attributes
    return dateObj.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("dateToXmlschema", (dateObj) => {
    // Returns ISO 8601 format for XML/RSS feeds
    return dateObj.toISOString();
  });

  eleventyConfig.addFilter("numberOfWords", (text) => {
    return text.split(/\s+/).length;
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
}
