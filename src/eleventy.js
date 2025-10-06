module.exports = function (eleventyConfig, options = {}) {
  // Options with defaults
  const {
    // Output directory for copied files (relative to output folder)
    outputDir = "assets/standard",
    // Whether to copy files from node_modules
    copyFiles = true,
    // Whether to use CDN instead of local files
    useCDN = false,
  } = options;

  // Add passthrough copy from node_modules using relative path
  if (copyFiles && !useCDN) {
    eleventyConfig.addPassthroughCopy({
      "node_modules/@zefish/standard/dist/standard.min.css": `${outputDir}/standard.min.css`,
      "node_modules/@zefish/standard/dist/standard.min.js": `${outputDir}/standard.min.js`,
      "node_modules/@zefish/standard/dist/standard.system.js": `${outputDir}/standard.system.js`,
    });
  }
  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardFonts", function () {
    return `<link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("metaMobile", function () {
    return `<!-- Mobile -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`;
  });

  // Shortcode to include Standard CSS and JS from local files
  eleventyConfig.addShortcode("standardAssets", function () {
    if (useCDN) {
      return `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
    }
    return `<link href="/${outputDir}/standard.min.css" rel="stylesheet">
<script src="/${outputDir}/standard.min.js" type="module"></script>`;
  });

  // Shortcode to include only CSS
  eleventyConfig.addShortcode("standardSystem", function () {
    if (useCDN) {
      return `<link href="https://unpkg.com/@zefish/standard/system" rel="stylesheet">`;
    }
    return `<link href="/${outputDir}/standard.system.js" rel="stylesheet">`;
  });

  // Shortcode to include only CSS
  eleventyConfig.addShortcode("standardCSS", function () {
    if (useCDN) {
      return `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">`;
    }
    return `<link href="/${outputDir}/standard.min.css" rel="stylesheet">`;
  });

  // Shortcode to include only JS
  eleventyConfig.addShortcode("standardJS", function () {
    if (useCDN) {
      return `<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
    }
    return `<script src="/${outputDir}/standard.min.js" type="module"></script>`;
  });

  // Legacy shortcode for CDN (deprecated but kept for backward compatibility)
  eleventyConfig.addShortcode("standardUnpkg", function () {
    return `<link href="https://unpkg.com/@zefish/standard" rel="stylesheet">
<script src="https://unpkg.com/@zefish/standard/js" type="module"></script>`;
  });

  // Extract first image from content
  eleventyConfig.addFilter("extract_first_image", (content) => {
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
  eleventyConfig.addFilter("remove_tags", (content, tags = "p") => {
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
  eleventyConfig.addFilter("keep_only_tags", (content, tags = "p") => {
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
  eleventyConfig.addFilter("remove_empty_tags", (content) => {
    if (!content) return "";
    // This regex finds tags that are empty or contain only whitespace.
    return content.replace(/<(\w+)[^>]*>\s*<\/(\1)>/g, "");
  });

  // Convert newlines to <br> tags
  eleventyConfig.addFilter("newline_to_br", (str) => {
    if (!str) return "";

    // Only replace newlines that are inside <p> tags
    return str.replace(/<p>(.*?)<\/p>/gs, (match, pContent) => {
      const withBr = pContent.replace(/\n/g, "<br>\n");
      return `<p>${withBr}</p>`;
    });
  });

};
