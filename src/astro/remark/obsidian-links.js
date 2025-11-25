import { visit } from "unist-util-visit";
import createLogger from "../../lib/logger.js";

export default function remarkObsidianLinks(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "Obsidian Links",
  });

  return (tree, file) => {
    let noteMap = options.noteMap || new Map();

    // If noteMap is still empty, try to build from current file's data
    // (This is a fallback; ideally we'd populate it from all entries)
    if (noteMap.size === 0 && file.data) {
      logger.debug("Note map is empty, will use slugify fallback");
    }

    // Process [[wiki links]]
    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("[[")) {
        return;
      }

      const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = pattern.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        const noteName = match[1].trim();
        const displayText = match[2] ? match[2].trim() : noteName;

        // Try noteMap first, fallback to slugify
        const noteUrl = noteMap.get(noteName) || `/n/${slugify(noteName)}`;

        parts.push({
          type: "link",
          url: noteUrl,
          children: [{ type: "text", value: displayText }],
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < node.value.length) {
        parts.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      if (
        parts.length > 1 ||
        (parts.length === 1 && parts[0].type === "link")
      ) {
        parent.children.splice(index, 1, ...parts);
      }
    });

    // Process [text](./file.md) links
    visit(tree, "link", (node) => {
      const url = node.url;

      if (
        url &&
        (url.startsWith("./") || url.startsWith("../")) &&
        url.endsWith(".md")
      ) {
        let filePath = url.replace(/^\.\/|^\.\.\//, "");
        filePath = filePath.replace(/\.md$/, "");

        const slug = filePath.split("/").map(slugify).join("/");

        const fileName = filePath.split("/").pop();
        const fileUrl =
          noteMap.get(fileName) || noteMap.get(filePath) || `/n/${slug}`;

        node.url = fileUrl;
      }
    });
  };
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
