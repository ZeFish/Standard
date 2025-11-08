import { DocParser } from "./doc-parser.js";
import path from "path";
import fs from "fs";
import { glob } from "glob";
import { fileURLToPath } from "url";
import crypto from "crypto";
import Logger from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../");

const HASH_FILE = ".doc-generator-hash";

/**
 * Compute hash of source files to detect changes
 */
async function computeSourceHash(patterns) {
  const files = [];
  for (const pattern of patterns) {
    const absolutePattern = path.resolve(projectRoot, pattern);
    const matched = await glob(absolutePattern);
    files.push(...matched.sort());
  }

  const hasher = crypto.createHash("sha256");

  for (const file of files) {
    const stats = fs.statSync(file);
    const content = fs.readFileSync(file, "utf-8");
    hasher.update(file);
    hasher.update(content);
    hasher.update(String(stats.mtimeMs));
  }

  return hasher.digest("hex");
}

/**
 * Check if source files have changed since last generation
 */
async function sourceFilesChanged(patterns) {
  const currentHash = await computeSourceHash(patterns);

  if (!fs.existsSync(HASH_FILE)) {
    return true;
  }

  const lastHash = fs.readFileSync(HASH_FILE, "utf-8").trim();
  return currentHash !== lastHash;
}

/**
 * Save hash of current source files
 */
async function saveSourceHash(patterns) {
  const hash = await computeSourceHash(patterns);
  fs.writeFileSync(HASH_FILE, hash, "utf-8");
}

/**
 * Extract all code following a doc comment until the next doc comment or EOF
 */
function extractCodeAfterComment(content, commentEndIndex, filePath) {
  // Skip whitespace and regular comments after doc comment
  let pos = commentEndIndex;
  while (pos < content.length) {
    // Skip whitespace
    if (/\s/.test(content[pos])) {
      pos++;
      continue;
    }

    // Skip single-line comments
    if (content[pos] === "/" && content[pos + 1] === "/") {
      while (pos < content.length && content[pos] !== "\n") {
        pos++;
      }
      if (content[pos] === "\n") pos++;
      continue;
    }

    // Skip multi-line comments (but NOT doc comments)
    if (content[pos] === "/" && content[pos + 1] === "*") {
      // Check if it's a doc comment (/**)
      if (content[pos + 2] === "*") {
        // This is a doc comment, stop here
        break;
      }
      // Regular comment, skip it
      while (
        pos < content.length &&
        !(content[pos] === "*" && content[pos + 1] === "/")
      ) {
        pos++;
      }
      if (content[pos] === "*" && content[pos + 1] === "/") {
        pos += 2;
      }
      continue;
    }

    // Found actual code
    break;
  }

  // Find the end: either the next doc comment or EOF
  let endPos = pos;
  while (endPos < content.length) {
    // Look for next doc comment
    if (
      content[endPos] === "/" &&
      content[endPos + 1] === "*" &&
      content[endPos + 2] === "*"
    ) {
      break;
    }
    endPos++;
  }

  // Extract and trim trailing whitespace
  let code = content.substring(pos, endPos).trim();

  return code || null;
}

/**
 * Enhanced DocParser wrapper that extracts code
 */
