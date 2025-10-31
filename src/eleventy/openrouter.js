/**
 * Standard Framework OpenRouter AI Plugin
 *
 * @component OpenRouter AI Integration
 * @category 11ty Plugins
 * @author ...
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (eleventyConfig, site = {}) {
  // Ensure structure
  site.standard = site.standard || {};
  site.standard.ai = site.standard.ai || {};

  // Normalize into a single source of truth
  const normalizedAI = {
    enabled: site.standard.ai.enabled ?? true,
    apiKey: site.standard.ai.apiKey || process.env.OPENROUTER_KEY,
    model: site.standard.ai.model || "anthropic/claude-3.5-sonnet",
    models: Array.isArray(site.standard.ai.models)
      ? site.standard.ai.models
      : undefined,
    route: site.standard.ai.route, // e.g., "cheapest", "smart"
    copyFunctions: site.standard.ai.copyFunctions ?? true,
    siteUrl:
      site.standard.ai.siteUrl ||
      site.standard.ai.env?.SITE_URL ||
      process.env.SITE_URL ||
      "https://standard.ffp.co",
    verbose: site.standard.ai.verbose ?? false,
  };

  // Write back to site (single source of truth)
  site.standard.ai = normalizedAI;

  // Use the same object everywhere
  const config = site.standard.ai;

  const logger = Logger({ scope: "ai", verbose: config.verbose });

  // Respect enabled early and still expose stdAI as disabled for downstream consumers
  if (!config.enabled) {
    logger.info("AI plugin disabled");
    eleventyConfig.stdAI = { enabled: false, call: async () => "" };
    return;
  }

  if (!config.apiKey) {
    logger.warn("OPENROUTER_KEY not set. AI features will not work.");
  }

  logger.debug(`Initializing with model: ${config.model}`);

  // Helper function to call OpenRouter
  const callOpenRouter = async (messages, options = {}) => {
    if (!config.apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    // Node < 18 compatibility: ensure fetch exists
    if (typeof fetch === "undefined") {
      const { default: nodeFetch } = await import("node-fetch");
      globalThis.fetch = nodeFetch;
    }

    try {
      // Build request body
      const requestBody = {
        messages: Array.isArray(messages)
          ? messages
          : [{ role: "user", content: String(messages ?? "") }],
      };

      // SMART ROUTING: Check if models array is configured (either globally or per-call)
      const models = options.models || config.models;
      const route = options.route || config.route;

      if (models && Array.isArray(models) && models.length > 0) {
        // Multi-model routing mode
        requestBody.models = models;
        requestBody.route = route || "cheapest"; // Default if not specified
        logger.info(
          `Using ${requestBody.route} routing with ${models.length} models`,
        );
      } else {
        // Single model mode
        requestBody.model = options.model || config.model;
        logger.info(`Using single model: ${requestBody.model}`);
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            Referer: config.siteUrl,
            "HTTP-Referer": config.siteUrl,
            "X-Title": "Standard Framework",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      // Log which model was actually used (helpful for cost tracking)
      const usedModel =
        data?.model ||
        data?.choices?.[0]?.model ||
        requestBody.model ||
        (requestBody.models ? "(routed)" : "(unknown)");
      logger.info(`OpenRouter selected model: ${usedModel}`);

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        logger.warn("OpenRouter response missing content");
        return "";
      }

      return content;
    } catch (error) {
      logger.error("Error calling OpenRouter:", error.message);
      return `[AI Error: ${error.message}]`;
    }
  };

  // ==========================================
  // ASYNC FILTERS (Build-time AI)
  // ==========================================

  /**
   * @component aiSummarize Filter
   * @category AI Filters
   */
  eleventyConfig.addNunjucksAsyncFilter(
    "aiSummarize",
    async function (content, length = 100, unit = "words") {
      const prompt = `Summarize the following in ${length} ${unit} or less:\n\n${content ?? ""}`;
      return await callOpenRouter(prompt);
    },
  );

  /**
   * @component aiTranslate Filter
   * @category AI Filters
   */
  eleventyConfig.addNunjucksAsyncFilter(
    "aiTranslate",
    async function (content, language) {
      const prompt = `Translate the following to ${language}:\n\n${content ?? ""}`;
      return await callOpenRouter(prompt);
    },
  );

  /**
   * @component aiEnhance Filter
   * @category AI Filters
   */
  eleventyConfig.addNunjucksAsyncFilter("aiEnhance", async function (content) {
    const prompt = `Improve this text by fixing grammar, enhancing clarity, and making it more engaging. Keep the same meaning and tone:\n\n${content ?? ""}`;
    return await callOpenRouter(prompt);
  });

  /**
   * @component aiKeywords Filter
   * @category AI Filters
   */
  eleventyConfig.addNunjucksAsyncFilter("aiKeywords", async function (content) {
    const prompt = `Extract 5-10 relevant keywords/tags from this content. Return as comma-separated values:\n\n${content ?? ""}`;
    return await callOpenRouter(prompt);
  });

  // ==========================================
  // SHORTCODES (Build-time AI)
  // ==========================================

  /**
   * @component aiGenerate Shortcode
   * @category AI Shortcodes
   */
  eleventyConfig.addNunjucksAsyncShortcode(
    "aiGenerate",
    async function (prompt, model) {
      const opts = model ? { model } : undefined;
      return await callOpenRouter(prompt ?? "", opts);
    },
  );

  /**
   * @component aiChat Shortcode
   * @category AI Shortcodes
   */
  eleventyConfig.addShortcode(
    "aiChat",
    function (placeholder = "Ask a question...", model = config.model) {
      return `
 <div class="ai-chat" data-ai-model="${model}">
   <div class="ai-messages"></div>
   <form class="ai-input">
     <input type="text" placeholder="${placeholder}" required>
     <button type="submit">Ask</button>
   </form>
 </div>
 <script src="/assets/standard/standard.ai.js"></script>
 <script>
   new StandardAI.Chat('.ai-chat', { model: '${model}' });
 </script>`;
    },
  );

  /**
   * @component aiSearch Shortcode
   * @category AI Shortcodes
   */
  eleventyConfig.addShortcode("aiSearch", function () {
    return `
 <div class="ai-search">
   <form class="ai-search-form">
     <input type="text" placeholder="Search documentation..." required>
     <button type="submit">Search</button>
   </form>
   <div class="ai-search-results"></div>
 </div>
 <script src="/assets/standard/standard.ai.js"></script>
 <script>
   new StandardAI.Search('.ai-search');
 </script>`;
  });

  // ==========================================
  // COPY CLOUDFLARE FUNCTIONS
  // ==========================================

  if (config.copyFunctions) {
    eleventyConfig.on("eleventy.before", () => {
      const functionsDir = path.join(process.cwd(), "functions", "api");
      const sourceDir = path.join(__dirname, "..", "cloudflare", "api");

      // Ensure functions directory exists
      fs.mkdirSync(functionsDir, { recursive: true });

      if (!fs.existsSync(sourceDir)) {
        logger.warn(`Cloudflare API source not found at ${sourceDir}`);
        return;
      }

      // List of AI function files to copy
      const functionFiles = ["ai-search.js"];

      functionFiles.forEach((file) => {
        const src = path.join(sourceDir, file);
        const dest = path.join(functionsDir, file);

        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          logger.debug(`Copied ${file} to functions/api/`);
        }
      });
    });
  }

  // Make an AI call helper available to other plugins (e.g., Syntax)
  eleventyConfig.stdAI = {
    enabled: config.enabled && !!config.apiKey,
    call: async (prompt, opts = {}) => callOpenRouter(prompt, opts),
  };

  // ==========================================
  // DATA CASCADE (Make config available to templates)
  // ==========================================

  // Expose the fully normalized AI config as the single source of truth
  eleventyConfig.addGlobalData("ai", () => site.standard.ai);

  logger.success(`Initialized [${config.model}]`);
}
