import { visit } from "unist-util-visit";

/**
 * Remark plugin to wrap hashtags in spans
 * Matches #tag and wraps in <span class="tag" data-tag="tag">#tag</span>
 */

import Logger from "../logger.js";
export default function remarkTags(options = {}) {
  const tagRegex = /#([a-zA-Z][a-zA-Z0-9_-]*(?:\/[a-zA-Z][a-zA-Z0-9_-]*)*)/g;

  const logger = Logger({ scope: "tags" });
  logger.info("init");

  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      // Skip if parent is a link, code, or already a tag
      if (
        parent.type === "link" ||
        parent.type === "code" ||
        parent.type === "inlineCode" ||
        (parent.type === "html" && parent.value.includes('class="tag"'))
      ) {
        return;
      }

      const value = node.value;
      const matches = [];
      let match;

      while ((match = tagRegex.exec(value)) !== null) {
        matches.push({
          tag: match[0],
          name: match[1],
          index: match.index,
          length: match[0].length,
        });
      }

      if (matches.length === 0) return;

      const children = [];
      let lastIndex = 0;

      matches.forEach((m) => {
        if (m.index > lastIndex) {
          children.push({
            type: "text",
            value: value.slice(lastIndex, m.index),
          });
        }

        children.push({
          type: "html",
          value: `<span class="tag" data-tag="${m.name}">`,
        });
        children.push({
          type: "text",
          value: m.tag,
        });
        children.push({
          type: "html",
          value: "</span>",
        });

        lastIndex = m.index + m.length;
      });

      if (lastIndex < value.length) {
        children.push({
          type: "text",
          value: value.slice(lastIndex),
        });
      }

      parent.children.splice(index, 1, ...children);
      // Skip visiting the new nodes we just added to avoid infinite loops
      return index + children.length;
    });
  };
}
