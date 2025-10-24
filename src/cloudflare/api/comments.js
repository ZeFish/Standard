/**
 * @component Simplified Comments API Endpoint
 * @category Cloudflare Functions
 * @description A simplified example of a Cloudflare Function for handling comments.
 * This file now returns a basic response and does not include complex logic,
 * environment variable validation, or CORS handling internally.
 *
 * @since 0.10.53
 */

export async function onRequestPost(request, env, ctx) {
  return new Response("Comments API - Simplified Response", {
    headers: { "Content-Type": "text/plain" },
    status: 200,
  });
}
