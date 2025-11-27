/**
 * Standard Framework Content Configuration
 * 
 * @module @zefish/standard/content-config
 * @category Astro Integration
 * @description Simple helper to set up content collections with permalink-based URLs
 * and backlinks support.
 * 
 * @example
 * import { createDocsCollection } from "@zefish/standard/content-config";
 * 
 * export const collections = {
 *   docs: createDocsCollection(),
 * };
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Base schema for content validation
 */
const baseSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  date: z.coerce.date().optional().nullable(),
  updated: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  permalink: z.string().optional(),
  layout: z.string().optional().nullable(),
  draft: z.boolean().optional(),
});

/**
 * Create a docs collection with permalink-based URLs and backlinks support
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.contentDir - Content directory (required)
 * @param {string} options.pattern - File pattern (default: "**\/*.md")
 * @param {Object} options.schema - Custom schema (default: baseSchema)
 * @returns {Object} Collection definition
 * 
 * @example
 * import { createDocsCollection } from "@zefish/standard/content-config";
 * import config from "virtual:standard/config";
 * 
 * export const collections = {
 *   docs: createDocsCollection({ 
 *     contentDir: config.content?.dir 
 *   }),
 * };
 */
export function createDocsCollection(options = {}) {
  const {
    contentDir,
    pattern = "**/*.md",
    schema = baseSchema,
  } = options;

  if (!contentDir) {
    throw new Error(
      'createDocsCollection() requires contentDir option. ' +
      'Pass it from Standard config: ' +
      'createDocsCollection({ contentDir: config.content?.dir })'
    );
  }

  return defineCollection({
    loader: glob({ pattern, base: contentDir }),
    schema,
    transform: (entry) => {
      // Use permalink as URL, or generate from file path
      const url = entry.data.permalink || `/${entry.id.replace(/\.mdx?$/, '')}/`;

      return {
        ...entry,
        url,
        data: {
          ...entry.data,
          permalink: url,
        },
      };
    },
  });
}

export { baseSchema };
