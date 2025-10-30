/**
 * Standard Framework OpenRouter AI Plugin
 *
 * @component OpenRouter AI Integration
 * @category 11ty Plugins
 * @author Francis Fontaine
 * @since 0.11.0
 *
 * In 2022, OpenAI launched ChatGPT and changed everything. Within months,
 * dozens of competing AI models emerged—Claude, Gemini, LLaMA, Mistral—each
 * with different strengths, APIs, and pricing models. Developers faced a
 * nightmare: managing multiple API keys, learning different request formats,
 * and tracking usage across providers.
 *
 * OpenRouter solved this chaos by creating a unified gateway. One API key,
 * one consistent interface, access to 100+ models. It's like the Stripe of
 * AI—abstracting complexity while adding powerful features like automatic
 * fallbacks, cost optimization, and built-in usage tracking.
 *
 * This plugin brings that power to 11ty. Generate content at build time
 * with AI filters, add interactive chat widgets with Cloudflare Functions,
 * create semantic search for your documentation, enhance articles with
 * AI-powered summaries—all through a simple, elegant API that feels native
 * to 11ty.
 *
 * The magic is in the flexibility. Use AI during builds for static content
 * generation (SEO descriptions, translations, summaries), or use runtime
 * functions for dynamic interactions (chatbots, search, Q&A). Switch models
 * with a single line. Track everything from OpenRouter's dashboard. This
 * isn't just an AI integration—it's a complete AI-powered content system.
 *
 * ### Future Improvements
 *
 * - Add streaming responses for real-time chat
 * - Implement caching layer (Cloudflare KV)
 * - Add vector embeddings for semantic search
 * - Create pre-built AI assistant templates
 * - Add A/B testing between models
 *
 * @see {file} src/cloudflare/api/ai-chat.js - Chat API endpoint
 * @see {file} src/cloudflare/api/ai-search.js - Search API endpoint
 * @see {file} src/js/standard.ai.js - Client-side library
 *
 * @link https://openrouter.ai/ OpenRouter Homepage
 * @link https://openrouter.ai/docs OpenRouter API Documentation
 *
 * @example javascript - Basic plugin setup
 *   import Standard from "@zefish/standard";
 *
 *   export default function(eleventyConfig) {
 *     eleventyConfig.addPlugin(Standard, {
 *       ai: {
 *         enabled: true,
 *         model: 'anthropic/claude-3.5-sonnet'
 *       }
 *     });
 *   }
 *
 * @example markdown - Using AI filters in templates
 *   ---
 *   title: My Article
 *   description: {{ content | aiSummarize(160) }}
 *   ---
 *
 *   {{ content }}
 *
 *   ## Related Articles
 *   {% aiGenerate "Suggest 3 related topics for: " + title %}
 *
 * @param {Object} eleventyConfig - 11ty configuration object
 * @param {Object} options - Plugin configuration
 * @param {Boolean} options.enabled - Enable AI features
 * @param {String} options.apiKey - OpenRouter API key (defaults to env.OPENROUTER_KEY)
 * @param {String} options.model - Default model to use
 * @param {Boolean} options.copyFunctions - Copy Cloudflare functions
 * @param {String} options.siteUrl - Site URL for OpenRouter tracking
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createLogger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const OpenRouterPlugin = {
  configFunction: (eleventyConfig, options = {}) => {
    const config = {
      enabled: options.enabled ?? true,
      apiKey: options.apiKey || process.env.OPENROUTER_KEY,
      model: options.model || "anthropic/claude-3.5-sonnet",
      copyFunctions: options.copyFunctions ?? true,
      siteUrl:
        options.siteUrl || process.env.SITE_URL || "https://standard.ffp.co",
      ...options,
    };

    const logger = createLogger({
      verbose: options.verbose,
      scope: "OpenRouter",
    });

    if (!config.enabled) {
      logger.info("Plugin disabled");
      return;
    }

    if (!config.apiKey) {
      logger.warn("OPENROUTER_KEY not set. AI features will not work.");
    }

    logger.info(`Initializing with model: ${config.model}`);

    // Helper function to call OpenRouter
    const callOpenRouter = async (messages, options = {}) => {
      if (!config.apiKey) {
        throw new Error("OpenRouter API key not configured");
      }

      try {
        // Build request body
        const requestBody = {
          messages: Array.isArray(messages)
            ? messages
            : [{ role: "user", content: messages }],
        };

        // SMART ROUTING: Check if models array is configured (either globally or per-call)
        const models = options.models || config.models;
        const route = options.route || config.route;

        if (models && Array.isArray(models) && models.length > 0) {
          // Multi-model routing mode
          requestBody.models = models;
          requestBody.route = route || "cheapest"; // Default to fallback if not specified

          logger.info(`Using ${route} routing with ${models.length} models`);
        } else {
          // Single model mode (backward compatible)
          requestBody.model = options.model || config.model;

          logger.info(`Using single model: ${requestBody.model}`);
        }

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.apiKey}`,
              "HTTP-Referer": config.siteUrl,
              "X-Title": "Standard Framework",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(
            `OpenRouter API error: ${response.status} - ${error}`,
          );
        }

        const data = await response.json();

        // Log which model was actually used (helpful for cost tracking)
        logger.info(`OpenRouter selected model: ${data.model}`);

        return data.choices[0].message.content;
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
     * @description Summarize content to a specific word/character count using AI
     *
     * @example nunjucks
     *   {{ content | aiSummarize(50) }}
     *   {{ article | aiSummarize(160, 'chars') }}
     */
    eleventyConfig.addNunjucksAsyncFilter(
      "aiSummarize",
      async function (content, length = 100, unit = "words") {
        const prompt = `Summarize the following in ${length} ${unit} or less:\n\n${content}`;
        return await callOpenRouter(prompt);
      },
    );

    /**
     * @component aiTranslate Filter
     * @category AI Filters
     * @description Translate content to another language
     *
     * @example nunjucks
     *   {{ content | aiTranslate('French') }}
     *   {{ title | aiTranslate('es') }}
     */
    eleventyConfig.addNunjucksAsyncFilter(
      "aiTranslate",
      async function (content, language) {
        const prompt = `Translate the following to ${language}:\n\n${content}`;
        return await callOpenRouter(prompt);
      },
    );

    /**
     * @component aiEnhance Filter
     * @category AI Filters
     * @description Enhance content with better writing, fix grammar, improve clarity
     *
     * @example nunjucks
     *   {{ draft | aiEnhance }}
     */
    eleventyConfig.addNunjucksAsyncFilter(
      "aiEnhance",
      async function (content) {
        const prompt = `Improve this text by fixing grammar, enhancing clarity, and making it more engaging. Keep the same meaning and tone:\n\n${content}`;
        return await callOpenRouter(prompt);
      },
    );

    /**
     * @component aiKeywords Filter
     * @category AI Filters
     * @description Extract keywords/tags from content
     *
     * @example nunjucks
     *   {{ content | aiKeywords }}
     */
    eleventyConfig.addNunjucksAsyncFilter(
      "aiKeywords",
      async function (content) {
        const prompt = `Extract 5-10 relevant keywords/tags from this content. Return as comma-separated values:\n\n${content}`;
        return await callOpenRouter(prompt);
      },
    );

    // ==========================================
    // SHORTCODES (Build-time AI)
    // ==========================================

    /**
     * @component aiGenerate Shortcode
     * @category AI Shortcodes
     * @description Generate content from a prompt at build time
     *
     * @example nunjucks
     *   {% aiGenerate "Write 3 bullet points about typography" %}
     *   {% aiGenerate "Suggest related articles for: " + title %}
     */
    eleventyConfig.addNunjucksAsyncShortcode(
      "aiGenerate",
      async function (prompt, model) {
        return await callOpenRouter(prompt, model);
      },
    );

    /**
     * @component aiChat Shortcode
     * @category AI Shortcodes
     * @description Insert interactive chat widget (uses Cloudflare Functions)
     *
     * @example nunjucks
     *   {% aiChat "Ask me about the Standard Framework!" %}
     *   {% aiChat "Documentation Assistant", "anthropic/claude-3.5-sonnet" %}
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
     * @description Insert semantic AI search widget
     *
     * @example nunjucks
     *   {% aiSearch %}
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

        // List of AI function files to copy
        const functionFiles = [
          "ai-chat.js",
          "ai-search.js",
          "ai-enhance.js",
          "ai-usage.js",
        ];

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

    // ==========================================
    // DATA CASCADE (Make config available to templates)
    // ==========================================

    eleventyConfig.addGlobalData("ai", () => ({
      enabled: config.enabled,
      model: config.model,
      models: {
        "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
        "openai/gpt-4": "GPT-4",
        "google/gemini-pro": "Gemini Pro",
        "meta-llama/llama-3-70b": "LLaMA 3 70B",
        "mistralai/mistral-large": "Mistral Large",
      },
    }));

    logger.success("Initialized");
  },
};
