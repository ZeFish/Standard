import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Base schema for content validation
 *
 * Note: Default values for frontmatter fields are now handled by the
 * remarkFrontmatterDefaults plugin in src/astro/remark/frontmatter-defaults.js
 *
 * This schema only validates the types and structure of the data.
 */

/**
 * Base schema for content validation
 *
 * Note: Default values for frontmatter fields are now handled by the
 * remarkFrontmatterDefaults plugin in src/astro/remark/frontmatter-defaults.js
 *
 * This schema only validates the types and structure of the data.
 */
const baseSchema = z.object({
  title: z.string().optional().nullable(),
  created: z.coerce.date().optional().nullable(),
  modified: z.coerce.date().optional().nullable(),
  permalink: z.string().optional(),
  draft: z.boolean().optional(),
});

export const collections = {
  //content,
  content: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./content" }),
  }),
  home: defineCollection({
    loader: glob({ pattern: "index.{md,mdx}", base: "./content" }),
    schema: baseSchema.extend({
      backlinksIgnore: z.boolean().default(true),
    }),
  }),
};
