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
export const baseSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  created: z.coerce.date().optional().nullable(),
  modified: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  permalink: z.string().optional(),
  layout: z.string().optional().nullable(),
});

/**
 * Create a docs collection with permalink-based URLs and backlinks support
 */
export function standardManualCollection(options = {}) {
  const {
    base,
    pattern = "**/*.{md,mdx}", // Updated to include MDX
    schema = baseSchema,
  } = options;

  if (!base) {
    // Fallback or Error.
    // Note: If using standard/config virtual module, you might be able to grab it here,
    // but passing it explicitly is safer for avoiding circular deps.
    throw new Error(
      "[Standard] createDocsCollection requires a `contentDir`. \n" +
        'Usage: createDocsCollection({ contentDir: "src/content/blog" })',
    );
  }

  return defineCollection({
    loader: glob({ pattern, base: base }),
    schema,
    transform: (entry) => {
      // If permalink exists, use it. Otherwise, generate from ID.
      let url = entry.data.permalink;

      if (!url) {
        // Clean the ID: remove extension and handle 'index'
        const slug = entry.id
          .replace(/\.mdx?$/, "")
          .replace(/(^|\/)index$/, "");

        url = slug ? `/${slug}/` : "/";
      }

      return {
        ...entry,
        url, // Available as post.url
        data: {
          ...entry.data,
          permalink: url, // Sync data.permalink to match
        },
      };
    },
  });
}
