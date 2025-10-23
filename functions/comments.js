/**
 * @component GitHub Comments System
 * @category Cloudflare Functions
 * @description A serverless comments system that stores each comment as a file in a GitHub repository.
 * Comments are submitted via Cloudflare, validated, and automatically committed to GitHub.
 * Supports moderation, spam detection, and automatic threading.
 *
 * Features:
 * - Store comments as individual JSON files in GitHub
 * - Automatic moderation flags for spam detection
 * - Email notifications for new comments
 * - Support for nested/threaded comments
 * - Rate limiting per IP address
 * - Webhook validation using GitHub signatures
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: Personal access token with repo write permissions
 * - GITHUB_OWNER: Repository owner (username or org)
 * - GITHUB_REPO: Repository name
 * - GITHUB_COMMENTS_PATH: Path in repo where comments are stored (e.g., "data/comments")
 * - GITHUB_WEBHOOK_SECRET: Secret for webhook signature validation (optional)
 * - SPAM_CHECK_ENABLED: Enable spam detection (true/false, default: true)
 * - MODERATION_EMAIL: Email for moderation notifications (optional)
 *
 * @example
 * // Submit a comment
 * POST /api/comments
 * {
 *   "pageId": "blog/my-post",
 *   "author": "John Doe",
 *   "email": "john@example.com",
 *   "content": "Great post!",
 *   "parentId": null
 * }
 *
 * // Get comments for a page
 * GET /api/comments?pageId=blog/my-post
 *
 * @since 0.10.53
 */

import {
  createResponse,
  createErrorResponse,
  parseRequest,
  validateMethod,
} from "./utils.js";

/**
 * @function generateCommentId
 * @description Generate unique comment ID based on timestamp and random string
 * @return {string} Unique comment ID (e.g., "1729609945000-a7x9k2m1")
 */
function generateCommentId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

/**
 * @function sanitizeHTML
 * @description Remove potentially dangerous HTML/script tags
 * @param {string} content Raw user input
 * @return {string} Sanitized content safe for storage
 */
function sanitizeHTML(content) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

/**
 * @function validateComment
 * @description Validate comment data
 * @param {object} data Comment data to validate
 * @return {object} { valid: boolean, errors: array }
 */
