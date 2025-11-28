import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Helper to define a Standard content collection.
 *
 * @param {object} options - Configuration options.
 * @param {string} [options.base="./src/content/notes"] - Base directory for the collection.
 * @param {string|string[]} [options.pattern=".{md,mdx}"] - Glob pattern(s) for files.
 * @param {Function} [options.schema] - Optional Zod schema for entries.
 * @param {object} [options.loader] - Additional loader options passed to glob().
 */
export function defineStandardCollection(options = {}) {
  const {
    base = "./content",
    pattern = "**/*.{md,mdx}",
    schema,
    loader: loaderOptions = {},
  } = options;

  return defineCollection({
    type: "content",
    schema,
    loader: glob({
      base,
      pattern,
      ...loaderOptions,
    }),
  });
}
