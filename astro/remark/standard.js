import { visit } from "unist-util-visit";
import logger from "../../core/logger.js";

const log = logger({ scope: "markdown" });

/**
 * Remark plugin for Standard Framework features:
 * - Highlights (==text== -> <mark>text</mark>)
 * - Comments (%% text %% -> removed)
 * - Comment Callouts (> [!comment] -> removed)
 */
export default function remarkStandard(options = {}) {
  log.info("init");
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      let value = node.value;

      // 1. Remove comments %% text %%
      // Note: This simple regex might not handle nested or complex cases perfectly across nodes,
      // but matches the 11ty preprocessor logic which was regex-based.
      value = value.replace(/%%[\s\S]*?%%/g, "");

      // 2. Highlights ==text==
      // We need to split nodes for this to be AST-compliant, similar to tags.
      // But for simplicity in this port, we'll try to use HTML nodes if possible,
      // or just simple replacement if the user accepts raw HTML in markdown.
      // A better approach is to split into 'html' nodes.

      const highlightRegex = /==(.+?)==/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      // If no highlights and no comments removed, just update value and return
      if (!highlightRegex.test(value) && value === node.value) {
        return;
      }

      // Reset regex
      highlightRegex.lastIndex = 0;

      // If we removed comments, we need to process the new value
      while ((match = highlightRegex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }

        parts.push({ type: "html", value: "<mark>" });
        parts.push({ type: "text", value: match[1] });
        parts.push({ type: "html", value: "</mark>" });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        parts.push({ type: "text", value: value.slice(lastIndex) });
      }

      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      } else {
        node.value = value;
      }
    });

    // 3. Remove Comment Callouts
    // Callouts are usually blockquotes. We need to visit blockquotes.
    visit(tree, "blockquote", (node, index, parent) => {
      // Check if the first paragraph starts with [!comment] or [!comments]
      const firstChild = node.children[0];
      if (firstChild && firstChild.type === "paragraph") {
        const textNode = firstChild.children[0];
        if (textNode && textNode.type === "text") {
          if (/^\[!comments?\]/.test(textNode.value)) {
            // Remove the blockquote entirely
            parent.children.splice(index, 1);
            return index;
          }
        }
      }
    });
  };
}
