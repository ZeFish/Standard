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

      // Skip if not a documentation comment (must have @component, @prop, @param, etc.)
      if (
        !/@(component|prop|param|return|category|description|example)/i.test(
          commentBlock,
        )
      ) {
        continue;
      }

      const doc = this.parseCommentBlock(commentBlock, filePath);

      if (doc && doc.name) {
        docs.push(doc);
      }
    }

    return docs;
  }

  parseCommentBlock(block, filePath) {
    const doc = {
      source: filePath,
      type: this.getType(filePath),
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
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter((line) => line.length > 0);

    let currentTag = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith("@")) {
        // Process previous tag's content
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
        currentContent.push(line);
      } else {
        // Description lines before any tags
        if (!doc.description) {
          doc.description = line;
        } else {
          doc.description += " " + line;
        }
      }
    }

    // Process last tag
    if (currentTag) {
      this.processTag(doc, currentTag, currentContent.join("\n"));
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
