/**
 * Standard Framework OpenRouter AI Plugin for Astro
 *
 * @component OpenRouter AI Integration
 * @category Astro Integrations
 * @author Francis Fontaine
 */

import createLogger from "../../lib/logger.js";

export default function openrouterIntegration(options = {}) {
  const logger = createLogger({
    verbose: options.verbose ?? false,
    scope: "AI",
  });

  // Store config in closure for access in hooks
  let aiConfig = null;

  return {
    name: "@standard/astro-openrouter",

    hooks: {
      "astro:config:setup": ({ config }) => {
        // Normalize configuration
        aiConfig = {
          enabled: options.enabled ?? true,
          apiKey: options.apiKey || process.env.OPENROUTER_KEY,
          model: options.model || "anthropic/claude-3.5-sonnet",
          models: Array.isArray(options.models) ? options.models : undefined,
          route: options.route, // e.g., "cheapest", "smart"
          copyFunctions: options.copyFunctions ?? true,
          siteUrl: options.siteUrl,
        };

        // Store config for potential future use
        config._ai = aiConfig;

        if (!aiConfig.enabled) {
          logger.warn("AI integration disabled");
          return;
        }

        if (!aiConfig.apiKey) {
          logger.warn("OPENROUTER_KEY not set. AI features will not work.");
          return;
        }

        logger.debug(`Initializing with model: ${aiConfig.model}`);
        logger.success(`Initialized [${aiConfig.model}]`);
      },

      "astro:server:setup": ({ server }) => {
        if (!aiConfig?.enabled || !aiConfig?.apiKey) return;

        // Helper function to call OpenRouter
        const callOpenRouter = async (messages, requestOptions = {}) => {
          if (!aiConfig.apiKey) {
            throw new Error("OpenRouter API key not configured");
          }

          try {
            // Build request body
            const requestBody = {
              messages: Array.isArray(messages)
                ? messages
                : [{ role: "user", content: String(messages ?? "") }],
            };

            // SMART ROUTING: Check if models array is configured
            const models = requestOptions.models || config.models;
            const route = requestOptions.route || config.route;

            if (models && Array.isArray(models) && models.length > 0) {
              // Multi-model routing mode
              requestBody.models = models;
              requestBody.route = route || "cheapest";
              logger.info(
                `Using ${requestBody.route} routing with ${models.length} models`,
              );
            } else {
              // Single model mode
              requestBody.model = requestOptions.model || aiConfig.model;
              logger.info(`Using single model: ${requestBody.model}`);
            }

            const response = await fetch(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${aiConfig.apiKey}`,
                  Referer: aiConfig.siteUrl,
                  "HTTP-Referer": aiConfig.siteUrl,
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

            // Log which model was actually used
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

        // Store AI helper for use in API routes
        server.middlewares.use("/api/ai/*", async (req, res) => {
          if (req.method === "POST") {
            try {
              const { messages, options } = req.body;
              const result = await callOpenRouter(messages, options);
              res.json({ content: result });
            } catch (error) {
              res.status(500).json({ error: error.message });
            }
          } else {
            res.status(405).json({ error: "Method not allowed" });
          }
        });
      },
    },
  };
}

// AI utility functions for use in components
export async function aiSummarize(content, length = 100, unit = "words") {
  const prompt = `Summarize the following in ${length} ${unit} or less:\n\n${content ?? ""}`;
  return await aiCall(prompt);
}

export async function aiTranslate(content, language) {
  const prompt = `Translate the following to ${language}:\n\n${content ?? ""}`;
  return await aiCall(prompt);
}

export async function aiEnhance(content) {
  const prompt = `Improve this text by fixing grammar, enhancing clarity, and making it more engaging. Keep the same meaning and tone:\n\n${content ?? ""}`;
  return await aiCall(prompt);
}

export async function aiKeywords(content) {
  const prompt = `Extract 5-10 relevant keywords/tags from this content. Return as comma-separated values:\n\n${content ?? ""}`;
  return await aiCall(prompt);
}

export async function aiGenerate(prompt, options = {}) {
  return await aiCall(prompt, options);
}

// Internal AI call function
async function aiCall(messages, options = {}) {
  // This would typically call your API route or use the server integration
  try {
    const response = await fetch("/api/ai/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, options }),
    });
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("AI call failed:", error);
    return `[AI Error: ${error.message}]`;
  }
}
