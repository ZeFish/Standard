#!/usr/bin/env node

/**
 * SEO Analyzer - Standalone CLI Tool
 *
 * Usage:
 *   node scripts/analyzer.js [directory]
 *   npm run check
 */

import * as cheerio from "cheerio";
import fs from "fs";
import { glob } from "glob";
import path from "path";

class SEOAnalyzer {
  constructor(config = {}) {
    const defaults = {
      outputDir: "_site",
      generateReport: true,
      reportPath: "content/report.md", // ✨ Changed to .md
      standardChecks: true,
      ignore: ["**/sitemap.*", "**/robots.*", "**/404.*", "**/report/**"],
      minWordCount: 300,
      titleLength: { min: 30, max: 60 },
      descriptionLength: { min: 120, max: 155 },
    };

    this.config = { ...defaults, ...config };
    this.checks = [
      // ============================================================
      // CORE SEO - CRITICAL
      // ============================================================
      { name: "H1 Tag", test: this.checkH1Tags.bind(this), critical: true },
      {
        name: "Title Length",
        test: this.checkTitleLength.bind(this),
        critical: true,
      },
      {
        name: "Meta Description",
        test: this.checkMetaDescription.bind(this),
        critical: true,
      },
      {
        name: "Language Attribute",
        test: this.checkLangAttribute.bind(this),
        critical: true,
      },
      {
        name: "Canonical URL",
        test: this.checkCanonicalURL.bind(this),
        critical: true,
      },

      // ============================================================
      // CONTENT STRUCTURE
      // ============================================================
      { name: "Word Count", test: this.checkWordCount.bind(this) },
      { name: "H2 Structure", test: this.checkH2Structure.bind(this) },
      { name: "Duplicate H2s", test: this.checkDuplicateH2s.bind(this) },
      {
        name: "Heading Hierarchy",
        test: this.checkHeadingHierarchy.bind(this),
      },
      { name: "Image Alt Text", test: this.checkImageAltText.bind(this) },

      // ============================================================
      // SOCIAL MEDIA
      // ============================================================
      { name: "Open Graph", test: this.checkOpenGraph.bind(this) },
      {
        name: "Open Graph Extended",
        test: this.checkOpenGraphExtended.bind(this),
      },
      { name: "Article Metadata", test: this.checkArticleMetadata.bind(this) },
      { name: "Twitter Cards", test: this.checkTwitterCards.bind(this) },
      {
        name: "Twitter Cards Extended",
        test: this.checkTwitterCardsExtended.bind(this),
      },
      { name: "Pinterest Rich Pins", test: this.checkPinterest.bind(this) },

      // ============================================================
      // STRUCTURED DATA
      // ============================================================
      { name: "Structured Data", test: this.checkStructuredData.bind(this) },
      {
        name: "Organization Schema",
        test: this.checkOrganizationSchema.bind(this),
      },
      { name: "WebSite Schema", test: this.checkWebSiteSchema.bind(this) },
      {
        name: "Breadcrumb Schema",
        test: this.checkBreadcrumbSchema.bind(this),
      },

      // ============================================================
      // DISCOVERABILITY
      // ============================================================
      { name: "RSS/Atom Feed", test: this.checkFeedLink.bind(this) },
      { name: "Sitemap.xml", test: this.checkSitemapExists.bind(this) },
      { name: "Robots.txt", test: this.checkRobotsTxtExists.bind(this) },
      { name: "Robots Meta Tag", test: this.checkRobotsMeta.bind(this) },

      // ============================================================
      // TECHNICAL SEO
      // ============================================================
      {
        name: "Viewport Meta",
        test: this.checkViewport.bind(this),
        critical: true,
      },
      { name: "Theme Color", test: this.checkThemeColor.bind(this) },
      { name: "Web App Manifest", test: this.checkWebAppManifest.bind(this) },
      { name: "Favicons", test: this.checkFavicons.bind(this) },
      { name: "Mobile App Meta", test: this.checkMobileAppMeta.bind(this) },

      // ============================================================
      // PERFORMANCE
      // ============================================================
      { name: "Resource Hints", test: this.checkResourceHints.bind(this) },

      // ============================================================
      // SECURITY & PRIVACY
      // ============================================================
      { name: "Referrer Policy", test: this.checkReferrerPolicy.bind(this) },
      { name: "Content Security Policy", test: this.checkCSP.bind(this) },
      {
        name: "Permissions Policy",
        test: this.checkPermissionsPolicy.bind(this),
      },

      // ============================================================
      // INTERNATIONALIZATION
      // ============================================================
      { name: "Alternate Languages", test: this.checkHreflang.bind(this) },

      // ============================================================
      // WARNINGS
      // ============================================================
      {
        name: "Deprecated Meta Tags",
        test: this.checkDeprecatedMeta.bind(this),
      },
    ];

    // Add Standard Framework-specific checks if enabled
    if (this.config.standardChecks) {
      this.checks.push(
        {
          name: "Vertical Rhythm",
          test: this.checkRhythmClass.bind(this),
          standard: true,
        },
        {
          name: "Prose Layout",
          test: this.checkProseClass.bind(this),
          standard: true,
        },
        {
          name: "Typography Engine",
          test: this.checkTypographyEngine.bind(this),
          standard: true,
        },
        {
          name: "Modern Image Formats",
          test: this.checkImageFormats.bind(this),
          standard: true,
        },
      );
    }
  }

