/**
 * Content Utilities
 * Ported from src/eleventy/eleventy/filter.js
 */

/**
 * Standard Slugify (Robust)
 *
 * Input: "It's --- a   day & night!"
 * Output: "its-a-day-night"
 */
export function slugify(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // 1. Split accents
    .replace(/[\u0300-\u036f]/g, "") // 2. Remove accent marks
    .replace(/['’‘]/g, "") // 3. Remove apostrophes (It's -> Its)
    .replace(/[^a-z0-9]+/g, "-") // 4. Replace ALL non-alphanumeric chars with hyphen
    .replace(/^-+|-+$/g, "") // 5. Trim hyphens from start and end
    .replace(/-{2,}/g, "-"); // 6. Collapse multiple hyphens into one
}

export function generateShortId(length = 6) {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let id = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    id += alphabet[randomValues[i] % alphabet.length];
  }
  return id;
}

/**
 * Generate a permalink from a file ID or stem
 *
 * @param {string} fileIdOrStem - The file ID (e.g., "foo.md") or stem (e.g., "foo")
 * @returns {string} The generated permalink (e.g., "/foo/")
 */
export function generatePermalink(fileIdOrStem) {
  // Remove extension if present
  const slug = fileIdOrStem.replace(/\.mdx?$/, "");

  // Handle index files (content/index.md -> /)
  if (slug === "index" || slug.endsWith("/index")) {
    return "/";
  }

  // Ensure it starts and ends with /
  return `/${slug}/`;
}

// Reading time estimation
export function getReadingTime(text) {
  if (!text) return "";
  const wordsPerMinute = 225;
  const wordCount = text.split(/\s+/g).length;
  const minutes = Math.floor(wordCount / wordsPerMinute);

  if (minutes <= 1) return "1 minute";
  return `${minutes} minutes`;
}

// Enhanced excerpt with multiple options
export function getExcerpt(content, options = {}) {
  if (!content) return "";
  let text = String(content);

  const defaults = {
    maxWords: 50,
    maxChars: null,
    stripHtml: true,
    endWithEllipsis: true,
  };
  const config = { ...defaults, ...options };

  // Strip HTML
  if (config.stripHtml) {
    text = text.replace(/<[^>]*>/g, " ");
  }

  // Clean whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Max Chars
  if (config.maxChars && text.length > config.maxChars) {
    text = text.substring(0, config.maxChars);
    if (config.endWithEllipsis) text += "…";
    return text;
  }

  // Max Words
  if (config.maxWords) {
    const words = text.split(/\s+/);
    if (words.length > config.maxWords) {
      text = words.slice(0, config.maxWords).join(" ");
      if (config.endWithEllipsis) text += "…";
    }
  }

  return text;
}

// Date formatting utilities
export function formatDate(date, format = "iso") {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";

  if (format === "iso") return d.toISOString();
  if (format === "html") return d.toISOString().split("T")[0];
  if (format === "dot") {
    const year = String(d.getFullYear()).slice(-2);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }
  return d.toLocaleDateString();
}

// Extract first image URL from content
export function extractFirstImage(content) {
  if (typeof content !== "string") return null;
  const match = content.match(/<img[^>]*src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

// Get first paragraph from content (handles both HTML and Markdown)
export function firstParagraph(content) {
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
}

// Word-limited excerpt (handles Markdown)
export function excerptWords(content, maxWords = 30) {
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
}

// Remove specific HTML tags
export function removeTags(content, tags = "p") {
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
      regex = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, "gs");
    }
    result = result.replace(regex, "");
  });

  return result;
}

// Keep only specific HTML tags
export function filterTags(content, tags = "p") {
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
      regex = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, "gs");
    }
    const found = source.match(regex);
    if (found) {
      matches = matches.concat(found);
    }
  });

  return matches.join("");
}

// Remove empty HTML tags
export function removeEmptyTags(content) {
  if (!content) return "";
  let result = String(content);
  // This regex finds tags that are empty or contain only whitespace.
  return result.replace(/<(\w+)[^>]*>\s*<\/\1>/g, "");
}

// Strip HTML tags, return only the tags
export function stripText(content) {
  if (!content) return "";
  const tags = String(content).match(/<[^>]*>/g);
  return tags ? tags.join("") : "";
}

// Keep only <p> tags containing an <img> tag
export function keepParagraphsWithImages(content) {
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
}

// Get content from first image onwards
export function sliceFromFirstImage(content) {
  if (!content) return "";
  const source = String(content);
  const startIndex = source.search(/<p[^>]*>\s*<img/);
  return startIndex !== -1 ? source.slice(startIndex) : "";
}

// Get content before first image
export function sliceBeforeFirstImage(content) {
  if (!content) return "";
  const source = String(content);
  const endIndex = source.search(/<p[^>]*>\s*<img/);
  return endIndex !== -1 ? source.slice(0, endIndex) : source;
}

// Count words in text
export function numberOfWords(text) {
  if (typeof text !== "string") return 0;
  return text.trim().length ? text.trim().split(/\s+/).length : 0;
}

// Split text by separator
export function splitText(text, separator = ",") {
  if (typeof text !== "string") {
    return text;
  }
  return text.split(separator);
}

// Filter array by property path
export function filterData(arr, propertyPath, value) {
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
}

// Check if URL is external
export function isExternal(url) {
  if (typeof url !== "string") {
    return false;
  }
  return url.startsWith("http://") || url.startsWith("https://");
}

// Extract year from date
export function getYear(date) {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return "";
  return String(d.getFullYear());
}

/**
 * Deep merge two objects recursively
 * Options take precedence over defaults
 *
 * @param {Object} target - Base object (defaults)
 * @param {Object} source - Object to merge (overrides)
 * @returns {Object} Merged object with all nested properties
 *
 * @example
 * deepMerge(
 *   { db: { host: 'localhost', port: 5432 } },
 *   { db: { port: 3306 } }
 * )
 * // Returns: { db: { host: 'localhost', port: 3306 } }
 */
export function deepMerge(target = {}, source = {}) {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    // Recursively merge objects (but not arrays or null)
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      sourceValue !== null &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue) &&
      targetValue !== null
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Otherwise, source takes precedence
      result[key] = sourceValue;
    }
  }

  return result;
}
