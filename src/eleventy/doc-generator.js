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
    // First run, always regenerate
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
 * 11ty plugin for generating documentation from JSDoc comments
 * Runs during build to create Markdown documentation files
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
    layout = "component",
  } = options;

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Calculate URL path from outputDir
  // e.g., "content/docs" -> "/docs", "content/docs/generated" -> "/docs/generated"
  const urlPath = "/" + outputDir.split("/").slice(1).join("/");

  // Add before hook to generate docs before build
  eleventyConfig.on("eleventy.before", async () => {
    // Check if source files have changed
    const hasChanged = await sourceFilesChanged(patterns);

    if (!hasChanged) {
      // Source files haven't changed, skip regeneration
      return;
    }

    // Resolve patterns relative to project root
    // Prepend sourceDir if patterns don't already include it
    const absolutePatterns = patterns.map((p) => {
      const fullPattern = p.startsWith(sourceDir) ? p : `${sourceDir}/${p}`;
      return path.resolve(projectRoot, fullPattern);
    });

    const parser = new DocParser({
      sourceDir,
      patterns: absolutePatterns,
    });
    const docs = await parser.parse();

    // Generate Markdown files for each documented component
    await generateMarkdownDocs(docs, outputDir, layout, urlPath);

    // Generate index/category pages
    await generateIndexPages(docs, outputDir, layout, urlPath);

    // Save hash after successful generation
    await saveSourceHash(patterns);
  });

  // Add the generated docs directory as a collection
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

async function generateMarkdownDocs(docs, outputDir, layout, urlPath) {
  for (const doc of docs) {
    const markdown = generateComponentMarkdown(doc, layout, urlPath);
    const filename = `${doc.name.replace(/\s+/g, "-").toLowerCase()}.md`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }
}

async function generateIndexPages(docs, outputDir, layout, urlPath) {
  // Group by category
  const grouped = {};

  for (const doc of docs) {
    const category = doc.category || "Utilities";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  }

  // Generate category index pages
  for (const [category, items] of Object.entries(grouped)) {
    const categorySlug = category.replace(/\s+/g, "-").toLowerCase();
    const markdown = generateCategoryMarkdown(category, items, layout, urlPath);
    const filepath = path.join(outputDir, `_${categorySlug}-index.md`);

    fs.writeFileSync(filepath, markdown, "utf-8");
  }

  // Also pass urlPath to generateIndexPages caller
  // (Already being passed above)

  // Generate main index
  const mainIndex = generateMainIndexMarkdown(grouped, layout, urlPath);
  fs.writeFileSync(path.join(outputDir, "index.md"), mainIndex, "utf-8");
}

function generateComponentMarkdown(doc, layout, urlPath) {
  const componentSlug = doc.name.replace(/\s+/g, "-").toLowerCase();

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

  // Description
  if (doc.description) {
    markdown += `${doc.description}\n\n`;
  }

  // Properties/Parameters
  if (doc.props.length > 0) {
    markdown += "## Properties\n\n";
    markdown += "| Name | Type | Description |\n";
    markdown += "|------|------|-------------|\n";

    for (const prop of doc.props) {
      markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.description} |\n`;
    }
    markdown += "\n";
  }

  // Parameters
  if (doc.params.length > 0) {
    markdown += "## Parameters\n\n";
    markdown += "| Name | Type | Description |\n";
    markdown += "|------|------|-------------|\n";

    for (const param of doc.params) {
      markdown += `| \`${param.name}\` | \`${param.type}\` | ${param.description} |\n`;
    }
    markdown += "\n";
  }

  // Return value
  if (doc.returns) {
    markdown += "## Returns\n\n";
    markdown += `**Type:** \`${doc.returns.type}\`\n\n`;
    if (doc.returns.description) {
      markdown += `${doc.returns.description}\n\n`;
    }
  }

  // Examples
  if (doc.examples.length > 0) {
    markdown += "## Examples\n\n";

    for (let i = 0; i < doc.examples.length; i++) {
      if (i > 0) markdown += "\n";
      markdown += `\`\`\`${doc.type}\n${doc.examples[i]}\n\`\`\`\n`;
    }
    markdown += "\n";
  }

  // Related/See also
  if (doc.see.length > 0) {
    markdown += "## See Also\n\n";
    for (const link of doc.see) {
      markdown += `- ${link}\n`;
    }
    markdown += "\n";
  }

  // Source reference
  markdown += `\n---\n\n`;
  markdown += `**Source:** \`${doc.source}\`\n`;

  return markdown;
}

function generateCategoryMarkdown(category, items, layout, urlPath) {
  const categorySlug = category.replace(/\s+/g, "-").toLowerCase();

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

  for (const item of items) {
    const itemSlug = item.name.replace(/\s+/g, "-").toLowerCase();
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

    for (const item of items) {
      const itemSlug = item.name.replace(/\s+/g, "-").toLowerCase();
      const itemLink = `${urlPath}/${itemSlug}/`;
      markdown += `- [${item.name}](${itemLink})\n`;
    }

    markdown += "\n";
  }

  return markdown;
}

export { DocParser, generateComponentMarkdown, generateCategoryMarkdown };