  checkH1Tags($) {
    const h1Count = $("h1").length;
    const h1Text = $("h1").first().text().trim();

    if (h1Count === 1) {
      return {
        status: "pass",
        message: `Found 1 H1 tag: "${h1Text.substring(0, 50)}${h1Text.length > 50 ? "..." : ""}"`,
      };
    } else if (h1Count === 0) {
      return {
        status: "fail",
        message: `No H1 tag found. Every page needs exactly one H1 to tell search engines what it's about.`,
        fix: "Add an <h1> tag with your main page heading.",
      };
    } else {
      const h1Texts = [];
      $("h1").each(function () {
        h1Texts.push($(this).text().trim());
      });
      return {
        status: "fail",
        message: `Found ${h1Count} H1 tags. Use only one H1 per page.`,
        fix: `Choose the most important heading. Found: "${h1Texts.join('", "')}"`,
      };
    }
  }

  checkTitleLength($) {
    const titleElement = $("title").first();
    const title = titleElement.length ? titleElement.text().trim() : "";
    const { min, max } = this.config.titleLength;

    if (title.length === 0) {
      return {
        status: "fail",
        message: `No <title> tag found`,
        fix: "Add a <title> tag in your <head> with a descriptive page title.",
      };
    } else if (title.length >= min && title.length <= max) {
      return {
        status: "pass",
        message: `Title length is optimal (${title.length} chars): "${title}"`,
      };
    } else if (title.length < min) {
      return {
        status: "fail",
        message: `Title too short (${title.length} chars). Aim for ${min}-${max} characters.`,
        fix: `Expand your title with descriptive keywords. Current: "${title}"`,
      };
    } else {
      return {
        status: "fail",
        message: `Title too long (${title.length} chars). Google will truncate it.`,
        fix: `Shorten to ${min}-${max} characters. Current: "${title}"`,
      };
    }
  }

  checkMetaDescription($) {
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const { min, max } = this.config.descriptionLength;

    if (metaDescription.length === 0) {
      return {
        status: "fail",
        message: `No meta description found`,
        fix: `Add <meta name="description" content="Your page summary here">`,
      };
    } else if (metaDescription.length >= min && metaDescription.length <= max) {
      return {
        status: "pass",
        message: `Meta description is optimal (${metaDescription.length} chars)`,
      };
    } else if (metaDescription.length < min) {
      return {
        status: "fail",
        message: `Meta description too short (${metaDescription.length} chars). Aim for ${min}-${max}.`,
        fix: `Expand your description to include key benefits and keywords.`,
      };
    } else {
      return {
        status: "fail",
        message: `Meta description too long (${metaDescription.length} chars). Google will truncate it.`,
        fix: `Shorten to ${min}-${max} characters while keeping key information.`,
      };
    }
  }

  checkLangAttribute($) {
    const lang = $("html").attr("lang");

    if (lang && lang.length >= 2) {
      return {
        status: "pass",
        message: `Language declared: ${lang}`,
      };
    } else {
      return {
        status: "fail",
        message: `No lang attribute on <html> element`,
        fix: `Add lang="en" (or your language code) to <html> tag.`,
      };
    }
  }

  checkCanonicalURL($) {
    const canonical = $('link[rel="canonical"]').attr("href") || "";

    if (canonical.length > 0) {
      return {
        status: "pass",
        message: `Canonical URL found`,
      };
    } else {
      return {
        status: "fail",
        message: `No canonical URL found`,
        fix: `Add <link rel="canonical" href="https://yourdomain.com/page"> to prevent duplicate content issues.`,
      };
    }
  }

  checkWordCount($) {
    const mainContent =
      $("main").length > 0
        ? $("main")
        : $("article").length > 0
          ? $("article")
          : $("body");

    const textContent = mainContent.text();
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    const minCount = this.config.minWordCount;

    if (wordCount >= minCount) {
      return {
        status: "pass",
        message: `Word count is good (${wordCount} words)`,
      };
    } else {
      return {
        status: "fail",
        message: `Word count is low (${wordCount} words). Aim for at least ${minCount} words.`,
        fix: "Add more valuable content. Search engines favor comprehensive pages.",
      };
    }
  }

  checkH2Structure($) {
    const h2Count = $("h2").length;

    if (h2Count >= 2) {
      return {
        status: "pass",
        message: `Found ${h2Count} H2 tags for good content structure`,
      };
    } else if (h2Count === 1) {
      return {
        status: "info",
        message: `Found only 1 H2 tag. Consider breaking content into more sections.`,
        fix: "Add more H2 headings to structure longer content.",
      };
    } else {
      return {
        status: "fail",
        message: `No H2 tags found. Your content needs structure.`,
        fix: "Break your content into sections with H2 headings.",
      };
    }
  }

  checkDuplicateH2s($) {
    const h2Texts = [];
    const duplicateH2s = [];

    $("h2").each(function () {
      const h2Text = $(this).text().trim().toLowerCase();
      if (h2Texts.includes(h2Text)) {
        if (!duplicateH2s.includes(h2Text)) {
          duplicateH2s.push(h2Text);
        }
      } else {
        h2Texts.push(h2Text);
      }
    });

    if (duplicateH2s.length === 0) {
      return {
        status: "pass",
        message: `No duplicate H2 tags found`,
      };
    } else {
      return {
        status: "fail",
        message: `Found ${duplicateH2s.length} duplicate H2 heading(s)`,
        fix: `Make each heading unique. Duplicates: "${duplicateH2s.join('", "')}"`,
      };
    }
  }

  checkHeadingHierarchy($) {
    const headings = [];
    $("h1, h2, h3, h4, h5, h6").each(function () {
      const level = parseInt(this.tagName.substring(1));
      const text = $(this).text().trim();
      headings.push({ level, text });
    });

    const issues = [];
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];

