import fs from "fs";
import path from "path";
import { glob } from "glob";

/**
 * Documentation parser for concept-driven documentation
 * Extracts structured documentation from code comments
 *
 * Expected format:
 * /**
 * @component ComponentName
 * @category Category Name
 *
 * @concept
 * Long-form essay content here.
 * Multiple paragraphs supported.
 *
 * @theory
 * Theory section content.
 *
 * @implementation
 * Implementation details.
 *
 * @variable $name - Description
 * @mixin name - Description
 * @function name - Description
 * @class .name - Description
 *
 * @example html - Title
 * <div>Example code</div>
 *
 * @related concept-one, concept-two
 * @reading https://url.com Title
 * /
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

    // Match doc comments: /** ... */
    const docRegex = /\/\*\*\s*([\s\S]*?)\*\//g;
    let match;

    while ((match = docRegex.exec(content)) !== null) {
      const commentBlock = match[1];

      // Skip if just a separator comment (e.g., /* === */)
      if (/^[\s=*\-]+$/.test(commentBlock.trim())) {
        continue;
      }

      // Skip if not a documentation comment (must have @component or other doc tags)
      if (
        !/@(component|concept|theory|implementation|variable|mixin|function|class|category|example)/i.test(
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
      kind: null,
      name: null,
      description: null,
      category: null,
      concept: null,
      theory: null,
      implementation: null,
      variables: [],
      mixins: [],
      functions: [],
      classes: [],
      params: [],
      props: [],
      returns: null,
      examples: [],
      related: [],
      reading: [],
      see: [],
      since: null,
      deprecated: null,
      tags: [],
    };

    // Remove leading/trailing whitespace and split into lines
    // Handle both formats: with * and without *
    const lines = block
      .split("\n")
      .map((line) => {
        // Remove leading * if present, otherwise just trim
        return line.replace(/^\s*\*\s?/, "").trim();
      })
      .filter((line) => line.length > 0); // Remove empty lines

    // Process lines
    let currentTag = null;
    let currentContent = [];

    for (const line of lines) {
      // Check if line starts with @ (position 0 after trim)
      if (line.startsWith("@")) {
        // Process previous tag
        if (currentTag) {
          this.processTag(doc, currentTag, currentContent.join("\n"));
        }

        // Parse new tag
        const match = line.match(/^@(\w+)(?:\s+(.*))?$/);
        if (match) {
          currentTag = match[1].toLowerCase();
          currentContent = match[2] ? [match[2]] : [];
        }
      } else {
        // Accumulate content for current tag
        if (currentTag) {
          currentContent.push(line);
        }
      }
    }

    // Process last tag
    if (currentTag) {
      this.processTag(doc, currentTag, currentContent.join("\n"));
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

      case "name":
        doc.name = content;
        break;

      case "description":
      case "desc":
        doc.description = content;
        break;

      case "category":
      case "cat":
        doc.category = content.split("\n")[0].trim();
        break;

      // NEW: Long-form content tags
      case "concept":
        doc.concept = content;
        break;

      case "theory":
        doc.theory = content;
        break;

      case "implementation":
        doc.implementation = content;
        break;

      // NEW: Multi-value reference tags
      case "variable":
        doc.variables.push(this.parseReferenceTag(content));
        break;

      case "mixin":
        doc.kind = doc.kind || "mixin"; // Set kind if not already set
        doc.mixins.push(this.parseReferenceTag(content));
        break;

      case "function":
        doc.kind = doc.kind || "function"; // Set kind if not already set
        doc.functions.push(this.parseReferenceTag(content));
        break;

      case "class":
        doc.classes.push(this.parseReferenceTag(content));
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
        if (content) {
          doc.examples.push(content.trim());
        }
        break;

      // NEW: Related concepts (comma-separated)
      case "related":
        doc.related = content
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        break;

      // NEW: External reading (URL + title)
      case "reading":
        doc.reading.push(this.parseReadingTag(content));
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

  // NEW: Parse reference tags (format: "name - description")
  parseReferenceTag(content) {
    const match = content.match(/^([^\s-]+)\s*-\s*(.*)$/);

    if (match) {
      return {
        name: match[1].trim(),
        description: match[2].trim(),
      };
    }

    return {
      name: content,
      description: "",
    };
  }

  // NEW: Parse reading tags (format: "url Title")
  parseReadingTag(content) {
    const match = content.match(/^(https?:\/\/\S+)\s+(.+)$/);

    if (match) {
      return {
        url: match[1].trim(),
        title: match[2].trim(),
      };
    }

    return {
      url: content,
      title: content,
    };
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
