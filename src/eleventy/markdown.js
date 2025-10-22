import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdown_it_obsidian_callouts from "markdown-it-obsidian-callouts";
import markdownItFootnote from "markdown-it-footnote";

/**
 * @component Markdown Plugin
 * @category 11ty Plugins
 * @description Configures markdown-it parser with plugins for syntax highlighting,
 * callout blocks (admonitions), and footnotes. Enables typographer for smart quotes,
 * dashes, and proper punctuation. HTML output from markdown is preserved.
 *
 * @prop {plugin} syntaxHighlight Code syntax highlighting for fenced code blocks
 * @prop {plugin} markdown_it_obsidian_callouts Callout/admonition blocks support
 * @prop {plugin} markdownItFootnote Footnote support with references
 * @prop {option} html Allow HTML in markdown content
 * @prop {option} breaks Treat newlines as breaks (soft line breaks)
 * @prop {option} linkify Auto-detect and linkify URLs
 * @prop {option} typographer Enable smart typography (quotes, dashes, etc.)
 *
 * @example
 * // Markdown features available:
 *
 * // Callout block (Obsidian syntax)
 * > [!NOTE]
 * > This is a note callout
 *
 * // Footnote
 * This text has a footnote[^1].
 * [^1]: This is the footnote content
 *
 * // Code block with syntax highlighting
 * ```javascript
 * const code = "highlighted";
 * ```
 *
 * // Smart typography
 * "Quotes" become "curly"
 * ... becomes …
 * -- becomes –
 *
 * @since 0.1.0
 */

export default function (eleventyConfig, options = {}) {
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(markdown_it_obsidian_callouts)
    .use(markdownItFootnote);

  // Add custom rule to rewrite content/ links to site paths
  const defaultLinkRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, renderer) {
      return renderer.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const href = token.attrGet("href");

    if (href && href.startsWith("content/")) {
      // Rewrite content/path/ to /path/
      const rewrittenHref = "/" + href.replace(/^content\//, "");
      token.attrSet("href", rewrittenHref);
    }

    return defaultLinkRender(tokens, idx, options, env, renderer);
  };

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary("md", md);
}
