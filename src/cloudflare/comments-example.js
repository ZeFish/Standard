/**
 * @component Example: GitHub Comments Endpoint
 * @category Cloudflare Functions
 * @description Complete example showing how to deploy the GitHub comments system.
 * This file demonstrates the comments handler integrated with Cloudflare Functions.
 *
 * Deploy this as your `/api/comments` endpoint:
 *
 * 1. Copy this file to your functions directory:
 *    cp comments-example.js functions/api/comments.js
 *
 * 2. Install dependencies:
 *    npm install
 *
 * 3. Set environment variables in wrangler.toml:
 *    [env.production.secrets]
 *    GITHUB_TOKEN = "..."
 *    GITHUB_OWNER = "your-username"
 *    GITHUB_REPO = "your-repo"
 *
 * 4. Deploy:
 *    wrangler publish --env production
 *
 * @since 0.10.53
 */

import { handleComments } from "./comments.js";
import { handleCORS, createErrorResponse } from "./utils.js";

/**
 * Middleware: Validate environment variables
 */
function validateEnvironment(env) {
  const required = ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"];
  const missing = required.filter((v) => !env[v]);

  if (missing.length > 0) {
    return createErrorResponse(
      `Missing environment variables: ${missing.join(", ")}`,
      500
    );
  }

  return null;
}

/**
 * Middleware: CORS handling
 */
function handleCorsMiddleware(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  return null;
}

/**
 * Middleware: Request logging (optional)
 */
function logRequest(request, env) {
  const method = request.method;
  const url = new URL(request.url);
  const pathname = url.pathname;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
}

/**
 * Main handler: Route to comments system
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // Log request
      logRequest(request, env);

      // Validate environment
      const envError = validateEnvironment(env);
      if (envError) return envError;

      // Handle CORS
      const corsResponse = handleCorsMiddleware(request);
      if (corsResponse) return corsResponse;

      // Add CORS headers to all responses
      const response = await handleComments(request, env);

      // Clone response to add headers
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*");

      return newResponse;
    } catch (error) {
      console.error("Unhandled error:", error);
      return createErrorResponse(error.message || "Internal server error", 500);
    }
  },
};
