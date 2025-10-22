/**
 * @component Cloudflare Functions Utilities
 * @category 11ty Plugins
 * @description Helper functions for Cloudflare Workers/Functions integration.
 * Provides utilities for handling requests, responses, caching, and common patterns.
 *
 * @example
 * import { corsHeaders, handleCORS, createResponse } from './utils.js';
 *
 * export default {
 *   async fetch(request) {
 *     if (request.method === 'OPTIONS') {
 *       return handleCORS(request);
 *     }
 *     return createResponse('Hello World');
 *   }
 * };
 */

/**
 * @prop {object} corsHeaders Standard CORS headers
 * @description Pre-configured CORS headers for common use cases
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * @function handleCORS
 * @description Handle CORS preflight requests
 * @param {Request} request The incoming request
 * @param {object} options Custom CORS headers
 * @return {Response} CORS response
 *
 * @example
 * if (request.method === 'OPTIONS') {
 *   return handleCORS(request);
 * }
 */
export function handleCORS(request, options = {}) {
  const headers = { ...corsHeaders, ...options };
  return new Response(null, { status: 204, headers });
}

/**
 * @function createResponse
 * @description Create a standardized response object
 * @param {any} data Response data (string or object)
 * @param {object} options Response options
 * @param {number} options.status HTTP status code (default: 200)
 * @param {object} options.headers Custom headers
 * @param {boolean} options.cors Include CORS headers (default: true)
 * @return {Response} Formatted response
 *
 * @example
 * return createResponse({ message: 'Success' }, { status: 200 });
 */
export function createResponse(data, options = {}) {
  const { status = 200, headers = {}, cors = true } = options;

  let body = data;
  let contentType = "text/plain";

  if (typeof data === "object") {
    body = JSON.stringify(data);
    contentType = "application/json";
  }

  const responseHeaders = {
    "Content-Type": contentType,
    ...headers,
  };

  if (cors) {
    Object.assign(responseHeaders, corsHeaders);
  }

  return new Response(body, { status, headers: responseHeaders });
}

/**
 * @function createErrorResponse
 * @description Create a standardized error response
 * @param {string} message Error message
 * @param {number} status HTTP status code (default: 500)
 * @param {object} options Additional options
 * @return {Response} Error response
 *
 * @example
 * return createErrorResponse('Not found', 404);
 */
export function createErrorResponse(message, status = 500, options = {}) {
  return createResponse(
    {
      error: true,
      message,
      status,
      timestamp: new Date().toISOString(),
    },
    { status, ...options }
  );
}

/**
 * @function parseRequest
 * @description Parse incoming request and extract data
 * @param {Request} request The incoming request
 * @return {Promise<object>} Parsed request data
 *
 * @example
 * const data = await parseRequest(request);
 * console.log(data.body, data.query, data.headers);
 */
export async function parseRequest(request) {
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers);
  let body = null;

  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => null);
    } else {
      body = await request.text().catch(() => null);
    }
  }

  return {
    method: request.method,
    url: url.toString(),
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers,
    body,
  };
}

/**
 * @function withCache
 * @description Add caching headers to response
 * @param {Response} response The response to cache
 * @param {number} ttl Time to live in seconds (default: 3600)
 * @return {Response} Response with cache headers
 *
 * @example
 * const response = createResponse('Hello');
 * return withCache(response, 86400); // Cache for 1 day
 */
export function withCache(response, ttl = 3600) {
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Cache-Control", `public, max-age=${ttl}`);
  return newResponse;
}

/**
 * @function validateMethod
 * @description Validate request method
 * @param {Request} request The incoming request
 * @param {array} allowedMethods Array of allowed methods
 * @return {Response|null} Error response if invalid, null if valid
 *
 * @example
 * const error = validateMethod(request, ['GET', 'POST']);
 * if (error) return error;
 */
export function validateMethod(request, allowedMethods = ["GET"]) {
  if (!allowedMethods.includes(request.method)) {
    return createErrorResponse(
      `Method ${request.method} not allowed`,
      405,
      { headers: { Allow: allowedMethods.join(", ") } }
    );
  }
  return null;
}
