import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { standardManualCollection } from "./astro/content-config.js";

/**
 * Base schema for content validation
 *
 * Note: Default values for frontmatter fields are now handled by the
 * remarkFrontmatterDefaults plugin in src/astro/remark/frontmatter-defaults.js
 *
 * This schema only validates the types and structure of the data.
 */

export const collections = {
  //content,
  content: standardManualCollection({ base: "./content" }),
};
