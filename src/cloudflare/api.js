/**
 * @component Cloudflare API Router
 * @category Cloudflare Functions
 * @description Main entry point for all Cloudflare API functions.
 * Routes incoming requests to the appropriate handler based on the URL path.
 *
 * @since 0.11.0
 */

import { commentsHandler } from "./handlers/comments.js";
import { contactHandler } from "./handlers/contact.js";
import { createErrorResponse } from "./utils.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path.startsWith("/api/comments")) {
        return commentsHandler(request, env, ctx);
      }

      // Add other API routes here
      if (path.startsWith("/api/contact")) {
        return contactHandler(request, env, ctx);
      }

      return createErrorResponse("Not Found", 404);
    } catch (error) {
      console.error("API Router error:", error);
      return createErrorResponse(error.message || "Internal Server Error", 500);
    }
  },
};
