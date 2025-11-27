import { visit } from "unist-util-visit";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const backlinkStore = new Map();

function slugifySegment(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeKey(str) {
  if (!str) return null;
  let value = String(str).trim();
  if (!value) return null;

  // ✨ NEW: Decode URL encoding first
  try {
    value = decodeURIComponent(value);
  } catch (e) {
    // If decoding fails, continue with original value
  }

  value = value.replace(/\\/g, "/");
  value = value.replace(/\.mdx?$/i, "");
  value = value.replace(/\.html?$/i, "");
  value = value.replace(/^\.\//, "");
  value = value.replace(/^\//, "");
  value = value.replace(/\/$/, "");
  if (!value) return null;
  const segments = value.split("/").map((segment) => slugifySegment(segment));
  return segments.filter(Boolean).join("/");
}

function ensureEntry(key, meta = {}) {
  if (!key) return null;
  if (!backlinkStore.has(key)) {
    backlinkStore.set(key, {
      key,
      meta: { id: key, slug: key },
      inbound: new Set(),
      outbound: new Set(),
    });
  }
  const entry = backlinkStore.get(key);
  entry.meta = {
    ...entry.meta,
    ...meta,
    id: entry.meta?.id ?? key,
    slug: entry.meta?.slug ?? key,
  };
  return entry;
}

export function resetBacklinks() {
  backlinkStore.clear();
}

export function getCollectedBacklinks() {
  return backlinkStore;
}

function serializeBacklinks() {
  const graph = getCollectedBacklinks();
  const result = {};
  for (const [key, entry] of graph.entries()) {
    result[key] = {
      key,
      meta: entry.meta || {},
      inbound: Array.from(entry.inbound || []),
      outbound: Array.from(entry.outbound || []),
    };
  }
  return result;
}

export function getBacklinkGraph() {
  const serialized = serializeBacklinks();
  console.log("🔗 BACKLINK GRAPH REQUESTED:", {
    storeSize: backlinkStore.size,
    graphKeys: Object.keys(serialized).slice(0, 10),
    totalKeys: Object.keys(serialized).length,
    sample: Object.entries(serialized).slice(0, 2),
    allKeys: Array.from(backlinkStore.keys()).slice(0, 20),
  });
  return serialized;
}

export function resetBacklinkGraph() {
  resetBacklinks();
}

/**
 * ✨ NEW: Manually populate backlinks from content directory
 * This is a fallback for when remark plugins don't run automatically
 */
/**
 * ✨ NEW: Manually populate backlinks from content directory
 * This is a fallback for when remark plugins don't run automatically
 */
export async function populateBacklinksFromContent(permalinkMap = new Map()) {
  console.log("🔗 POPULATE BACKLINKS FROM CONTENT - Starting scan");

  const contentDirs = [{ dir: "./content", prefix: "" }];

  let processedFiles = 0;
  let skippedFiles = 0;

  for (const { dir, prefix } of contentDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    try {
      const files = fs.readdirSync(dir, { recursive: true });
      console.log(`🔗 Scanning ${dir} - found ${files.length} items`);

      for (const file of files) {
        if (!file.endsWith(".md")) {
          skippedFiles++;
          continue;
        }

        const filePath = path.join(dir, file);
        try {
          const content = fs.readFileSync(filePath, "utf-8");
          const { data: frontmatter, content: body } = matter(content);

          // Extract just the filename without directory
          const relativePath = file.replace(/\.md$/, "");
          const slugPath = normalizeKey(relativePath);

          // ✨ CHANGED: Store WITHOUT directory prefix - just the normalized slug
          const entryKey = slugPath;

          console.log(`🔗 Processing ${file} -> key: ${entryKey}`);
          processedFiles++;

          // ✨ CHANGED: Use permalink from map if available
          let finalSlug = slugPath;
          if (permalinkMap && (permalinkMap.has(frontmatter.title) || permalinkMap.has(relativePath) || permalinkMap.has(file))) {
            // Try to find the permalink using various keys
            const permalink = permalinkMap.get(frontmatter.title) || permalinkMap.get(relativePath) || permalinkMap.get(file);
            if (permalink) {
              finalSlug = permalink.replace(/^\//, ""); // Remove leading slash
            }
          }

          const entryMeta = {
            title: frontmatter.title || null,
            // ✨ CHANGED: Build slug based on which directory
            slug: finalSlug,
            id: normalizeKey(frontmatter.id) || entryKey,
            type: frontmatter.type || null,
          };

          ensureEntry(entryKey, entryMeta);

          // Extract links from markdown
          // Handle [text](url)
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let match;
          while ((match = linkRegex.exec(body)) !== null) {
            const [, text, url] = match;
            if (!url.match(/^(https?:|mailto:|#)/)) {
              const targetKey = normalizeKey(url);
              if (targetKey && targetKey !== entryKey) {
                const entry = backlinkStore.get(entryKey);
                if (entry) {
                  entry.outbound.add(targetKey);
                  const targetEntry = ensureEntry(targetKey);
                  targetEntry.inbound.add(entryKey);
                }
              }
            }
          }

          // Handle [[wikilinks]]
          const wikiRegex = /\[\[([^\]]+)\]\]/g;
          while ((match = wikiRegex.exec(body)) !== null) {
            const [, link] = match;
            const [target] = link.split("|");
            const targetKey = normalizeKey(target.trim());
            if (targetKey && targetKey !== entryKey) {
              const entry = backlinkStore.get(entryKey);
              if (entry) {
                entry.outbound.add(targetKey);
                const targetEntry = ensureEntry(targetKey);
                targetEntry.inbound.add(entryKey);
              }
            }
          }
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
          skippedFiles++;
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dir}:`, error.message);
    }
  }

  console.log(`✅ POPULATE BACKLINKS DONE:`, {
    processed: processedFiles,
    skipped: skippedFiles,
    storeSize: backlinkStore.size,
  });
}

export default function remarkBacklinks(options = {}) {
  const { baseUrl = "", verbose = false, permalinkMap = new Map() } = options;

  console.log("🔗 BACKLINKS PLUGIN INITIALIZED with options:", {
    verbose,
    baseUrl,
  });

  let transformerCallCount = 0;

  return function transformer(tree, file) {
    transformerCallCount++;
    console.log(
      `🔗 BACKLINKS TRANSFORMER CALLED (${transformerCallCount}) for file:`,
      file.path || file.stem,
    );

    // Get frontmatter from Astro's file.data.astro
    const frontmatter = file.data?.astro?.frontmatter ?? {};

    // Also check file properties directly
    const fileData = {
      ...frontmatter,
      stem: file.stem,
      path: file.path,
      history: file.history?.[0],
    };

    console.log("🔗 FILE DATA:", {
      file: file.path || file.stem,
      hasFrontmatter: !!file.data?.astro?.frontmatter,
      frontmatterKeys: Object.keys(frontmatter),
      stem: file.stem,
      data_keys: Object.keys(file.data || {}),
    });

    if (verbose) {
      console.log("📝 Backlinks processing:", {
        file: file.path || file.stem,
        frontmatter: {
          title: frontmatter.title,
          slug: frontmatter.slug,
          id: frontmatter.id,
          permalink: frontmatter.permalink,
        },
        stem: file.stem,
      });
    }

    // Generate entry key - prioritize explicit identifiers
    let entryKey =
      normalizeKey(frontmatter.slug) ||
      normalizeKey(frontmatter.id) ||
      normalizeKey(frontmatter.permalink) ||
      normalizeKey(frontmatter.title) ||
      normalizeKey(file.stem) ||
      normalizeKey(file.path);

    // ✨ NEW: Check permalink map
    if (permalinkMap) {
      // Try to find by file path or title
      const fileId = file.stem; // e.g. "markdown"
      const title = frontmatter.title;

      const mappedPermalink = permalinkMap.get(title) || permalinkMap.get(fileId);
      if (mappedPermalink) {
        entryKey = normalizeKey(mappedPermalink);
        if (verbose) console.log(`   🎯 Found in permalink map: ${mappedPermalink} -> ${entryKey}`);
      }
    }

    if (!entryKey) {
      console.log("⚠️  Could not generate entry key for:", file.path);
      return;
    }

    console.log(`✅ Entry registered: "${entryKey}" from file: ${file.path}`);
    console.log(`   Store size after registration: ${backlinkStore.size}`);

    // ← NEW: Log what was used to create the key
    if (verbose) {
      console.log(`   Attempted keys (in order):`, {
        slug: frontmatter.slug,
        id: frontmatter.id,
        permalink: frontmatter.permalink,
        title: frontmatter.title,
        stem: file.stem,
        path: file.path,
        usedFor: entryKey,
      });
    }

    const entryMeta = {
      title: frontmatter.title ?? null,
      slug: normalizeKey(frontmatter.slug) || entryKey,
      id: normalizeKey(frontmatter.id) || entryKey,
      type: frontmatter.type ?? null,
      url: frontmatter.url ?? null,
    };

    const entry = ensureEntry(entryKey, entryMeta);

    const registerTarget = (rawTarget) => {
      if (!rawTarget) return;
      if (/^(https?:|mailto:|tel:|#)/i.test(rawTarget)) return;
      const normalized = normalizeKey(rawTarget);
      if (!normalized || normalized === entryKey) return;

      entry.outbound.add(normalized);
      const targetEntry = ensureEntry(normalized);
      targetEntry.inbound.add(entryKey);

      if (verbose) {
        console.log(`   🔗 "${entryKey}" → links to → "${normalized}"`);
      }
    };

    visit(tree, (node) => {
      // Handle markdown links: [text](url)
      if (node.type === "link" && typeof node.url === "string") {
        registerTarget(node.url);
      }

      // Handle wiki links: [[page name]]
      if (node.type === "text" && typeof node.value === "string") {
        const wikiRegex = /\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = wikiRegex.exec(node.value)) !== null) {
          const [fullMatch, targetPart] = match;
          if (!targetPart) continue;
          const [target] = targetPart.split("|");
          registerTarget(target?.trim());
        }
      }
    });

    console.log(
      `🔗 TRANSFORMER DONE for ${file.path} - Store now has ${backlinkStore.size} entries`,
    );
  };
}
