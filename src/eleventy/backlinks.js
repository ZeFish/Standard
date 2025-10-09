import fs from "fs";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function (eleventyConfig, options = {}) {
  let backlinksMap = null;

  eleventyConfig.on("eleventy.before", () => {
    backlinksMap = null;
  });

  eleventyConfig.addCollection("_backlinksMap", function (collectionApi) {
    const map = new Map();
    const allPages = collectionApi.getAll();

    allPages.forEach((page) => {
      if (page.url) {
        map.set(page.url, []);
      }
    });

    allPages.forEach((sourcePage) => {
      // Read content from the file system
      let content = null;

      if (sourcePage.inputPath) {
        try {
          content = fs.readFileSync(sourcePage.inputPath, "utf-8");
        } catch (err) {
          // Skip files that can't be read
          return;
        }
      }

      if (typeof content !== "string") {
        return;
      }

      const wikiLinks = content.match(/\[\[([^\]]+)\]\]/g) || [];
      const wikiTargets = wikiLinks
        .map((link) => {
          const match = link.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
          return match ? match[1].trim() : null;
        })
        .filter(Boolean);

      const mdLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      const mdTargets = mdLinks
        .map((link) => {
          const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          return match ? match[2].trim() : null;
        })
        .filter((target) => {
          // Only include internal links (not images, not external URLs)
          return (
            target &&
            !target.startsWith("http://") &&
            !target.startsWith("https://") &&
            !target.includes("/public/img/") &&
            !target.includes("/attachments/") &&
            !target.includes("/assets/")
          );
        });

      const allTargets = [...wikiTargets, ...mdTargets];

      allTargets.forEach((target) => {
        const decodedTarget = decodeURIComponent(target);
        const normalized = slugify(
          decodedTarget
            .replace(/\.md$/, "")
            .replace(/^\.\//, "")
            .replace(/^\//, ""),
        );

        const targetPage = allPages.find((p) => {
          const slug = p.fileSlug ? slugify(p.fileSlug) : null;
          const path = p.url
            ?.toLowerCase()
            .replace(/^\//, "")
            .replace(/\/$/, "");

          return slug === normalized || path === normalized;
        });

        if (targetPage && targetPage.url) {
          const backlinks = map.get(targetPage.url);
          if (!backlinks.find((b) => b.url === sourcePage.url)) {
            backlinks.push(sourcePage);
          }
        }
      });
    });

    backlinksMap = map;

    // Inject backlinks directly into each page's data
    allPages.forEach((page) => {
      page.data.backlinks = map.get(page.url) || [];
    });

    return map;
  });
}
