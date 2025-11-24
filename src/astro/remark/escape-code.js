import { visit } from "unist-util-visit";

/**
 * Remark plugin for Code Block Escaping
 *
 * Protects fragile code blocks (HTML, XML) from markdown processing
 * by converting them to raw HTML nodes. This prevents angle brackets
 * and other markdown-sensitive characters from being interpreted.
 *
 * Configuration:
 * - Global: { escapeCodeBlocks: ["html", "xml"] }
 * - Per-file: Front matter `escapeCodeBlocks: ["html", "xml"]`
 *
 * @example
 * ---
 * escapeCodeBlocks: ["html", "xml"]
 * ---
 *
 * ```html
 * <div class="example">This won't be processed as markdown</div>
 * ```
 */
export default function remarkEscapeCode(options = {}) {
  const globalEscapeCodeBlocks = Array.isArray(options.escapeCodeBlocks)
    ? options.escapeCodeBlocks
    : [];

  return (tree, file) => {
    // Get escape languages from front matter or global options
    const frontmatterEscapeBlocks =
      file?.data?.astro?.frontmatter?.escapeCodeBlocks;
    const escapeLanguages = frontmatterEscapeBlocks || globalEscapeCodeBlocks;

    if (!escapeLanguages || escapeLanguages.length === 0) {
      return; // Nothing to escape
    }

    visit(tree, "code", (node, index, parent) => {
      if (node.lang && escapeLanguages.includes(node.lang)) {
        // Convert code block to raw HTML to prevent markdown processing
        parent.children[index] = {
          type: "html",
          value: node.value,
        };
      }
    });
  };
}
