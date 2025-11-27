/**
 * STANDARD FRAMEWORK - Content Transform Documentation
 * 
 * How to use the permalink-based URL system in your Astro site
 * 
 * The Standard framework provides utilities to automatically set collection URLs
 * based on a `permalink` field in your frontmatter. This ensures consistent,
 * customizable URLs throughout your site.
 */

// ============================================================================
// QUICK START - Basic Usage
// ============================================================================

/**
 * 1. Update your content/config.ts to use createPermalinkTransform:
 * 
 * import { defineCollection, z } from "astro:content";
 * import { glob } from "astro/loaders";
 * import { createPermalinkTransform } from "@zefish/standard/utils/content-transform";
 * 
 * const baseSchema = z.object({
 *   title: z.string().optional(),
 *   description: z.string().optional(),
 *   permalink: z.string().optional(), // ← Add this field
 *   // ... other fields
 * });
 * 
 * const docs = defineCollection({
 *   loader: glob({ pattern: "**\/*.md", base: "./content/docs" }),
 *   schema: baseSchema,
 *   transform: createPermalinkTransform(), // ← Use the transform
 * });
 * 
 * export const collections = { docs };
 */

// ============================================================================
// ADVANCED - Multiple Collections
// ============================================================================

/**
 * 2. If you have multiple collections, apply the transform to all:
 * 
 * import { defineCollection, z } from "astro:content";
 * import { glob } from "astro/loaders";
 * import { createPermalinkTransform } from "@zefish/standard/utils/content-transform";
 * 
 * const baseSchema = z.object({
 *   title: z.string().optional(),
 *   permalink: z.string().optional(),
 * });
 * 
 * const docs = defineCollection({
 *   loader: glob({ pattern: "**\/*.md", base: "./content/docs" }),
 *   schema: baseSchema,
 *   transform: createPermalinkTransform(),
 * });
 * 
 * const blog = defineCollection({
 *   loader: glob({ pattern: "**\/*.md", base: "./content/blog" }),
 *   schema: baseSchema,
 *   transform: createPermalinkTransform(),
 * });
 * 
 * export const collections = { docs, blog };
 */

// ============================================================================
// CUSTOM - Using a Different Field Name
// ============================================================================

/**
 * 3. If you want to use a different field name (e.g., "slug" instead of "permalink"):
 * 
 * import { createCustomUrlTransform } from "@zefish/standard/utils/content-transform";
 * 
 * const docs = defineCollection({
 *   loader: glob({ pattern: "**\/*.md", base: "./content/docs" }),
 *   schema: baseSchema,
 *   transform: createCustomUrlTransform({
 *     urlField: 'slug', // Use 'slug' field instead of 'permalink'
 *   }),
 * });
 */

// ============================================================================
// FRONTMATTER EXAMPLES
// ============================================================================

/**
 * 4. In your markdown files, specify the permalink:
 * 
 * ---
 * title: My Article
 * description: A great article
 * permalink: /blog/my-article/
 * ---
 * 
 * Content here...
 * 
 * 
 * If you don't specify a permalink, it's auto-generated from the file path:
 * 
 * File: content/docs/getting-started.md
 * Auto-generated permalink: /getting-started/
 * 
 * File: content/blog/2024/my-post.md
 * Auto-generated permalink: /2024/my-post/
 * 
 * File: content/docs/index.md
 * Auto-generated permalink: /
 */

// ============================================================================
// USING IN TEMPLATES
// ============================================================================

/**
 * 5. Access the URL in your Astro templates:
 * 
 * ---
 * import { getCollection } from "astro:content";
 * 
 * const docs = await getCollection("docs");
 * ---
 * 
 * {docs.map((doc) => (
 *   <a href={doc.url}>
 *     {doc.data.title}
 *   </a>
 * ))}
 * 
 * Or access the permalink directly:
 * 
 * {docs.map((doc) => (
 *   <a href={doc.data.permalink}>
 *     {doc.data.title}
 *   </a>
 * ))}
 */

// ============================================================================
// WITH STANDARD FRAMEWORK PLUGINS
// ============================================================================

/**
 * 6. When using the Standard framework with backlinks and wikilinks:
 * 
 * The permalink system integrates seamlessly:
 * 
 * - Frontmatter defaults plugin generates permalinks if missing
 * - Backlinks plugin uses permalinks to build the link graph
 * - Obsidian links plugin resolves [[wikilinks]] to permalinks
 * - Content config uses permalinks for routing
 * 
 * Result: All links are consistent and customizable throughout your site!
 */

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * Available exports from @zefish/standard/utils/content-transform:
 * 
 * - createPermalinkTransform(options)
 *   → Creates a transform using the 'permalink' field
 *   → Fallback: auto-generates from file path
 * 
 * - createCustomUrlTransform(options)
 *   → Creates a transform using any field name
 *   → Useful for 'slug', 'url', or custom field names
 * 
 * - defaultPermalinkFallback(entry)
 *   → Generates a URL from the file ID
 *   → Used as default fallback for both functions
 * 
 * - applyPermalinkTransform(collection)
 *   → Applies createPermalinkTransform to a collection
 *   → Shorthand for common use case
 */
