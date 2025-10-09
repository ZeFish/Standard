import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdown_it_obsidian_callouts from "markdown-it-obsidian-callouts";
import markdownItFootnote from "markdown-it-footnote";

export default function (eleventyConfig, options = {}) {
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(markdown_it_obsidian_callouts)
    .use(markdownItFootnote);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary("md", md);
}
