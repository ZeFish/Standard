import fs from "fs";
import path from "path";
import { glob } from "glob";

/**
 * JSDoc-style documentation parser for SCSS and JavaScript files
 * Extracts structured documentation from code comments
 *
 * Expected format:
 * /**
 *  * @component ComponentName
 *  * @description Short description
 *  * @category Category Name
 *  * @example
 *  *   Code example here
 *  * @param {type} name Description
 *  * @prop {type} name Description
 *  * @return {type} Description
 *  * @deprecated Reason if deprecated
 *  * @see Related files
 *  * @since 0.10.0
 *  * /
 */

export class DocParser {
  constructor(options = {}) {
    this.sourceDir = options.sourceDir || "src";
    this.patterns = options.patterns || [
      "src/styles/**/*.scss",
      "src/js/**/*.js",
    ];
    this.docs = [];
  }

  async parse() {
    this.docs = [];

    for (const pattern of this.patterns) {
      const files = await glob(pattern);

      for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        const docs = this.parseFile(file, content);
        this.docs.push(...docs);
      }
    }

    return this.docs;
  }

  parseFile(filePath, content) {
    const docs = [];

    // Match JSDoc-style comments: /** ... */
    const docRegex = /\/\*\*\s*([\s\S]*?)\*\//g;
    let match;

    while ((match = docRegex.exec(content)) !== null) {
      const commentBlock = match[1];

      // Skip if just a separator comment (e.g., /* === */)
      if (/^[\s=*\-]+$/.test(commentBlock.trim())) {
        continue;
      }

      // Skip if not a documentation comment (must have @component, @prop, @param, etc.)
      if (
        !/@(component|prop|param|return|category|description|example|mixin|function|name)/i.test(
          commentBlock,
        )
      ) {
        continue;
      }

      const doc = this.parseCommentBlock(commentBlock, filePath);

      if (doc && doc.name) {
        // If no explicit @component tag and has params, infer kind from following code
        if (!doc.kind && doc.params.length > 0) {
          const commentEndIndex = match.index + match[0].length;
          doc.kind = this.inferKindFromFollowingCode(content, commentEndIndex);
        }

        docs.push(doc);
      }
    }

    return docs;
  }

  inferKindFromFollowingCode(content, commentEndIndex) {
    let pos = commentEndIndex;
    while (pos < content.length && /\s/.test(content[pos])) {
      pos++;
    }

    const remaining = content.substring(pos, pos + 500);

    // Check for @mixin
    if (/@mixin\s+/.test(remaining)) {
      return "mixin";
    }

    // Check for @function
    if (/@function\s+/.test(remaining)) {
      return "function";
    }

    // Default to component
    return "component";
  }

  parseCommentBlock(block, filePath, fileContent = null, commentIndex = -1) {
    const doc = {
      source: filePath,
      type: this.getType(filePath),
      kind: null, // Track what kind of item this is (component, mixin, function, etc.)
      name: null,
      description: null,
      category: null,
      params: [],
      props: [],
      returns: null,
      examples: [],
      see: [],
      since: null,
      deprecated: null,
      tags: [],
    };

    // Remove comment markers and normalize lines
    const lines = block
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim());

    // Identify metadata tags and narrative sections
    const metadataTags = [
      "name",
      "group",
      "author",
      "since",
      "category",
      "type",
    ];

    // Find where metadata ends and narrative begins
    let narrativeStart = 0;
    let narrativeEnd = lines.length;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("@")) {
        const tagName = line.match(/@(\w+)/)?.[1]?.toLowerCase();
        // Once we hit a non-metadata tag, narrative ends
        if (!metadataTags.includes(tagName)) {
          narrativeEnd = i;
          break;
        }
      } else if (line.trim().length > 0 && narrativeStart === 0) {
        // First non-empty, non-tag line after metadata is where narrative starts
        if (i > 0 && lines[i - 1].startsWith("@")) {
          narrativeStart = i;
        }
      }
    }

    // Collect narrative content
    const narrativeContent = [];
    for (let i = narrativeStart; i < narrativeEnd; i++) {
      const line = lines[i];
      if (!line.startsWith("@")) {
        narrativeContent.push(line);
      }
    }

    // Process all lines for tags and remaining content
    let currentTag = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("@")) {
        // Process previous tag
        if (currentTag) {
          this.processTag(doc, currentTag, currentContent.join("\n"));
        }

        // Start new tag
        const tagMatch = line.match(/@(\w+)\s*(.*)/);
        if (tagMatch) {
          currentTag = tagMatch[1].toLowerCase();
          currentContent = [tagMatch[2]];
        }
      } else if (currentTag) {
        // Collect tag content
        currentContent.push(line);
      }
    }

    // Process last tag
    if (currentTag) {
      this.processTag(doc, currentTag, currentContent.join("\n"));
    }

    // Set description from narrative content
    if (narrativeContent.length > 0) {
      doc.description = narrativeContent
        .map((l) => l.trim())
        .filter((l, idx, arr) => {
          // Keep non-empty or lines between content
          return l.length > 0 || (idx > 0 && idx < arr.length - 1);
        })
        .join("\n")
        .trim();
    }

    // Set component name from @component or infer from filename
    if (!doc.name) {
      const filename = path.basename(filePath, path.extname(filePath));
      doc.name = this.formatName(filename);
    }

    return doc;
  }

  processTag(doc, tag, content) {
    content = content.trim();

    switch (tag) {
      case "component":
        doc.kind = "component";
        doc.name = content;
        break;

      case "mixin":
        doc.kind = "mixin";
        doc.name = content;
        break;

      case "function":
        doc.kind = "function";
        doc.name = content;
        break;

      case "name":
        doc.name = content;
        break;

      case "description":
      case "desc":
        doc.description = content;
        break;

      case "category":
      case "cat":
        doc.category = content;
        break;

      case "param":
      case "parameter":
        doc.params.push(this.parseParamTag(content));
        break;

      case "prop":
      case "property":
        doc.props.push(this.parseParamTag(content));
        break;

      case "return":
      case "returns":
        doc.returns = this.parseReturnTag(content);
        break;

      case "example":
        // Examples can span multiple lines
        if (content) {
          doc.examples.push(content.trim());
        }
        break;

      case "see":
        doc.see.push(content);
        break;

      case "since":
        doc.since = content;
        break;

      case "deprecated":
        doc.deprecated = content || true;
        break;

      default:
        // Store unknown tags
        doc.tags.push({ name: tag, value: content });
    }
  }

  parseParamTag(content) {
    const typeMatch = content.match(/^\s*\{([^}]+)\}\s+(\w+)\s*(.*)/);

    if (typeMatch) {
      return {
        type: typeMatch[1].trim(),
        name: typeMatch[2].trim(),
        description: typeMatch[3].trim(),
      };
    }

    // Try to parse name and description without type
    const nameMatch = content.match(/^(\w+)\s*(.*)/);
    if (nameMatch) {
      return {
        type: "mixed",
        name: nameMatch[1].trim(),
        description: nameMatch[2].trim(),
      };
    }

    return { type: "mixed", name: content, description: "" };
  }

  parseReturnTag(content) {
    const typeMatch = content.match(/^\{([^}]+)\}\s*(.*)/);

    if (typeMatch) {
      return {
        type: typeMatch[1].trim(),
        description: typeMatch[2].trim(),
      };
    }

    return {
      type: "mixed",
      description: content,
    };
  }

  getType(filePath) {
    if (filePath.endsWith(".scss")) return "scss";
    if (filePath.endsWith(".js")) return "js";
    return "unknown";
  }

  formatName(filename) {
    return filename
      .replace(/^standard-\d+-/, "") // Remove prefix like "standard-03-"
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  groupByCategory() {
    const grouped = {};

    for (const doc of this.docs) {
      const category = doc.category || "Uncategorized";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(doc);
    }

    return grouped;
  }

  filterByType(type) {
    return this.docs.filter((doc) => doc.type === type);
  }
}

export default DocParser;
