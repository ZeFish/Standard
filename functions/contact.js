/**
 * @component Contact Form Handler
 * @category Cloudflare Functions
 * @description Handles submissions from a contact form.
 * This example sends an email using a placeholder service.
 *
 * @param {Request} request The incoming request.
 * @param {object} env The environment variables.
 * @param {object} ctx The context object.
 * @returns {Response} The response to the request.
 */

import { createErrorResponse } from "./utils.js";

export async function onRequestPost(request, env, ctx) {
  if (request.method !== "POST") {
    return createErrorResponse("Method Not Allowed", 405);
  }

  try {
    const formData = await request.json();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      return createErrorResponse("Missing required fields (name, email, message)", 400);
    }

    // In a real application, you would send an email here using a service like SendGrid, Mailgun, etc.
    // For this example, we'll just log the submission.
    console.log("Contact form submission received:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);

    // You might want to add environment variables for the recipient email and API keys for an email service.
    // Example: env.CONTACT_RECIPIENT_EMAIL, env.SENDGRID_API_KEY

    return new Response(JSON.stringify({ message: "Contact form submitted successfully!" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Contact form handler error:", error);
    return createErrorResponse(error.message || "Internal Server Error", 500);
  }
}
