/**
 * @component Example Cloudflare Function
 * @category Cloudflare Functions
 * @description Example function showing how to use Standard Framework utilities
 * with Cloudflare Workers/Functions. This demonstrates basic routing, error handling,
 * and response formatting.
 *
 * Deploy to Cloudflare:
 * - Copy this file to your project's functions directory
 * - Update the export to match your endpoint name
 * - Deploy with `wrangler publish`
 *
 * @example
 * // GET /api/hello?name=Francis
 * // Response: { message: "Hello Francis!", version: "0.10.52" }
 *
 * @since 0.10.52
 */

import {
  createResponse,
  createErrorResponse,
  parseRequest,
  validateMethod,
  withCache,
} from "./utils.js";

export default {
  async fetch(request) {
    try {
      // Validate method
      const methodError = validateMethod(request, ["GET", "OPTIONS"]);
      if (methodError) return methodError;

      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
      }

      // Parse request
      const { query } = await parseRequest(request);
      const name = query.name || "World";

      // Create response
      const response = createResponse({
        message: `Hello ${name}!`,
        version: "0.10.52",
        timestamp: new Date().toISOString(),
      });

      // Add caching (1 hour)
      return withCache(response, 3600);
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
  },
};
