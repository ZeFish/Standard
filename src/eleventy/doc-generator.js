import { DocParser } from "./doc-parser.js";
import path from "path";
import fs from "fs";
import { glob } from "glob";
import { fileURLToPath } from "url";
import crypto from "crypto";

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

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const urlPath = "/" + outputDir.split("/").slice(1).join("/");

  eleventyConfig.on("eleventy.before", async () => {
    console.log("[Doc Generator] eleventy.before hook triggered");
    const hasChanged = await sourceFilesChanged(patterns);

    if (!hasChanged) {
      console.log("[Doc Generator] No changes detected, skipping");
      return;
    }

    console.log("[Doc Generator] Changes detected, regenerating docs");
    const absolutePatterns = patterns.map((p) => {
      const fullPattern = p.startsWith(sourceDir) ? p : `${sourceDir}/${p}`;
      return path.resolve(projectRoot, fullPattern);
    });

    const parser = new EnhancedDocParser({
      sourceDir,
      patterns: absolutePatterns,
    });

    console.log("[Doc Generator] Starting parse...");
    const docs = await parser.parse();
    console.log(`[Doc Generator] Parsed ${docs.length} docs`);

    console.log("[Doc Generator] Generating markdown docs...");
    await generateMarkdownDocs(docs, outputDir, layout, urlPath);
    console.log("[Doc Generator] Generating index pages...");
    await generateIndexPages(docs, outputDir, layout, urlPath);
    console.log("[Doc Generator] Saving hash...");
    await saveSourceHash(patterns);
    console.log("[Doc Generator] Done!");
  });

  eleventyConfig.addCollection("docs", function (collection) {
    const docsDir = path.join(process.cwd(), outputDir);

    if (!fs.existsSync(docsDir)) {
      return [];
    }

    const markdownFiles = fs.readdirSync(docsDir);
    const docs = [];

    for (const file of markdownFiles) {
      if (file.endsWith(".md")) {
        const filePath = path.join(docsDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const componentSlug = file.replace(".md", "");
        const url = `${urlPath}/${componentSlug}/`;

        docs.push({
          title: componentSlug,
          url,
          content,
        });
      }
    }

    return docs;
  });
}

/**
 * Convert a name to kebab-case filename format
 * Handles: camelCase, spaces, special characters
 */
function nameToKebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → kebab-case
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[&]/g, "and") // & → and
    .replace(/[^a-z0-9-]/gi, "") // remove other special chars
    .toLowerCase();
}

async function generateMarkdownDocs(docs, outputDir, layout, urlPath) {
  for (const doc of docs) {
    // Only generate markdown for components, skip mixins and functions
    if (doc.kind === "mixin" || doc.kind === "function") {
      continue;
    }

    const markdown = generateComponentMarkdown(doc, layout, urlPath);
    const filename = `${nameToKebabCase(doc.name)}.md`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }
}

async function generateIndexPages(docs, outputDir, layout, urlPath) {
  const grouped = {};

  for (const doc of docs) {
    // Only include components in the index, exclude mixins and functions
    if (doc.kind === "mixin" || doc.kind === "function") {
      continue;
    }

    const category = doc.category || "Utilities";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  }

  for (const [category, items] of Object.entries(grouped)) {
    const categorySlug = category.replace(/\s+/g, "-").toLowerCase();
    const markdown = generateCategoryMarkdown(category, items, layout, urlPath);
    const filepath = path.join(outputDir, `_${categorySlug}-index.md`);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }

  const mainIndex = generateMainIndexMarkdown(grouped, layout, urlPath);
  fs.writeFileSync(path.join(outputDir, "index.md"), mainIndex, "utf-8");
}

