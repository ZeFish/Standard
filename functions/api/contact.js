/**
 * @component Simplified Contact API Endpoint
 * @category Cloudflare Functions
 * @description A simplified example of a Cloudflare Function for handling contact form submissions.
 * This file now returns a basic response and does not include complex logic.
 *
 * @param {Request} request The incoming request.
 * @param {object} env The environment variables.
 * @param {object} ctx The context object.
 * @returns {Response} The response to the request.
 */

export async function onRequestPost(request, env, ctx) {
  return new Response("Contact API - Simplified Response", {
    headers: { "Content-Type": "text/plain" },
    status: 200,
  });
}
