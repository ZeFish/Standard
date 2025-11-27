import { visit } from 'unist-util-visit';
import logger from "../logger.js";

const log = logger({ scope: "Fix Dates" });

/**
 * Remark plugin for Date Format Normalization - Temporal Metadata Standardization
 *
 * Front matter in markdown is notoriously finicky about dates. Write them one
 * way in YAML and they're strings; write them another and they're parsed as
 * JavaScript Date objects. This inconsistency breaks templating, sorting, and
 * filtering—the three pillars of content management.
 *
 * The YAML 1.1 specification (which Jekyll popularized) tries to be helpful by
 * auto-parsing timestamps. But it's unreliable across systems and configurations.
 * This plugin takes the author's intent—a readable timestamp like
 * "2024-10-25 14:30"—and guarantees it becomes a proper JavaScript Date object
 * before any templating runs.
 *
 * It's defensive programming for content: assume strings, validate carefully,
 * transform only when safe, and preserve originals if anything seems wrong.
 * Your dates become predictable, sortable, and reliable throughout the pipeline.
 *
 * @example markdown - Front matter dates
 *   ---
 *   created: 2024-10-25 14:30
 *   modified: 2024-10-25 15:45
 *   ---
 *
 * The above dates will be converted from strings to JavaScript Date objects.
 */
export default function remarkFixDates(options = {}) {
  const knownFields = options.fields || ['created', 'modified'];

  return (tree, file) => {
    // Access and modify front matter
    if (!file.data.astro) {
      file.data.astro = {};
    }
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }

    const frontmatter = file.data.astro.frontmatter;

    // Helper function to fix date strings
    const fixDateString = (value) => {
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ) {
        try {
          // Convert "2024-10-25 14:30" to "2024-10-25T14:30"
          const date = new Date(value.replace(" ", "T"));
          // If the date is invalid, return the original value to prevent errors
          if (!isNaN(date.getTime())) {
            return date;
          }
        } catch (error) {
          // If parsing fails, return original value
          log.warn(`Failed to parse date: ${value}`);
        }
      }
      return value;
    };

    // Fix only known fields
    knownFields.forEach((field) => {
      if (frontmatter.hasOwnProperty(field)) {
        const originalValue = frontmatter[field];
        const fixedValue = fixDateString(originalValue);

        if (fixedValue !== originalValue) {
          frontmatter[field] = fixedValue;
        }
      }
    });

    // Return tree unchanged (we only modified frontmatter metadata)
    return tree;
  };
}