function generateComponentMarkdown(doc, layout, urlPath) {
  const componentSlug = nameToKebabCase(doc.name);

  let markdown = "---\n";
  markdown += `title: ${doc.name}\n`;
  markdown += `layout: ${layout}\n`;
  markdown += `permalink: ${urlPath}/${componentSlug}/index.html\n`;
  markdown += `eleventyNavigation:\n`;
  markdown += `  key: ${doc.name}\n`;
  markdown += `  parent: ${doc.category || "API"}\n`;
  markdown += `  title: ${doc.name}\n`;
  markdown += `category: ${doc.category || "Utilities"}\n`;
  markdown += `type: ${doc.type}\n`;
  markdown += `source: ${doc.source}\n`;
  if (doc.since) markdown += `since: ${doc.since}\n`;
  if (doc.deprecated)
    markdown += `deprecated: ${doc.deprecated === true ? "yes" : doc.deprecated}\n`;
  markdown += "---\n\n";

  // Title
  markdown += `# ${doc.name}\n\n`;

  // Description with newline process
  if (doc.description) {
    markdown += `${doc.description
      .replace(/\n(- )/g, "<<<LIST>>>\n$1") // Mark list items
      .replace(/\n\n/g, "<<<PARAGRAPH>>>") // Mark paragraphs
      .replace(/\n/g, " ") // Remove single newlines
      .replace(/<<<LIST>>>/g, "\n") // Restore list newlines
      .replace(/<<<PARAGRAPH>>>/g, "\n\n")}\n\n`; // Restore paragraphs
  }

  // Examples
  if (doc.examples.length > 0) {
    for (let i = 0; i < doc.examples.length; i++) {
      if (i > 0) markdown += "\n";
      markdown += `\`\`\`${doc.type}\n${doc.examples[i]}\n\`\`\`\n`;
    }
    markdown += "\n";
  }

  // Properties/Parameters
  if (doc.props.length > 0) {
    markdown += "### Properties\n\n";
    markdown += "| Name | Type | Description |\n";
    markdown += "|------|------|-------------|\n";

    for (const prop of doc.props) {
      markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.description} |\n`;
    }
    markdown += "\n";
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

  // Return value
  if (doc.returns) {
    markdown += "### Returns\n\n";
    markdown += `**Type:** \`${doc.returns.type}\`\n\n`;
    if (doc.returns.description) {
      markdown += `${doc.returns.description}\n\n`;
    }
  }

  if (doc.code) {
    const codeLanguage = doc.type === "scss" ? "scss" : "javascript";
    markdown += "<details>\n";
    markdown +=
      '<summary><span class="button">Source Code</span></summary>\n\n';
    markdown += `\`\`\`${codeLanguage}\n`;
    markdown += doc.code;
    markdown += "\n\`\`\`\n\n";
    markdown += "</details>\n\n";
  }

  // Related/See also
  if (doc.see.length > 0) {
    markdown += "### See Also\n\n";
    for (const link of doc.see) {
      markdown += `- ${link}\n`;
    }
    markdown += "\n";
  }

  // Source reference
  /*
  markdown += `\n---\n\n`;
  markdown += `**Source:** \`${doc.source}\`\n`;
  */

  return markdown;
}

function generateCategoryMarkdown(category, items, layout, urlPath) {
  const categorySlug = nameToKebabCase(category);

  let markdown = "---\n";
  markdown += `title: ${category}\n`;
  markdown += `layout: ${layout}\n`;
  markdown += `permalink: ${urlPath}/${categorySlug}/index.html\n`;
  markdown += `eleventyNavigation:\n`;
  markdown += `  key: ${category}\n`;
  markdown += `  title: ${category}\n`;
  markdown += "---\n\n";

  markdown += `# ${category}\n\n`;
  markdown += `Documentation for ${category.toLowerCase()} components and utilities.\n\n`;

  markdown += "## Components\n\n";

  // Deduplicate items by name to avoid duplicate entries
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
    markdown += `- [${item.name}](${itemLink}) - ${item.description || "No description"}\n`;
  }

  markdown += "\n";

  return markdown;
}

function generateMainIndexMarkdown(grouped, layout, urlPath) {
  let markdown = "---\n";
  markdown += "title: API Reference\n";
  markdown += `layout: ${layout}\n`;
  markdown += "eleventyNavigation:\n";
  markdown += "  key: API Reference\n";
  markdown += "  title: API Reference\n";
  markdown += "---\n\n";

  markdown += "# API Reference\n\n";
  markdown += "Auto-generated documentation from source code comments.\n\n";

  for (const [category, items] of Object.entries(grouped)) {
    markdown += `## ${category}\n\n`;

    // Deduplicate items by name to avoid duplicate entries
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
  generateComponentMarkdown,
  generateCategoryMarkdown,
  nameToKebabCase,
};
