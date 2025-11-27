import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  date: z.coerce.date().optional().nullable(),
  updated: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional().nullable().default([]),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  permalink: z.string().optional(),
  layout: z.string().optional().nullable(),
  draft: z.boolean().default(false),
});

// ✅ HELPER: Generate default permalink from file ID
function generatePermalink(id: string): string | undefined {
  // If it's a folder index (e.g., "docs/index"), strip the index
  if (id.endsWith("/index")) {
    return id.replace(/\/index$/, "");
  }

  // If it's the root index, return undefined (which becomes /)
  if (id === "index") {
    return undefined;
  }

  // Otherwise, just use the file path as-is
  return id;
}

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/n" }),
  schema: baseSchema,

  // ✅ THE TRANSFORM
  transform: (entry) => {
    // Use user's permalink if provided, otherwise generate one
    const permalink = entry.data.permalink ?? generatePermalink(entry.id);

    return {
      ...entry,
      data: {
        ...entry.data,
        permalink,
      },
    };
  },
});

export const collections = {
  docs,
};
