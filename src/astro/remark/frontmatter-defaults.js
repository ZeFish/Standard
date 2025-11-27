import { visit } from 'unist-util-visit';
import logger from "../logger.js";

const log = logger({ scope: "Frontmatter Defaults" });

/**
 * Remark plugin for Frontmatter Defaults - Metadata Default Values
 *
 * This plugin allows you to define default values for frontmatter fields that
 * are missing or undefined. It's useful for ensuring consistent metadata across
 * your content collection without requiring every document to explicitly define
 * every field.
 *
 * The plugin runs early in the pipeline and only applies defaults to fields that
 * are either missing or explicitly set to null/undefined. Existing values are
 * never overwritten.
 *
 * Special handling:
 * - `permalink`: Auto-generated from file ID if not provided
 * - `title`: Uses filename (without extension) if not provided
 *
 * @example configuration
 *   // In your Astro config or standard plugin options:
 *   {
 *     frontmatterDefaults: {
 *       visibility: 'public',
 *       draft: false,
 *       tags: [],
 *       author: 'Your Name',
 *       layout: 'default'
 *       // Note: permalink and title are auto-generated if not provided
 *     }
 *   }
 *
 * @example markdown - Front matter with missing fields
 *   ---
 *   description: A great article
 *   ---
 *
 *   Will automatically get:
 *   - title: 'my-article' (from filename)
 *   - visibility: 'public'
 *   - draft: false
 *   - tags: []
 *   - author: 'Your Name'
 *   - layout: 'default'
 *   - permalink: '/my-article/' (generated from file ID)
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.defaults - Key-value pairs of default values
 * @param {boolean} options.verbose - Enable debug logging
 * @returns {Function} Remark plugin function
 */
export default function remarkFrontmatterDefaults(options = {}) {
  const defaults = options.defaults || {};
  const verbose = options.verbose || false;

  return (tree, file) => {
    // Ensure frontmatter structure exists
    if (!file.data.astro) {
      file.data.astro = {};
    }
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }

    const frontmatter = file.data.astro.frontmatter;
    const appliedDefaults = {};

    // Apply defaults for each key
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      // Only apply default if the field is missing or explicitly null/undefined
      if (
        !frontmatter.hasOwnProperty(key) ||
        frontmatter[key] === null ||
        frontmatter[key] === undefined
      ) {
        // Deep clone arrays and objects to avoid reference issues
        let valueToApply = defaultValue;
        if (Array.isArray(defaultValue)) {
          valueToApply = [...defaultValue];
        } else if (typeof defaultValue === 'object' && defaultValue !== null) {
          valueToApply = JSON.parse(JSON.stringify(defaultValue));
        }

        frontmatter[key] = valueToApply;
        appliedDefaults[key] = valueToApply;
      }
    });

    // Special handling for title: use filename if not present
    if (
      !frontmatter.hasOwnProperty('title') ||
      frontmatter.title === null ||
      frontmatter.title === undefined
    ) {
      const title = generateTitleFromFilename(file);
      if (title) {
        frontmatter.title = title;
        appliedDefaults.title = title;
      }
    }

    // Special handling for permalink: generate from file ID if not present
    if (
      !frontmatter.hasOwnProperty('permalink') ||
      frontmatter.permalink === null ||
      frontmatter.permalink === undefined
    ) {
      const permalink = generatePermalinkFromFileId(file);
      if (permalink) {
        frontmatter.permalink = permalink;
        appliedDefaults.permalink = permalink;
      }
    }

    // Log applied defaults if verbose
    if (verbose && Object.keys(appliedDefaults).length > 0) {
      log.debug(`Applied defaults to "${file.id}":`, appliedDefaults);
    }

    // Return tree unchanged (we only modified frontmatter metadata)
    return tree;
  };
}

/**
 * Generate a title from the filename
 * 
 * Converts filenames to readable titles:
 * - 'my-post' → 'My Post'
 * - 'getting-started' → 'Getting Started'
 * - 'index' → null (don't generate title for index files)
 * 
 * @param {Object} file - The file object from remark
 * @returns {string|null} The generated title
 */
function generateTitleFromFilename(file) {
  let filename = file.stem || file.id || '';
  
  if (!filename) return null;
  
  // Don't generate title for index files
  if (filename === 'index') {
    return null;
  }
  
  // Remove .md or .mdx extension if present (shouldn't be in stem, but just in case)
  filename = filename.replace(/\.mdx?$/, '');
  
  // Convert kebab-case to Title Case
  // 'my-post' → 'My Post'
  const title = filename
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return title;
}

/**
 * Generate a permalink from the file ID
 * 
 * Converts file paths to URL-friendly permalinks:
 * - 'blog/my-post' → '/blog/my-post/'
 * - 'index' → '/'
 * - 'docs/getting-started' → '/docs/getting-started/'
 * 
 * @param {Object} file - The file object from remark
 * @returns {string} The generated permalink
 */
function generatePermalinkFromFileId(file) {
  let id = file.id || file.stem || '';
  
  if (!id) return null;
  
  // Remove .md or .mdx extension if present
  id = id.replace(/\.mdx?$/, '');
  
  // Handle index files - they become the directory
  if (id.endsWith('/index')) {
    id = id.replace(/\/index$/, '');
  }
  
  // Root index becomes /
  if (id === 'index') {
    return '/';
  }
  
  // Ensure leading and trailing slashes
  if (!id.startsWith('/')) {
    id = '/' + id;
  }
  if (!id.endsWith('/')) {
    id = id + '/';
  }
  
  return id;
}