      if (current.level - previous.level > 1) {
        issues.push(
          `Skipped heading level: H${previous.level} → H${current.level} (should be H${previous.level + 1})`,
        );
      }
    }

    if (issues.length === 0) {
      return {
        status: "pass",
        message: `Heading hierarchy is logical (${headings.length} headings checked)`,
      };
    } else {
      return {
        status: "fail",
        message: `Heading hierarchy issues found`,
        fix: issues.join("; "),
      };
    }
  }

  checkImageAltText($) {
    const images = $("img");
    const issues = [];
    let totalImages = images.length;
    let imagesWithProperAlt = 0;

    if (totalImages === 0) {
      return {
        status: "info",
        message: `No images found on page`,
      };
    }

    images.each(function () {
      const alt = $(this).attr("alt");
      const src = $(this).attr("src") || "unknown source";
      const isDecorative = alt === "";

      if (alt === undefined) {
        issues.push(`Missing alt attribute: ${src}`);
      } else if (alt.length > 125) {
        issues.push(`Alt text too long (${alt.length} chars): ${src}`);
      } else if (alt.length > 0 && alt.length < 125) {
        imagesWithProperAlt++;
      } else if (isDecorative) {
        imagesWithProperAlt++;
      }
    });

    if (issues.length === 0) {
      return {
        status: "pass",
        message: `All ${totalImages} image(s) have proper alt text`,
      };
    } else {
      return {
        status: "fail",
        message: `${issues.length} image(s) with issues out of ${totalImages}`,
        fix: issues.join("; "),
      };
    }
  }

  checkOpenGraph($) {
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const ogDescription =
      $('meta[property="og:description"]').attr("content") || "";
    const ogImage = $('meta[property="og:image"]').attr("content") || "";

    const missing = [];
    if (!ogTitle) missing.push("og:title");
    if (!ogDescription) missing.push("og:description");
    if (!ogImage) missing.push("og:image");

    if (missing.length === 0) {
      return {
        status: "pass",
        message: `All essential Open Graph tags present`,
      };
    } else {
      return {
        status: "fail",
        message: `Missing Open Graph tags: ${missing.join(", ")}`,
        fix: `Add <meta property="${missing[0]}" content="..."> to improve social sharing.`,
      };
    }
  }

  checkOpenGraphExtended($) {
    const ogLocale = $('meta[property="og:locale"]').attr("content") || "";
    const ogSiteName = $('meta[property="og:site_name"]').attr("content") || "";
    const ogType = $('meta[property="og:type"]').attr("content") || "";
    const ogImageAlt = $('meta[property="og:image:alt"]').attr("content") || "";
    const ogImageWidth =
      $('meta[property="og:image:width"]').attr("content") || "";
    const ogImageHeight =
      $('meta[property="og:image:height"]').attr("content") || "";
    const ogUpdatedTime =
      $('meta[property="og:updated_time"]').attr("content") || "";

    const present = [];
    const missing = [];

    if (ogLocale) present.push("og:locale");
    else missing.push("og:locale");

    if (ogSiteName) present.push("og:site_name");
    else missing.push("og:site_name");

    if (ogType) present.push("og:type");
    else missing.push("og:type");

    if (ogImageAlt) present.push("og:image:alt");
    if (ogImageWidth && ogImageHeight) present.push("og:image dimensions");
    if (ogUpdatedTime) present.push("og:updated_time");

    if (missing.length === 0) {
      return {
        status: "pass",
        message: `Extended OG tags complete: ${present.join(", ")}`,
      };
    } else if (present.length >= 2) {
      return {
        status: "pass",
        message: `Most extended OG tags present. Optional: ${missing.join(", ")}`,
      };
    } else {
      return {
        status: "info",
        message: `Extended OG tags could be improved`,
        fix: `Add: ${missing.join(", ")} for better social media previews.`,
      };
    }
  }

  checkArticleMetadata($) {
    const ogType = $('meta[property="og:type"]').attr("content") || "";

    if (ogType !== "article") {
      return {
        status: "pass",
        message: `Not an article page (og:type: ${ogType || "not set"})`,
      };
    }

    const articlePublished =
      $('meta[property="article:published_time"]').attr("content") || "";
    const articleModified =
      $('meta[property="article:modified_time"]').attr("content") || "";
    const articleAuthor =
      $('meta[property="article:author"]').attr("content") || "";
    const articleSection =
      $('meta[property="article:section"]').attr("content") || "";
    const articleTags = $('meta[property="article:tag"]').length;

    const issues = [];
    const present = [];

    if (articlePublished) present.push("published_time");
    else issues.push("article:published_time missing");

    if (articleAuthor) present.push("author");
    else issues.push("article:author missing");

    if (articleSection) present.push("section");
    if (articleTags > 0) present.push(`${articleTags} tags`);
    if (articleModified) present.push("modified_time");

    if (issues.length === 0) {
      return {
        status: "pass",
        message: `Article metadata complete: ${present.join(", ")}`,
      };
    } else {
      return {
        status: "fail",
        message: `Article page missing metadata`,
        fix:
          issues.join("; ") + ". Add these for better content categorization.",
      };
    }
  }

  checkTwitterCards($) {
    const twitterCard = $('meta[name="twitter:card"]').attr("content") || "";

    if (twitterCard) {
      return {
        status: "pass",
        message: `Twitter Card configured: ${twitterCard}`,
      };
    } else {
      return {
        status: "info",
        message: `No Twitter Card metadata found`,
        fix: `Add <meta name="twitter:card" content="summary_large_image"> for rich Twitter previews.`,
      };
    }
  }

  checkTwitterCardsExtended($) {
    const twitterCard = $('meta[name="twitter:card"]').attr("content") || "";
    const twitterSite = $('meta[name="twitter:site"]').attr("content") || "";
    const twitterCreator =
      $('meta[name="twitter:creator"]').attr("content") || "";
    const twitterImageAlt =
      $('meta[name="twitter:image:alt"]').attr("content") || "";

    if (!twitterCard) {
      return {
        status: "info",
        message: "No Twitter Card configured",
      };
    }

    const present = [];
    const missing = [];

    if (twitterSite) present.push("@site");
    if (twitterCreator) present.push("@creator");
    else missing.push("twitter:creator");

    if (twitterImageAlt) present.push("image:alt");
    else missing.push("twitter:image:alt (accessibility)");

    if (present.length >= 2) {
      return {
        status: "pass",
        message: `Twitter Card enhanced: ${present.join(", ")}`,
      };
    } else {
      return {
        status: "info",
        message: `Twitter Card could be enhanced`,
        fix: `Consider adding: ${missing.join(", ")}`,
      };
    }
  }

  checkPinterest($) {
    const pinterestRichPin =
      $('meta[name="pinterest-rich-pin"]').attr("content") || "";
    const ogSeeAlso = $('meta[property="og:see_also"]').attr("content") || "";

    if (pinterestRichPin === "true" || ogSeeAlso) {
      return {
        status: "pass",
        message: `Pinterest Rich Pins enabled`,
      };
    } else {
      return {
        status: "info",
        message: `Pinterest Rich Pins not configured`,
        fix: `Add <meta name="pinterest-rich-pin" content="true"> for enhanced Pinterest sharing.`,
      };
    }
  }

  checkStructuredData($) {
    const jsonLd = $('script[type="application/ld+json"]');

    if (jsonLd.length > 0) {
      try {
        const data = JSON.parse(jsonLd.first().html());
        const schemaType = data["@type"] || "Unknown";

        return {
          status: "pass",
          message: `Structured data found: ${schemaType}`,
        };
      } catch (error) {
        return {
          status: "fail",
          message: "Structured data found but invalid JSON",
          fix: "Validate your JSON-LD at https://search.google.com/test/rich-results",
        };
      }
    } else {
      return {
        status: "info",
        message: "No structured data (JSON-LD) found",
        fix: "Add Schema.org markup for better search result appearance.",
      };
    }
  }

  checkOrganizationSchema($) {
    const jsonLdScripts = $('script[type="application/ld+json"]');
    let hasOrganization = false;

    jsonLdScripts.each(function () {
      try {
        const data = JSON.parse($(this).html());
        if (data["@type"] === "Organization" || data["@type"] === "Person") {
          hasOrganization = true;
        }
      } catch (e) {}
    });

    if (hasOrganization) {
      return {
        status: "pass",
        message: "Organization/Person schema found (E-A-T signal)",
      };
    } else {
      return {
        status: "info",
        message: "No Organization/Person schema found",
        fix: "Add site-wide Organization or Person schema to establish authoritativeness.",
      };
    }
  }

  checkWebSiteSchema($) {
    const jsonLdScripts = $('script[type="application/ld+json"]');
    let hasWebSite = false;
    let hasSearchAction = false;

    jsonLdScripts.each(function () {
      try {
        const data = JSON.parse($(this).html());
        if (data["@type"] === "WebSite") {
          hasWebSite = true;
          if (
            data.potentialAction &&
            data.potentialAction["@type"] === "SearchAction"
          ) {
            hasSearchAction = true;
          }
        }
      } catch (e) {}
    });

    if (hasWebSite && hasSearchAction) {
      return {
        status: "pass",
        message:
          "WebSite schema with SearchAction (enables site search in Google)",
      };
    } else if (hasWebSite) {
      return {
        status: "pass",
        message:
          "WebSite schema found (add SearchAction for Google site search box)",
      };
    } else {
      return {
        status: "info",
        message: "No WebSite schema found",
        fix: "Add WebSite schema with SearchAction to enable Google site search box in SERPs.",
      };
    }
  }

  checkBreadcrumbSchema($) {
    const jsonLdScripts = $('script[type="application/ld+json"]');
    let hasBreadcrumb = false;

    jsonLdScripts.each(function () {
      try {
        const data = JSON.parse($(this).html());
        if (data["@type"] === "BreadcrumbList") {
          hasBreadcrumb = true;
        }
      } catch (e) {}
    });

    if (hasBreadcrumb) {
      return {
        status: "pass",
        message: "BreadcrumbList schema found (improves navigation in SERPs)",
      };
    } else {
      return {
        status: "info",
        message: "No BreadcrumbList schema found",
        fix: "Add BreadcrumbList schema to show navigation path in search results.",
      };
    }
  }

  checkFeedLink($) {
    const rssFeed = $('link[type="application/rss+xml"]').attr("href") || "";
    const atomFeed = $('link[type="application/atom+xml"]').attr("href") || "";

    if (rssFeed || atomFeed) {
      const feedType = rssFeed ? "RSS" : "Atom";
      const feedUrl = rssFeed || atomFeed;
      return {
        status: "pass",
        message: `${feedType} feed found: ${feedUrl}`,
      };
    } else {
      return {
        status: "info",
        message: "No RSS/Atom feed link found",
        fix: 'Add <link rel="alternate" type="application/atom+xml" href="/feed.xml"> to <head>',
      };
    }
  }

  checkSitemapExists($) {
    const sitemapPath = path.join(this.config.outputDir, "sitemap.xml");
    const sitemapExists = fs.existsSync(sitemapPath);
    const sitemapLink = $('link[rel="sitemap"]').attr("href") || "";

    if (sitemapExists) {
      if (sitemapLink) {
        return {
          status: "pass",
          message: "Sitemap exists and is linked in HTML",
        };
      } else {
        return {
          status: "pass",
          message:
            "Sitemap.xml exists (consider adding <link rel='sitemap'> to HTML)",
        };
      }
    } else {
      return {
        status: "fail",
        message: "No sitemap.xml found",
        fix: "Generate a sitemap.xml to help search engines discover all your pages.",
      };
    }
  }

  checkRobotsTxtExists($) {
    const robotsPath = path.join(this.config.outputDir, "robots.txt");
    const robotsExists = fs.existsSync(robotsPath);

    if (robotsExists) {
      try {
        const content = fs.readFileSync(robotsPath, "utf8");
        const hasSitemap = content.includes("Sitemap:");
        const hasUserAgent = content.includes("User-agent:");

        if (hasSitemap && hasUserAgent) {
          return {
            status: "pass",
            message: "robots.txt exists with sitemap reference",
          };
        } else if (!hasSitemap) {
          return {
            status: "info",
            message: "robots.txt exists but doesn't reference sitemap",
            fix: "Add 'Sitemap: https://yourdomain.com/sitemap.xml' to robots.txt",
          };
        } else {
          return {
            status: "pass",
            message: "robots.txt exists",
          };
        }
      } catch (error) {
        return {
          status: "info",
          message: "robots.txt exists but couldn't be read",
        };
      }
    } else {
      return {
        status: "fail",
        message: "No robots.txt found",
        fix: "Create robots.txt with sitemap reference.",
      };
    }
  }

  checkRobotsMeta($) {
    const robotsMeta = $('meta[name="robots"]').attr("content") || "";

    if (!robotsMeta) {
      return {
        status: "pass",
        message: "No robots meta tag (defaults to index, follow)",
      };
    }

    if (robotsMeta.includes("noindex")) {
      return {
        status: "fail",
        message: `Page set to "noindex" - won't appear in search results`,
        fix: "Remove noindex directive unless this page should be hidden from search engines.",
      };
    }

    return {
      status: "pass",
      message: `Robots directive: ${robotsMeta}`,
    };
  }

  checkViewport($) {
    const viewport = $('meta[name="viewport"]').attr("content") || "";

    if (viewport.includes("width=device-width")) {
      return {
        status: "pass",
        message: `Viewport configured for mobile`,
      };
    } else {
      return {
        status: "fail",
        message: `Missing or incorrect viewport meta tag`,
        fix: `Add <meta name="viewport" content="width=device-width, initial-scale=1">`,
      };
    }
  }

  checkThemeColor($) {
    const themeColorLight =
      $('meta[name="theme-color"][media*="light"]').attr("content") || "";
    const themeColorDark =
      $('meta[name="theme-color"][media*="dark"]').attr("content") || "";
    const themeColorDefault =
      $('meta[name="theme-color"]:not([media])').attr("content") || "";

    if (themeColorLight && themeColorDark) {
      return {
        status: "pass",
        message: `Theme colors configured for light/dark mode: ${themeColorLight} / ${themeColorDark}`,
      };
    } else if (themeColorDefault) {
      return {
        status: "pass",
        message: `Theme color set: ${themeColorDefault} (consider adding dark mode variant)`,
      };
    } else {
      return {
        status: "info",
        message: "No theme-color meta tag found",
        fix: 'Add <meta name="theme-color" content="#yourcolor"> for branded mobile browser chrome.',
      };
    }
  }

  checkWebAppManifest($) {
    const manifest = $('link[rel="manifest"]').attr("href") || "";

    if (manifest) {
      const manifestPath = path.join(
        this.config.outputDir,
        manifest.replace(/^\//, ""),
      );
      if (fs.existsSync(manifestPath)) {
        return {
          status: "pass",
          message: "Web App Manifest found and exists",
        };
      } else {
        return {
          status: "fail",
          message: "Web App Manifest linked but file not found",
          fix: `Create manifest file at ${manifest}`,
        };
      }
    } else {
      return {
        status: "info",
        message: "No Web App Manifest found",
        fix: 'Add <link rel="manifest" href="/site.webmanifest"> for PWA support.',
      };
    }
  }

  checkFavicons($) {
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').length;
    const appleTouchIcon = $('link[rel="apple-touch-icon"]').length;
    const maskIcon = $('link[rel="mask-icon"]').length;
    const manifest = $('link[rel="manifest"]').length;

    const present = [];

    if (favicon > 0) present.push(`${favicon} favicon(s)`);
    if (appleTouchIcon > 0) present.push("apple-touch-icon");
    if (maskIcon > 0) present.push("Safari pinned tab");
    if (manifest > 0) present.push("PWA manifest");

    if (present.length >= 2) {
      return {
        status: "pass",
        message: `Favicons configured: ${present.join(", ")}`,
      };
    } else if (favicon > 0) {
      return {
        status: "pass",
        message: "Basic favicon present (consider adding apple-touch-icon)",
      };
    } else {
      return {
        status: "fail",
        message: "No favicons found",
        fix: 'Add <link rel="icon" href="/favicon.ico"> at minimum.',
      };
    }
  }

  checkMobileAppMeta($) {
    const mobileCapable =
      $('meta[name="mobile-web-app-capable"]').attr("content") || "";
    const appleCapable =
      $('meta[name="apple-mobile-web-app-capable"]').attr("content") || "";
    const appleStatusBar =
      $('meta[name="apple-mobile-web-app-status-bar-style"]').attr("content") ||
      "";

    const features = [];

    if (mobileCapable === "yes") features.push("mobile-web-app");
    if (appleCapable === "yes") features.push("iOS-web-app");
    if (appleStatusBar) features.push(`status-bar: ${appleStatusBar}`);

    if (features.length >= 2) {
      return {
        status: "pass",
        message: `Mobile app features: ${features.join(", ")}`,
      };
    } else if (features.length === 1) {
      return {
        status: "info",
        message: "Partial mobile app support",
        fix: "Add apple-mobile-web-app-status-bar-style for better iOS appearance.",
      };
    } else {
      return {
        status: "info",
        message: "No mobile app meta tags (okay for most sites)",
      };
    }
  }

  checkResourceHints($) {
    const preconnect = $('link[rel="preconnect"]').length;
    const dnsPrefetch = $('link[rel="dns-prefetch"]').length;
    const preload = $('link[rel="preload"]').length;

    const hints = [];
    if (preconnect > 0) hints.push(`${preconnect} preconnect`);
    if (dnsPrefetch > 0) hints.push(`${dnsPrefetch} dns-prefetch`);
    if (preload > 0) hints.push(`${preload} preload`);

    if (hints.length > 0) {
      return {
        status: "pass",
        message: `Resource hints found: ${hints.join(", ")}`,
      };
    } else {
      return {
        status: "info",
        message: "No resource hints found",
        fix: 'Add <link rel="preconnect"> for external domains to improve performance.',
      };
    }
  }

  checkReferrerPolicy($) {
    const referrerPolicy = $('meta[name="referrer"]').attr("content") || "";

    if (referrerPolicy) {
      const recommended = [
        "strict-origin-when-cross-origin",
        "no-referrer-when-downgrade",
      ];
      if (recommended.includes(referrerPolicy)) {
        return {
          status: "pass",
          message: `Referrer policy set: ${referrerPolicy}`,
        };
      } else {
        return {
          status: "pass",
          message: `Referrer policy set: ${referrerPolicy} (consider strict-origin-when-cross-origin)`,
        };
      }
    } else {
      return {
        status: "info",
        message: "No referrer policy set (browser default applies)",
        fix: 'Add <meta name="referrer" content="strict-origin-when-cross-origin"> for privacy.',
      };
    }
  }

  checkCSP($) {
    const csp =
      $('meta[http-equiv="Content-Security-Policy"]').attr("content") || "";

    if (csp) {
      return {
        status: "pass",
        message: "Content Security Policy configured (enhances security)",
      };
    } else {
      return {
        status: "info",
        message: "No Content Security Policy found",
        fix: "Consider adding CSP via HTTP headers or meta tag to prevent XSS attacks.",
      };
    }
  }

  checkPermissionsPolicy($) {
    const permissionsPolicy =
      $('meta[http-equiv="Permissions-Policy"]').attr("content") || "";

    if (permissionsPolicy) {
      return {
        status: "pass",
        message: "Permissions Policy configured (enhances privacy)",
      };
    } else {
      return {
        status: "info",
        message: "No Permissions Policy found",
        fix: "Consider adding Permissions-Policy to disable unused browser APIs.",
      };
    }
  }

  checkHreflang($) {
    const hreflang = $('link[rel="alternate"][hreflang]').length;

    if (hreflang > 0) {
      return {
        status: "pass",
        message: `Alternate language versions configured (${hreflang} languages)`,
      };
    } else {
      return {
        status: "info",
        message: "No hreflang tags found (okay for single-language sites)",
      };
    }
  }

  checkDeprecatedMeta($) {
    const keywords = $('meta[name="keywords"]').attr("content") || "";
    const contentType = $('meta[http-equiv="Content-Type"]').length;
    const xUaCompatible = $('meta[http-equiv="X-UA-Compatible"]').length;

    const warnings = [];

    if (keywords) {
      warnings.push(
        'meta name="keywords" is obsolete (Google ignores it since 2009). Remove it.',
      );
    }

    if (contentType > 0) {
      warnings.push(
        'meta http-equiv="Content-Type" is redundant with charset meta tag (HTML5).',
      );
    }

    if (xUaCompatible > 0) {
      warnings.push(
        'meta http-equiv="X-UA-Compatible" is obsolete (IE11 is dead). Remove it.',
      );
    }

    if (warnings.length > 0) {
      return {
        status: "info",
        message: `Found ${warnings.length} deprecated meta tag(s)`,
        fix: warnings.join(" "),
      };
    } else {
      return {
        status: "pass",
        message: "No deprecated meta tags found",
      };
    }
  }

  checkRhythmClass($) {
    const hasRhythm = $("html.rhythm, body.rhythm").length > 0;

    if (hasRhythm) {
      return {
        status: "pass",
        message: "Vertical rhythm system active",
      };
    } else {
      return {
        status: "info",
        message: "Vertical rhythm not detected",
        fix: 'Add class="rhythm" to <html> element for consistent spacing.',
      };
    }
  }

  checkProseClass($) {
    const hasProse = $(".prose").length > 0;
    const hasArticleTag = $("article").length > 0;

    if (hasProse) {
      return {
        status: "pass",
        message: "Reading-optimized layout detected",
      };
    } else if (hasArticleTag) {
      return {
        status: "info",
        message: "Article content found without .prose class",
        fix: 'Add class="prose" to <article> for optimal reading experience.',
      };
    } else {
      return {
        status: "info",
        message: "No .prose layout detected",
      };
    }
  }

  checkTypographyEngine($) {
    const hasStandardJS =
      $('script[src*="standard.js"], script[src*="standard.min.js"]').length >
      0;
    const hasStandardInit = $('script:contains("new Standard")').length > 0;

    if (hasStandardJS || hasStandardInit) {
      return {
        status: "pass",
        message: "Typography engine detected",
      };
    } else {
      return {
        status: "info",
        message: "Typography engine not detected",
        fix: "Add standard.js for smart quotes, widow prevention, and typography enhancements.",
      };
    }
  }

  checkImageFormats($) {
    const images = $("img");
    const outdatedFormats = [];
    const modernFormats = [];

    images.each(function () {
      const src = $(this).attr("src") || "";
      if (src.match(/\.(jpg|jpeg|png)$/i)) {
        outdatedFormats.push(src);
      } else if (src.match(/\.(webp|avif)$/i)) {
        modernFormats.push(src);
      }
    });

    if (images.length === 0) {
      return { status: "info", message: "No images found" };
    }

    if (outdatedFormats.length === 0) {
      return {
        status: "pass",
        message: `All ${images.length} image(s) use modern formats`,
      };
    } else {
      const percentage = Math.round(
        (outdatedFormats.length / images.length) * 100,
      );
      return {
        status: "info",
        message: `${outdatedFormats.length} image(s) (${percentage}%) could use WebP/AVIF for better performance`,
        fix: "Convert JPG/PNG images to WebP for 30-50% smaller file sizes.",
      };
    }
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const $ = cheerio.load(content);

      const results = {
        file: path.relative(this.config.outputDir, filePath),
        checks: [],
        summary: { passed: 0, failed: 0, info: 0 },
      };

      this.checks.forEach((check) => {
        const result = check.test($);
        results.checks.push({
          name: check.name,
          status: result.status,
          message: result.message,
          fix: result.fix || null,
          critical: check.critical || false,
          standard: check.standard || false,
        });

        if (result.status === "pass") {
          results.summary.passed++;
        } else if (result.status === "fail") {
          results.summary.failed++;
        } else {
          results.summary.info++;
        }
      });

      return results;
    } catch (error) {
      return {
        file: path.relative(this.config.outputDir, filePath),
        error: error.message,
        checks: [],
        summary: { passed: 0, failed: 0, info: 0 },
      };
    }
  }

  async analyzeDirectory(directory) {
    const targetDir = directory || this.config.outputDir;
    this.config.outputDir = targetDir;

    try {
      const pattern = path.join(targetDir, "**", "*.html");
      const htmlFiles = await glob(pattern, {
        ignore: this.config.ignore.map((p) => path.join(targetDir, p)),
      });

      if (htmlFiles.length === 0) {
        console.log(`\n⚠️  No HTML files found in ${targetDir}`);
        return;
      }

      const allResults = htmlFiles.map((file) => this.analyzeFile(file));
      this.displayResults(allResults);

      if (this.config.generateReport) {
        this.saveReport(allResults);
      }

      return allResults;
    } catch (error) {
      console.error("\n❌ Error analyzing directory:", error.message);
      throw error;
    }
  }

  displayResults(results) {
    console.log("\n");
    console.log("╔" + "═".repeat(78) + "╗");
    console.log(
      "║" + " ".repeat(23) + "🔍 SEO ANALYSIS REPORT" + " ".repeat(33) + "║",
    );
    console.log("╚" + "═".repeat(78) + "╝");

    let totalPassed = 0;
    let totalFailed = 0;
    let totalInfo = 0;

    results.forEach((result) => {
      if (result.error) {
        console.log(`\n❌ Error analyzing ${result.file}: ${result.error}`);
        return;
      }

      console.log(`\n📄 ${result.file}`);
      console.log("─".repeat(80));

      const failed = result.checks.filter((c) => c.status === "fail");
      const passed = result.checks.filter((c) => c.status === "pass");
      const info = result.checks.filter((c) => c.status === "info");

      if (failed.length > 0) {
        failed.forEach((check) => {
          const icon = check.critical ? "🔴" : "❌";
          console.log(`   ${icon} ${check.name}: ${check.message}`);
          if (check.fix) {
            console.log(`      💡 ${check.fix}`);
          }
        });
      }

      if (info.length > 0) {
        info.forEach((check) => {
          console.log(`   ℹ️  ${check.name}: ${check.message}`);
          if (check.fix) {
            console.log(`      💡 ${check.fix}`);
          }
        });
      }

      if (passed.length > 0) {
        console.log(`   ✅ ${passed.length} checks passed`);
      }

      const score = Math.round(
        (result.summary.passed / result.checks.length) * 100,
      );
      const scoreEmoji =
        score >= 90 ? "🎉" : score >= 75 ? "👍" : score >= 50 ? "⚠️" : "🔥";

      console.log(
        `\n   ${scoreEmoji} Score: ${score}% (${result.summary.passed}/${result.checks.length} passed, ${result.summary.failed} failed, ${result.summary.info} info)`,
      );

      totalPassed += result.summary.passed;
      totalFailed += result.summary.failed;
      totalInfo += result.summary.info;
    });

    console.log("\n" + "═".repeat(80));
    console.log(`\n📊 OVERALL SUMMARY:`);
    console.log(`   Files analyzed: ${results.filter((r) => !r.error).length}`);
    console.log(`   Total checks: ${totalPassed + totalFailed + totalInfo}`);
    console.log(`   ✅ Passed: ${totalPassed}`);
    console.log(`   ❌ Failed: ${totalFailed}`);
    console.log(`   ℹ️  Info: ${totalInfo}`);

    const overallScore = Math.round(
      (totalPassed / (totalPassed + totalFailed + totalInfo)) * 100,
    );
    console.log(`   🎯 Overall Score: ${overallScore}%`);
    console.log("");
  }

  escapeHtmlInText(text) {
    // Wrap HTML tags in backticks for inline display
    return text.replace(/(<[^>]+>)/g, "`$1`");
  }

  // ✨ NEW: Generate Markdown Report
  generateMarkdownReport(results) {
    const timestamp = new Date().toISOString();
    const filesAnalyzed = results.filter((r) => !r.error).length;
    const totalPassed = results.reduce((sum, r) => sum + r.summary.passed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.summary.failed, 0);
    const totalInfo = results.reduce((sum, r) => sum + r.summary.info, 0);
    const totalChecks = totalPassed + totalFailed + totalInfo;
    const overallScore = Math.round((totalPassed / totalChecks) * 100);

    let md = `---\n`;
    md += `permalink: "/report/"\n`;
    md += `---\n\n`;

    md += `# SEO Analysis Report\n\n`;
    md += `**Generated:** ${new Date(timestamp).toLocaleString()}\n\n`;
    md += `---\n\n`;

    // Overall Summary
    md += `## 📊 Overall Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Files Analyzed | ${filesAnalyzed} |\n`;
    md += `| Total Checks | ${totalChecks} |\n`;
    md += `| ✅ Passed | ${totalPassed} |\n`;
    md += `| ❌ Failed | ${totalFailed} |\n`;
    md += `| ℹ️ Info | ${totalInfo} |\n`;
    md += `| 🎯 Overall Score | **${overallScore}%** |\n\n`;

    // Score interpretation
    const scoreEmoji =
      overallScore >= 90
        ? "🎉 Excellent"
        : overallScore >= 75
          ? "👍 Good"
          : overallScore >= 50
            ? "⚠️ Needs Improvement"
            : "🔥 Critical Issues";
    md += `**Status:** ${scoreEmoji}\n\n`;

    md += `---\n\n`;

    // Individual File Results
    md += `## 📄 Detailed Results\n\n`;

    results.forEach((result, index) => {
      if (result.error) {
        md += `### ❌ ${result.file}\n\n`;
        md += `**Error:** ${result.error}\n\n`;
        return;
      }

      const score = Math.round(
        (result.summary.passed / result.checks.length) * 100,
      );
      const scoreEmoji =
        score >= 90 ? "🎉" : score >= 75 ? "👍" : score >= 50 ? "⚠️" : "🔥";

      md += `### ${index + 1}. ${result.file}\n\n`;
      md += `${scoreEmoji} **Score: ${score}%** (${result.summary.passed}/${result.checks.length} passed)\n\n`;

      // Failed checks (critical first)
      const criticalFailed = result.checks.filter(
        (c) => c.status === "fail" && c.critical,
      );
      const normalFailed = result.checks.filter(
        (c) => c.status === "fail" && !c.critical,
      );
      const infoChecks = result.checks.filter((c) => c.status === "info");

      if (criticalFailed.length > 0) {
        md += `#### 🔴 Critical Issues (${criticalFailed.length})\n\n`;
        criticalFailed.forEach((check) => {
          md += `**${check.name}**\n`;
          md += `- ❌ ${this.escapeHtmlInText(check.message)}\n`;
          if (check.fix) {
            md += `- 💡 **Fix:** ${this.escapeHtmlInText(check.fix)}\n`;
          }
          md += `\n`;
        });
      }

      if (normalFailed.length > 0) {
        md += `#### ❌ Failed Checks (${normalFailed.length})\n\n`;
        normalFailed.forEach((check) => {
          md += `**${check.name}**\n`;
          md += `- ${this.escapeHtmlInText(check.message)}\n`;
          if (check.fix) {
            md += `- 💡 **Fix:** ${this.escapeHtmlInText(check.fix)}\n`;
          }
          md += `\n`;
        });
      }

      if (infoChecks.length > 0) {
        md += `#### ℹ️ Suggestions & Info (${infoChecks.length})\n\n`;
        md += `<details>\n<summary>Click to expand</summary>\n\n`;
        infoChecks.forEach((check) => {
          md += `**${check.name}**\n`;
          md += `- ${this.escapeHtmlInText(check.message)}\n`;
          if (check.fix) {
            md += `- 💡 ${this.escapeHtmlInText(check.fix)}\n`;
          }
          md += `\n`;
        });
        md += `</details>\n\n`;
      }

      // Passed checks (collapsed by default)
      const passedChecks = result.checks.filter((c) => c.status === "pass");
      if (passedChecks.length > 0) {
        md += `<details>\n<summary>✅ Passed Checks (${passedChecks.length})</summary>\n\n`;
        passedChecks.forEach((check) => {
          md += `- ✅ ${check.name}: ${this.escapeHtmlInText(check.message)}\n`;
        });
        md += `\n</details>\n\n`;
      }

      md += `---\n\n`;
    });

    // Recommendations section
    md += `## 💡 General Recommendations\n\n`;

    if (totalFailed > 0) {
      md += `### Priority Actions\n\n`;
      md += `1. **Fix Critical Issues First** - Address all 🔴 critical failures immediately\n`;
      md += `2. **Address Failed Checks** - Work through ❌ failed checks by priority\n`;
      md += `3. **Review Suggestions** - Consider implementing ℹ️ informational suggestions\n\n`;
    }

    md += `### SEO Best Practices\n\n`;
    md += `- Ensure every page has a unique, descriptive title (30-60 characters)\n`;
    md += `- Write compelling meta descriptions (120-155 characters)\n`;
    md += `- Use a single H1 tag per page that describes the main topic\n`;
    md += `- Structure content with proper heading hierarchy (H1 → H2 → H3)\n`;
    md += `- Add descriptive alt text to all images\n`;
    md += `- Implement structured data (JSON-LD) for rich search results\n`;
    md += `- Configure Open Graph tags for social media sharing\n`;
    md += `- Maintain a sitemap.xml and robots.txt file\n`;
    md += `- Use HTTPS and ensure canonical URLs are set\n\n`;

    md += `---\n\n`;
    md += `*Report generated by SEO Analyzer v1.0*\n`;

    return md;
  }

  // ✨ UPDATED: Save Markdown Report
  saveReport(results) {
    try {
      const report = this.generateMarkdownReport(results);

      fs.writeFileSync(this.config.reportPath, report, "utf8");

      console.log(`📋 Report saved to ${this.config.reportPath}`);
    } catch (error) {
      console.error(`⚠️  Could not save report: ${error.message}`);
    }
  }
}

// CLI usage
const args = process.argv.slice(2);
const directory = args[0] || "_site";

const analyzer = new SEOAnalyzer();
analyzer.analyzeDirectory(directory);