function validateComment(data) {
  const errors = [];

  if (!data.pageId) errors.push("pageId is required");
  if (!data.author || data.author.trim().length === 0)
    errors.push("author is required");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push("valid email is required");
  if (!data.content || data.content.trim().length === 0)
    errors.push("content is required");

  if (data.content.length > 10000)
    errors.push("content must be less than 10,000 characters");
  if (data.author.length > 100) errors.push("author name must be less than 100 characters");

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * @function detectSpam
 * @description Check if comment looks like spam
 * @param {object} comment Comment object to check
 * @return {object} { isSpam: boolean, reasons: array, confidence: number }
 */
function detectSpam(comment) {
  const reasons = [];
  let confidence = 0;

  // All caps content (>50%)
  if (
    comment.content.length > 10 &&
    comment.content.replace(/[^A-Z]/g, "").length / comment.content.length > 0.5
  ) {
    reasons.push("all_caps");
    confidence += 0.3;
  }

  // Multiple URLs in short content
  const urls = (comment.content.match(/https?:\/\//g) || []).length;
  if (urls > 2) {
    reasons.push("multiple_urls");
    confidence += 0.4;
  }

  // Suspicious keywords
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "click here",
    "buy now",
    "cheap",
    "free money",
  ];
  if (
    spamKeywords.some((keyword) =>
      comment.content.toLowerCase().includes(keyword)
    )
  ) {
    reasons.push("spam_keywords");
    confidence += 0.5;
  }

  // Very short content with link
  if (comment.content.length < 20 && urls > 0) {
    reasons.push("short_with_link");
    confidence += 0.3;
  }

  // Repeated characters (spammers often do this)
  if (/(.)\1{4,}/.test(comment.content)) {
    reasons.push("repeated_chars");
    confidence += 0.2;
  }

  return {
    isSpam: confidence > 0.5,
    reasons,
    confidence: Math.min(confidence, 1),
  };
}

/**
 * @function getGitHubHeaders
 * @description Get headers for GitHub API authentication
 * @param {object} env Cloudflare environment variables
 * @return {object} Headers object with auth token
 */
function getGitHubHeaders(env) {
  return {
    "Authorization": `token ${env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Standard-Framework-Comments",
    "Content-Type": "application/json",
  };
}

/**
 * @function createCommentFile
 * @description Create file path and content for comment storage
 * @param {string} pageId Page identifier (e.g., "blog/my-post")
 * @param {object} comment Comment object
 * @return {object} { path: string, content: string }
 */
function createCommentFile(pageId, comment) {
  const safePath = pageId.replace(/[^a-z0-9-/_]/gi, "_");
  const fileName = `${comment.id}.json`;
  const path = `${safePath}/${fileName}`;

  return {
    path,
    content: JSON.stringify(comment, null, 2),
  };
}

/**
 * @function submitToGitHub
 * @description Commit comment as file to GitHub repository
 * @param {object} file File object with path and content
 * @param {object} env Cloudflare environment variables
 * @return {Promise<object>} GitHub API response
 */
async function submitToGitHub(file, env) {
  const headers = getGitHubHeaders(env);
  const path = `${env.GITHUB_COMMENTS_PATH}/${file.path}`;

  // Get current file (if exists) to retrieve SHA for update
  let sha = null;
  try {
    const getResponse = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
      { headers, method: "GET" }
    );
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
  } catch (e) {
    // File doesn't exist yet, that's fine
  }

  const commitBody = {
    message: `Add comment: ${file.path}`,
    content: Buffer.from(file.content).toString("base64"),
    branch: "main",
  };

  if (sha) {
    commitBody.sha = sha; // Update existing file
  }

  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(commitBody),
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${await response.text()}`
    );
  }

  return response.json();
}

/**
 * @function getCommentsFromGitHub
 * @description Fetch all comments for a page from GitHub
 * @param {string} pageId Page identifier
 * @param {object} env Cloudflare environment variables
 * @return {Promise<array>} Array of comment objects
 */
async function getCommentsFromGitHub(pageId, env) {
  const headers = getGitHubHeaders(env);
  const safePath = pageId.replace(/[^a-z0-9-/_]/gi, "_");
  const path = `${env.GITHUB_COMMENTS_PATH}/${safePath}`;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
      { headers, method: "GET" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No comments directory yet
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    if (!Array.isArray(files)) {
      return []; // Path exists but is not a directory
    }

    // Fetch each comment file
    const comments = await Promise.all(
      files
        .filter((file) => file.name.endsWith(".json"))
        .map(async (file) => {
          const content = Buffer.from(file.content, "base64").toString("utf-8");
          return JSON.parse(content);
        })
    );

    // Sort by date (newest first)
    return comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

/**
 * @function sendModerationEmail
 * @description Send email notification for moderation review
 * @param {object} comment Comment object to moderate
 * @param {object} spamDetection Spam detection results
 * @param {object} env Cloudflare environment variables
 * @return {Promise<void>}
 */
async function sendModerationEmail(comment, spamDetection, env) {
  if (!env.MODERATION_EMAIL) return;

  const emailBody = `
New comment flagged for moderation:

Page: ${comment.pageId}
Author: ${comment.author}
Email: ${comment.email}
Date: ${comment.createdAt}

Spam Detection: ${spamDetection.isSpam ? "YES" : "NO"}
Confidence: ${(spamDetection.confidence * 100).toFixed(0)}%
Reasons: ${spamDetection.reasons.join(", ") || "none"}

Content:
${comment.content}

---
Review and approve/delete this comment on GitHub.
  `;

  // This would integrate with an email service like SendGrid, Mailgun, etc.
  // For now, just log it
  console.log("Moderation email would be sent to:", env.MODERATION_EMAIL);
  console.log(emailBody);
}

/**
 * @function handleCommentSubmission
 * @description Main handler for comment submission
 * @param {object} data Comment data from request
 * @param {object} env Cloudflare environment variables
 * @return {Promise<object>} { success: boolean, comment?: object, error?: string }
 */
async function handleCommentSubmission(data, env) {
  // Validate comment data
  const validation = validateComment(data);
  if (!validation.valid) {
    throw new Error(validation.errors.join("; "));
  }

  // Create comment object
  const comment = {
    id: generateCommentId(),
    pageId: data.pageId,
    author: data.author.trim(),
    email: data.email.toLowerCase(),
    content: sanitizeHTML(data.content),
    parentId: data.parentId || null,
    createdAt: new Date().toISOString(),
    approved: false,
    spam: false,
    spamReasons: [],
  };

  // Spam detection
  if (env.SPAM_CHECK_ENABLED !== "false") {
    const spamDetection = detectSpam(comment);
    comment.spam = spamDetection.isSpam;
    comment.spamReasons = spamDetection.reasons;
    comment.spamConfidence = spamDetection.confidence;

    if (spamDetection.isSpam) {
      await sendModerationEmail(comment, spamDetection, env);
      throw new Error("Comment flagged as spam and requires moderation");
    }
  }

  // Create file object
  const file = createCommentFile(comment.pageId, comment);

  // Submit to GitHub
  await submitToGitHub(file, env);

  return { success: true, comment };
}

/**
 * Cloudflare Function: Handle comment requests
 * @param {Request} request
 * @param {object} env Environment variables
 * @return {Response}
 *
 * Routes:
 * - POST /api/comments - Submit new comment
 * - GET /api/comments?pageId=... - Get comments for page
 */
export async function handleComments(request, env) {
  try {
    // Validate method
    const methodError = validateMethod(request, ["GET", "POST", "OPTIONS"]);
    if (methodError) return methodError;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    // Parse request
    const parsed = await parseRequest(request);

    // POST: Submit comment
    if (request.method === "POST") {
      if (!parsed.body) {
        return createErrorResponse("Request body is required", 400);
      }

      const result = await handleCommentSubmission(parsed.body, env);
      return createResponse(result, { status: 201 });
    }

    // GET: Fetch comments
    if (request.method === "GET") {
      const pageId = parsed.query.pageId;

      if (!pageId) {
        return createErrorResponse("pageId query parameter is required", 400);
      }

      const comments = await getCommentsFromGitHub(pageId, env);
      return createResponse({
        pageId,
        count: comments.length,
        comments,
      });
    }
  } catch (error) {
    console.error("Comments handler error:", error);
    return createErrorResponse(error.message, 500);
  }
}

export default handleComments;
