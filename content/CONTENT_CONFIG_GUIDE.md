/**
 * STANDARD FRAMEWORK - Content Configuration Guide
 * 
 * How to set up content collections with Standard Framework features
 * including backlinks, frontmatter defaults, and permalink-based URLs.
 */

// ============================================================================
// QUICK START - Automatic Setup
// ============================================================================

/**
 * The easiest way to set up a content collection with Standard Framework:
 * 
 * 1. In your src/content/config.ts (or .js):
 * 
 * import { createDocsCollection } from "@zefish/standard/content-config";
 * 
 * export const collections = {
 *   docs: createDocsCollection(),
 * };
 * 
 * That's it! You get:
 * - ✅ Backlinks support
 * - ✅ Frontmatter defaults (title, permalink auto-generated)
 * - ✅ Permalink-based URLs
 * - ✅ Proper schema validation
 */

// ============================================================================
// CUSTOM DIRECTORY
// ============================================================================

/**
 * 2. Use a custom content directory:
 * 
 * import { createDocsCollection } from "@zefish/standard/content-config";
 * 
 * export const collections = {
 *   docs: createDocsCollection({
 *     contentDir: "./src/content/docs"
 *   }),
 * };
 */

// ============================================================================
// CUSTOM SCHEMA
// ============================================================================

/**
 * 3. Extend the schema with custom fields:
 * 
 * import { createDocsCollection, baseSchema } from "@zefish/standard/content-config";
 * import { z } from "astro:content";
 * 
 * const customSchema = baseSchema.extend({
 *   customField: z.string().optional(),
 *   rating: z.number().optional(),
 * });
 * 
 * export const collections = {
 *   docs: createDocsCollection({
 *     schema: customSchema
 *   }),
 * };
 */

// ============================================================================
// MULTIPLE COLLECTIONS
// ============================================================================

/**
 * 4. Multiple collections with different settings:
 * 
 * import { createDocsCollection } from "@zefish/standard/content-config";
 * 
 * export const collections = {
 *   docs: createDocsCollection({
 *     contentDir: "./content/docs"
 *   }),
 *   blog: createDocsCollection({
 *     contentDir: "./content/blog"
 *   }),
 *   guides: createDocsCollection({
 *     contentDir: "./content/guides",
 *     pattern: "**\/*.md"
 *   }),
 * };
 */

// ============================================================================
// WHAT YOU GET AUTOMATICALLY
// ============================================================================

/**
 * When using createDocsCollection(), you automatically get:
 * 
 * 1. BACKLINKS
 *    - Automatic bidirectional link tracking
 *    - Available as frontmatter.backlinks in templates
 *    - Contains inbound and outbound links
 * 
 * 2. FRONTMATTER DEFAULTS
 *    - title: Auto-generated from filename if missing
 *    - permalink: Auto-generated from file path if missing
 *    - Other defaults can be configured in astro.config.mjs
 * 
 * 3. PERMALINK-BASED URLS
 *    - All URLs use the permalink field
 *    - Customizable per-document via frontmatter
 *    - Consistent across the entire site
 * 
 * 4. SCHEMA VALIDATION
 *    - Type-safe frontmatter
 *    - Includes: title, description, author, date, tags, etc.
 *    - Extensible with custom fields
 */

// ============================================================================
// FRONTMATTER EXAMPLE
// ============================================================================

/**
 * Your markdown files automatically get:
 * 
 * ---
 * title: My Article  // Auto-generated from filename if missing
 * description: A great article
 * author: Your Name
 * date: 2024-01-15
 * tags: [astro, markdown]
 * permalink: /blog/my-article/  // Auto-generated from file path if missing
 * ---
 * 
 * # Content here
 * 
 * [Link to other page](other-page.md)
 * 
 * The backlinks plugin will automatically track this link!
 */

// ============================================================================
// ACCESSING BACKLINKS IN TEMPLATES
// ============================================================================

/**
 * In your Astro layouts, access backlinks like this:
 * 
 * ---
 * import { getCollection } from "astro:content";
 * 
 * const posts = await getCollection("docs");
 * ---
 * 
 * {posts.map((post) => (
 *   <article>
 *     <h1>{post.data.title}</h1>
 *     
 *     {post.data.backlinks?.inbound.length > 0 && (
 *       <section>
 *         <h2>Pages linking to this</h2>
 *         <ul>
 *           {post.data.backlinks.inbound.map((link) => (
 *             <li><a href={link}>{link}</a></li>
 *           ))}
 *         </ul>
 *       </section>
 *     )}
 *   </article>
 * ))}
 */

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * Available exports from @zefish/standard/content-config:
 * 
 * - createDocsCollection(options)
 *   → Creates a pre-configured collection with Standard features
 *   → Options: contentDir, pattern, schema
 * 
 * - baseSchema
 *   → The default Zod schema for content validation
 *   → Use to extend with custom fields
 */
