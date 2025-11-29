/**
 * Generate a permalink from a file ID or stem
 * 
 * @param {string} fileIdOrStem - The file ID (e.g., "foo.md") or stem (e.g., "foo")
 * @returns {string} The generated permalink (e.g., "/foo/")
 */
export function generatePermalink(fileIdOrStem) {
    // Remove extension if present
    const slug = fileIdOrStem.replace(/\.mdx?$/, "");

    // Handle index files (content/index.md -> /)
    if (slug === "index" || slug.endsWith("/index")) {
        return "/";
    }

    // Ensure it starts and ends with /
    return `/${slug}/`;
}

/**
 * Slugify a string for use in URLs
 * 
 * @param {string} str - The string to slugify
 * @returns {string} The slugified string
 */
export function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}
