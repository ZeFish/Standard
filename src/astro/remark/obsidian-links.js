import { visit } from "unist-util-visit";

/**
 * Remark plugin to convert Obsidian-style links [[Note Name]] to proper URLs
 *
 * Converts: [[My Note]] → [My Note](/n/my-note)
 * Converts: [[My Note|Display Text]] → [Display Text](/n/my-note)
 */
export default function remarkObsidianLinks(options = {}) {
  return (tree, file) => {
    // Build a map of notes for quick lookup
    const noteMap = options.noteMap || new Map();

    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("[[")) {
        return;
      }

      // Pattern: [[Note Name]] or [[Note Name|Display Text]]
      const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = pattern.exec(node.value)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        const noteName = match[1].trim();
        const displayText = match[2] ? match[2].trim() : noteName;

        // Look up the note to find its URL
        const noteUrl = noteMap.get(noteName) || `/n/${slugify(noteName)}`;

        // Create link node
        parts.push({
          type: "link",
          url: noteUrl,
          children: [
            {
              type: "text",
              value: displayText,
            },
          ],
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < node.value.length) {
        parts.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      // Replace node if we found links
      if (
        parts.length > 1 ||
        (parts.length === 1 && parts[0].type === "link")
      ) {
        parent.children.splice(index, 1, ...parts);
      }
    });
  };
}

// Slugify helper (same as your existing one)
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
