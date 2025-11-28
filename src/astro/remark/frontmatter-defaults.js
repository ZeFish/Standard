import { visit } from "unist-util-visit";
import logger from "../logger.js";
import { generatePermalink } from "../utils/permalink.js";

export default function remarkFrontmatterDefaults(options = {}) {
  const defaults = options.defaults || {};
  const verbose = options.verbose || false;
  const log = logger({ scope: "frontmatter" });
  log.info("init");
  return (tree, file) => {
    if (!file.data.astro) {
      file.data.astro = {};
    }
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }

    const frontmatter = file.data.astro.frontmatter;

    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (
        !frontmatter.hasOwnProperty(key) ||
        frontmatter[key] === null ||
        frontmatter[key] === undefined
      ) {
        frontmatter[key] = Array.isArray(defaultValue)
          ? [...defaultValue]
          : defaultValue;
      }
    });

    if (!frontmatter.title) {
      frontmatter.title = generateTitleFromFilename(file);
    }
    if (!frontmatter.permalink) {
      const permalink = generatePermalink(file.stem);
      if (permalink) {
        frontmatter.permalink = permalink;
      } else {
      }
    } else {
    }
    return tree;
  };
}

function generateTitleFromFilename(file) {
  if (!file.stem) return null;
  return file.stem.replace(/-/g, " ").replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
