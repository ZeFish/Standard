import { visit } from "unist-util-visit";
import logger from "../logger.js";

const log = logger({ scope: "Backlinks", verbose: true });

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

  // ✨ Decode URL encoding first
  try {
    value = decodeURIComponent(value);
  } catch (e) {
    // If decoding fails, continue with original value
  }

  value = value.replace(/\\/g, "/");
  value = value.replace(/\.mdx?$/i, "");
  value = value.replace(/\.html?$/i, "");
  value = value.replace(/^\.\//i, "");
  value = value.replace(/^\//i, "");
  value = value.replace(/\/$/, "");
  if (!value) return null;
  const segments = value.split("/").map((segment) => slugifySegment(segment));
  return segments.filter(Boolean).join("/");
}

const backlinkStore = new Map();
const fileBacklinksMap = new Map();
const ignoredPages = new Set();

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
  fileBacklinksMap.clear();
  ignoredPages.clear();
}

export function getCollectedBacklinks() {
  return backlinkStore;
}

export function getFileBacklinksMap() {
  return fileBacklinksMap;
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
  return serialized;
}

export function resetBacklinkGraph() {
  resetBacklinks();
}

/**
 * Check if a key represents an index/root page
 * @param {string} key - The normalized key to check
 * @returns {boolean}
 */
function isIndexPage(key) {
  if (!key) return false;

  // Check if it's a root index (empty string or just "index")
  if (key === "" || key === "index") return true;

  // Check if it ends with /index (like "blog/index")
  if (key.endsWith("/index")) return true;

  return false;
}

export default function remarkBacklinks(options = {}) {
  const { verbose = true, autoIgnoreIndex = true } = options;

  log.info("");

  return function transformer(tree, file) {
    // Get frontmatter from Astro's file.data.astro
    const frontmatter = file.data?.astro?.frontmatter ?? {};

    // Generate entry key - prioritize explicit identifiers
    let entryKey =
      normalizeKey(frontmatter.slug) ||
      normalizeKey(frontmatter.id) ||
      normalizeKey(frontmatter.permalink) ||
      normalizeKey(frontmatter.title) ||
      normalizeKey(file.stem) ||
      normalizeKey(file.path);

    if (!entryKey) {
      log.warn(`Could not generate entry key for: ${file.path}`);
      return;
    }

    // Check if this page should be ignored in backlinks
    // 1. Explicit frontmatter flag
    // 2. Automatic index page detection (if enabled)
    const explicitIgnore = frontmatter.backlinksIgnore === true;
    const autoIgnore = autoIgnoreIndex && isIndexPage(entryKey);
    const shouldIgnore = explicitIgnore || autoIgnore;

    // Track ignored pages
    if (shouldIgnore) {
      ignoredPages.add(entryKey);
      if (verbose) {
        const reason = explicitIgnore ? "explicit" : "auto (index page)";
        log.debug(`Ignoring page in backlinks (${reason}): ${entryKey}`);
      }
    }

    log.debug(`Processing: ${entryKey}`);
    log.warn(`Processing: ${entryKey}`);

    const entryMeta = {
      title: frontmatter.title ?? null,
      slug: normalizeKey(frontmatter.slug) || entryKey,
      id: normalizeKey(frontmatter.id) || entryKey,
      type: frontmatter.type ?? null,
      url: frontmatter.url ?? null,
    };

    const entry = ensureEntry(entryKey, entryMeta);

    let linkCount = 0;

    const registerTarget = (rawTarget) => {
      if (!rawTarget) return;
      if (/^(https?:|mailto:|tel:|#)/i.test(rawTarget)) return;
      const normalized = normalizeKey(rawTarget);
      if (!normalized || normalized === entryKey) return;

      // Skip if current page is ignored
      if (shouldIgnore) return;

      entry.outbound.add(normalized);
      const targetEntry = ensureEntry(normalized);

      // Only add inbound link if the source page is not ignored
      if (!ignoredPages.has(entryKey)) {
        targetEntry.inbound.add(entryKey);
      }

      linkCount++;

      if (verbose) {
        log.debug(`Link: ${entryKey} → ${normalized}`);
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

    // Log summary
    //log.success(`Registered: ${entryKey} (${linkCount} links, ${entry.inbound.size} inbound)${shouldIgnore ? ' [ignored]' : ''}`);

    // Inject backlinks into frontmatter so Astro can access it
    if (!file.data.astro) file.data.astro = {};
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {};

    const pageBacklinks = backlinkStore.get(entryKey);
    if (pageBacklinks) {
      const backlinksData = {
        inbound: Array.from(pageBacklinks.inbound || []).filter(
          (key) => !ignoredPages.has(key),
        ),
        outbound: Array.from(pageBacklinks.outbound || []),
        meta: pageBacklinks.meta || {},
      };
      file.data.astro.frontmatter.backlinks = backlinksData;
      fileBacklinksMap.set(file.stem || entryKey, backlinksData);
    } else {
      const emptyBacklinks = {
        inbound: [],
        outbound: [],
        meta: {},
      };
      file.data.astro.frontmatter.backlinks = emptyBacklinks;
      fileBacklinksMap.set(file.stem || entryKey, emptyBacklinks);
    }

    log.success("");
  };
}
