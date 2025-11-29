import { visit } from "unist-util-visit";
import Logger from "../../core/logger.js";

export default function remarkObsidianLinks(options = {}) {
  const logger = Logger({ scope: "wikilinks" });
  logger.info("init");

  return (tree, file) => {
    // Process [[wiki links]]
    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("[[")) {
        return;
      }

      const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

      if (!pattern.test(node.value)) {
        return;
      }

      const pattern2 = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      let foundMatch = false;

      while ((match = pattern2.exec(node.value)) !== null) {
        foundMatch = true;

        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        const noteName = match[1].trim();
        const displayText = match[2] ? match[2].trim() : noteName;

        // Generate URL from wikilink name
        const noteUrl = slugify(noteName);

        parts.push({
          type: "link",
          url: noteUrl.startsWith("/") ? noteUrl : `/${noteUrl}/`,
          children: [{ type: "text", value: displayText }],
        });

        lastIndex = match.index + match[0].length;
      }

      if (foundMatch) {
        if (lastIndex < node.value.length) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex),
          });
        }

        parent.children.splice(index, 1, ...parts);
      }
    });

    // Process [text](.\/file.md) links
    visit(tree, "link", (node) => {
      let url = node.url;

      if (
        url &&
        (url.startsWith("./") || url.startsWith("../")) &&
        url.endsWith(".md")
      ) {
        // DECODE URL-ENCODED characters
        url = decodeURIComponent(url);

        let filePath = url.replace(/^\.\/|^\.\.\//, "");
        filePath = filePath.replace(/\.md$/, "");

        const slug = filePath.split("/").map(slugify).join("/");
        node.url = slug.startsWith("/") ? slug : `/${slug}/`;
      }
    });
  };
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/[^a-z0-9-\/]/g, "") // Keep only alphanumeric and hyphens
    .replace(/^-+|-+$/g, "") // Trim hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
}