class EnhancedDocParser extends DocParser {
  /**
   * Infer the kind of documentation item from the code that follows the comment
   */
  inferKindFromContext(content, commentEndIndex) {
    // Skip whitespace after comment
    let pos = commentEndIndex;
    while (pos < content.length && /\s/.test(content[pos])) {
      pos++;
    }

    const remaining = content.substring(pos, pos + 500); // Look ahead 500 chars

    // Check for @mixin
    if (/@mixin\s+/.test(remaining)) {
      return "mixin";
    }

    // Check for @function
    if (/@function\s+/.test(remaining)) {
      return "function";
    }

    // Check for class definition (scss)
    if (/^\.\w+\s*\{/.test(remaining)) {
      return "component";
    }

    // Check for function/class definition (javascript)
    if (/^(export\s+)?(function|class|const|let)\s+/.test(remaining)) {
      return "function";
    }

    // Default to component if no inference
    return "component";
  }

  /**
   * Override parse to extract code and infer kinds for all docs
   */
  async parse() {
    const docs = await super.parse();

    // Ensure all docs have kind set, even if not explicitly in the base parser
    for (const doc of docs) {
      if (!doc.kind && doc.source) {
        try {
          const filePath = path.resolve(projectRoot, doc.source);
          const content = fs.readFileSync(filePath, "utf-8");

          // Find the doc comment
          const commentPattern = new RegExp(
            `/\\*\\*[\\s\\S]*?${escapeRegex(doc.name)}[\\s\\S]*?\\*/`,
            "g",
          );
          const match = commentPattern.exec(content);

          if (match) {
            const commentEndIndex = match.index + match[0].length;
            doc.kind = this.inferKindFromContext(content, commentEndIndex);
          }
        } catch (err) {
          // Silently fail - kind will remain null or get inferred later
        }
      }
    }

    // Now extract code and handle the enhanced parsing
    for (const doc of docs) {
      if (doc.source) {
        try {
          const filePath = path.resolve(projectRoot, doc.source);
          const content = fs.readFileSync(filePath, "utf-8");

          // Find the doc comment in the file
          const commentPattern = new RegExp(
            `/\\*\\*[\\s\\S]*?${escapeRegex(doc.name)}[\\s\\S]*?\\*/`,
            "g",
          );
          const match = commentPattern.exec(content);

          if (match) {
            const commentEndIndex = match.index + match[0].length;
            const code = extractCodeAfterComment(
              content,
              commentEndIndex,
              filePath,
            );

            if (code) {
              doc.code = code;
            }
          }
        } catch (err) {
          console.warn(`Could not extract code for ${doc.name}:`, err.message);
        }
      }
    }

    return docs;
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 11ty plugin for generating documentation from JSDoc comments
 */
export default function (eleventyConfig, options = {}) {
  const {
    sourceDir = "src",
    patterns = [
      `${sourceDir}/styles/**/*.scss`,
      `${sourceDir}/js/**/*.js`,
      `${sourceDir}/eleventy/**/*.js`,
    ],
    outputDir = "content/docs",
    layout = "base",
  } = options;

  const logger = Logger({
    scope: "DOC",
    verbose: options.verbose,
  });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const urlPath = "/docs/";

  eleventyConfig.on("eleventy.before", async () => {
    const hasChanged = await sourceFilesChanged(patterns);

    if (!hasChanged) {
      logger.debug("Unchanged, skipping...");
      return;
    }

    logger.info("Generating...");

    const absolutePatterns = patterns.map((p) => {
      const fullPattern = p.startsWith(sourceDir) ? p : `${sourceDir}/${p}`;
      return path.resolve(projectRoot, fullPattern);
    });

    const parser = new EnhancedDocParser({
      sourceDir,
      patterns: absolutePatterns,
    });

    const docs = await parser.parse();

    logger.debug(`Found ${docs.length} documented components`);

    await generateMarkdownDocs(docs, outputDir, layout, urlPath);
    await generateIndexPages(docs, outputDir, layout, urlPath);

    await saveSourceHash(patterns);

    logger.success("Generated");
  });

  eleventyConfig.addCollection("concepts", function (collection) {
    const conceptsDir = path.join(process.cwd(), outputDir);

    if (!fs.existsSync(conceptsDir)) {
      return [];
    }

    const markdownFiles = fs.readdirSync(conceptsDir);
    const concepts = [];

    for (const file of markdownFiles) {
      if (file.endsWith(".md") && !file.startsWith("_")) {
        const filePath = path.join(conceptsDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const conceptSlug = file.replace(".md", "");
        const url = `${urlPath}/${conceptSlug}/`;

        concepts.push({
          title: conceptSlug,
          url,
          content,
        });
      }
    }

    return concepts;
  });
}

/**
 * Convert a name to kebab-case filename format
 * Handles: camelCase, spaces, special characters
 */
function nameToKebabCase(name) {
  if (!name || typeof name !== "string") {
    return "unnamed";
  }

  return (
    name
      .split("\n")[0] // Only take first line
      .trim()
      .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → kebab-case
      .replace(/\s+/g, "-") // spaces → hyphens
      .replace(/[&:\/\\]/g, "") // & : / \ → removed
      .replace(/[^a-z0-9-]/gi, "") // remove other special chars
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-|-$/g, "") // trim leading/trailing hyphens
      .toLowerCase() || "unnamed"
  );
}

async function generateMarkdownDocs(docs, outputDir, layout, urlPath) {
  for (const doc of docs) {
    // Skip if no component name
    if (!doc.name) {
      continue;
    }

    const markdown = generateConceptMarkdown(doc, layout, urlPath, docs);
    const filename = `${nameToKebabCase(doc.name)}.md`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }
}

async function generateIndexPages(docs, outputDir, layout, urlPath) {
  const grouped = {};

  for (const doc of docs) {
    const category = doc.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  }

  // Generate category index pages
  for (const [category, items] of Object.entries(grouped)) {
    const categorySlug = nameToKebabCase(category);
    const markdown = generateCategoryMarkdown(category, items, layout, urlPath);
    const filepath = path.join(outputDir, `_${categorySlug}-index.md`);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }

  // Generate main index
  const mainIndex = generateMainIndexMarkdown(grouped, layout, urlPath);
  fs.writeFileSync(path.join(outputDir, "index.md"), mainIndex, "utf-8");
}

/**
 * Generate concept-driven documentation page
 */
function generateConceptMarkdown(doc, layout, urlPath, allDocs = []) {
  const conceptSlug = nameToKebabCase(doc.name);

  // Helper to escape YAML string values
  const escapeYamlString = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/\n/g, " ")
      .replace(/\r/g, "")
      .replace(/"/g, '\\"')
      .trim();
  };

  // Frontmatter
  let markdown = "---\n";
  markdown += `title: "${escapeYamlString(doc.name)}"\n`;
  markdown += `layout: "${layout}"\n`;
  markdown += `category: "${escapeYamlString(doc.category || "Uncategorized")}"\n`;
  markdown += `type: "${doc.type}"\n`;
  if (doc.since) markdown += `since: "${escapeYamlString(doc.since)}"\n`;
  markdown += "---\n\n";

  // Title
  markdown += `# ${doc.name}\n\n`;

  // CONCEPT SECTION (main essay)
  if (doc.concept) {
    markdown += formatLongFormContent(doc.concept);
    markdown += "\n\n";
  }

  // Regular description (if no concept)
  if (!doc.concept && doc.description) {
    markdown += formatLongFormContent(doc.description);
    markdown += "\n\n";
  }

  // THEORY SECTION
  if (doc.theory) {
    markdown += "## The Theory\n\n";
    markdown += formatLongFormContent(doc.theory);
    markdown += "\n\n";
  }

  // IMPLEMENTATION SECTION
  if (doc.implementation) {
    markdown += "## The Implementation\n\n";
    markdown += formatLongFormContent(doc.implementation);
    markdown += "\n\n";
  }

  // EXAMPLES
  if (doc.examples.length > 0) {
    markdown += "## Examples\n\n";

    for (const example of doc.examples) {
      const exampleData = parseExample(example);

      // Title
      if (exampleData.title) {
        markdown += `### ${exampleData.title}\n\n`;
      }

      // Render preview (for HTML examples)
      if (exampleData.language === "html") {
        markdown += `<div class="example-preview">\n${exampleData.code}\n</div>\n\n`;
      }

      // Code block
      markdown += `\`\`\`${exampleData.language}\n${exampleData.code}\n\`\`\`\n\n`;
    }
  }

  // API REFERENCE SECTION
  const hasApiContent =
    doc.variables.length > 0 ||
    doc.mixins.length > 0 ||
    doc.functions.length > 0 ||
    doc.classes.length > 0 ||
    doc.params.length > 0 ||
    doc.returns;

  if (hasApiContent) {
    markdown += "---\n\n";
    markdown += "## API Reference\n\n";

    // Variables
    if (doc.variables.length > 0) {
      markdown += "### Variables\n\n";
      for (const variable of doc.variables) {
        markdown += `#### ${variable.name} {#${nameToKebabCase(variable.name)}}\n\n`;
        if (variable.description) {
          markdown += `${variable.description}\n\n`;
        }
      }
    }

    // Mixins
    if (doc.mixins.length > 0) {
      markdown += "### Mixins\n\n";
      for (const mixin of doc.mixins) {
        markdown += `#### ${mixin.name} {#${nameToKebabCase(mixin.name)}}\n\n`;
        if (mixin.description) {
          markdown += `${mixin.description}\n\n`;
        }
      }
    }

    // Functions
    if (doc.functions.length > 0) {
      markdown += "### Functions\n\n";
      for (const func of doc.functions) {
        markdown += `#### ${func.name} {#${nameToKebabCase(func.name)}}\n\n`;
        if (func.description) {
          markdown += `${func.description}\n\n`;
        }
      }
    }

    // Classes
    if (doc.classes.length > 0) {
      markdown += "### Classes\n\n";
      for (const cls of doc.classes) {
        markdown += `#### ${cls.name} {#${nameToKebabCase(cls.name)}}\n\n`;
        if (cls.description) {
          markdown += `${cls.description}\n\n`;
        }
      }
    }

    // Parameters
    if (doc.params.length > 0) {
      markdown += "### Parameters\n\n";
      markdown += "| Name | Type | Description |\n";
      markdown += "|------|------|-------------|\n";
      for (const param of doc.params) {
        markdown += `| \`${param.name}\` | \`${param.type}\` | ${param.description} |\n`;
      }
      markdown += "\n";
    }

    // Returns
    if (doc.returns) {
      markdown += "### Returns\n\n";
      markdown += `**Type:** \`${doc.returns.type}\`\n\n`;
      if (doc.returns.description) {
        markdown += `${doc.returns.description}\n\n`;
      }
    }
  }

  // SOURCE CODE (collapsible)
  if (doc.code) {
    const lang = doc.type === "scss" ? "scss" : "javascript";
    markdown += `<details class="callout source-code">\n`;
    markdown += `<summary>View Source Code</summary>\n\n`;
    markdown += `\`\`\`${lang}\n${doc.code}\n\`\`\`\n\n`;
    markdown += `</details>\n\n`;
  }

  // RELATED CONCEPTS
  if (doc.related && doc.related.length > 0) {
    markdown += "---\n\n";
    markdown += "## Related Concepts\n\n";
    for (const related of doc.related) {
      const relatedSlug = nameToKebabCase(related);
      markdown += `- [${related}](${urlPath}/${relatedSlug}/)\n`;
    }
    markdown += "\n";
  }

  // FURTHER READING
  if (doc.reading && doc.reading.length > 0) {
    markdown += "## Further Reading\n\n";
    for (const link of doc.reading) {
      markdown += `- [${link.title}](${link.url})\n`;
    }
    markdown += "\n";
  }

  // SEE ALSO (legacy support)
  if (doc.see.length > 0) {
    markdown += "## See Also\n\n";
    for (const link of doc.see) {
      markdown += `- ${link}\n`;
    }
    markdown += "\n";
  }

  return markdown;
}

/**
 * Format long-form content (preserve paragraphs, clean up line breaks)
 */
function formatLongFormContent(content) {
  if (!content) return "";

  return content
    .split(/\n\n+/) // Split by double+ newlines (paragraph breaks)
    .map((para) => {
      // Check if this is a list (starts with -, *, or numbers)
      const isListBlock = /^[\s]*[-*]/.test(para) || /^[\s]*\d+\./.test(para);

      if (isListBlock) {
        // Preserve list formatting
        return para.trim();
      } else {
        // Regular paragraph - join lines with spaces
        return para.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      }
    })
    .filter((p) => p.length > 0)
    .join("\n\n");
}

/**
 * Parse example text to extract language, title, and code
 */
function parseExample(exampleText) {
  // Format: "language - title\ncode..."
  const match = exampleText.match(/^(\w+)\s*-\s*(.+?)\n([\s\S]+)$/);

  if (match) {
    return {
      language: match[1].trim(),
      title: match[2].trim(),
      code: match[3].trim(),
    };
  }

  // Try format: "language\ncode..." (no title)
  const langMatch = exampleText.match(/^(\w+)\n([\s\S]+)$/);
  if (langMatch) {
    return {
      language: langMatch[1].trim(),
      title: null,
      code: langMatch[2].trim(),
    };
  }

  // Default: treat as plain code
  return {
    language: "text",
    title: null,
    code: exampleText.trim(),
  };
}

function generateCategoryMarkdown(category, items, layout, urlPath) {
  const categorySlug = nameToKebabCase(category);

  let markdown = "---\n";
  markdown += `title: "${category}"\n`;
  markdown += `layout: "${layout}"\n`;
  markdown += "---\n\n";

  markdown += `# ${category}\n\n`;

  // Deduplicate items
  const seenNames = new Set();
  const uniqueItems = [];

  for (const item of items) {
    if (!seenNames.has(item.name)) {
      seenNames.add(item.name);
      uniqueItems.push(item);
    }
  }

  for (const item of uniqueItems) {
    const itemSlug = nameToKebabCase(item.name);
    const itemLink = `${urlPath}/${itemSlug}/`;
    const description = item.concept
      ? item.concept.split("\n")[0]
      : item.description || "No description";
    markdown += `- [**${item.name}**](${itemLink}) — ${description}\n`;
  }

  markdown += "\n";

  return markdown;
}

function generateMainIndexMarkdown(grouped, layout, urlPath) {
  let markdown = "---\n";
  markdown += 'title: "Concepts"\n';
  markdown += `layout: "${layout}"\n`;
  markdown += "---\n\n";

  markdown += "# Concepts\n\n";
  markdown +=
    "Learn typography, color theory, and layout design through working code.\n\n";

  for (const [category, items] of Object.entries(grouped)) {
    markdown += `## ${category}\n\n`;

    // Deduplicate
    const seenNames = new Set();
    const uniqueItems = [];

    for (const item of items) {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        uniqueItems.push(item);
      }
    }

    for (const item of uniqueItems) {
      const itemSlug = nameToKebabCase(item.name);
      const itemLink = `${urlPath}/${itemSlug}/`;
      markdown += `- [${item.name}](${itemLink})\n`;
    }

    markdown += "\n";
  }

  return markdown;
}

export {
  EnhancedDocParser as DocParser,
  generateConceptMarkdown,
  generateCategoryMarkdown,
  nameToKebabCase,
};
