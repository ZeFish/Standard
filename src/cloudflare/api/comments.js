/**
 * @component Simplified Comments API Endpoint
 * @category Cloudflare Functions
 * @description Cloudflare Function for handling GitHub-backed comments.
 *
 * Features:
 * - GET: Fetch all comments for a page from GitHub
 * - POST: Store new comment as a file in GitHub
 * - CORS enabled for cross-domain requests
 * - Automatic moderation flag for review
 *
 * GitHub Storage Structure:
 * data/comments/{pageId}/{timestamp}-{hash}.json
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: Personal access token with repo write access
 * - GITHUB_OWNER: Repository owner (e.g., "zefish")
 * - GITHUB_REPO: Repository name (e.g., "standard")
 * - MODERATION_EMAIL: Email for notifications
 *
 * @since 0.10.53
 */

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

/**
 * Generate unique comment ID
 */
function generateCommentId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Fetch comments from GitHub for a specific page
 */
async function fetchCommentsFromGitHub(pageId, env) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error("Missing GitHub configuration");
  }

  try {
    // Use GitHub API to list files in comments directory for this page
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/comments/${encodeURIComponent(
      pageId,
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+raw",
        "User-Agent": "Standard-Framework-Comments",
      },
    });

    // If directory doesn't exist, return empty array
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status}`, errorText);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      return [];
    }

    // Fetch content of each comment file
    const comments = [];
    for (const file of files) {
      if (file.name.endsWith(".json")) {
        try {
          const contentResponse = await fetch(file.url, {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3.raw",
              "User-Agent": "Standard-Framework-Comments",
            },
          });

          if (contentResponse.ok) {
            const comment = await contentResponse.json();
            comments.push(comment);
          }
        } catch (error) {
          console.error(`Error fetching comment file ${file.name}:`, error);
        }
      }
    }

    // Sort by date (newest first)
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return comments;
  } catch (error) {
    console.error("Error fetching comments from GitHub:", error);
    throw error;
  }
}

/**
 * Save new comment to GitHub
 */
async function saveCommentToGitHub(pageId, commentData, env) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error("Missing GitHub configuration");
  }

  const commentId = generateCommentId();
  const fileName = `${commentId}.json`;
  const filePath = `data/comments/${pageId}/${fileName}`;

  // Prepare comment object
  const comment = {
    id: commentId,
    pageId,
    author: commentData.author || "Anonymous",
    email: commentData.email || "",
    content: commentData.content || "",
    parentId: commentData.parentId || null,
    createdAt: new Date().toISOString(),
    approved: false, // Requires manual approval
    spam: false,
    userAgent: commentData.userAgent || "",
    ip: commentData.ip || "",
  };

  try {
    // Convert to base64 for GitHub API
    const fileContent = JSON.stringify(comment, null, 2);
    const base64Content = btoa(fileContent);

    // Create or update file via GitHub API
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Standard-Framework-Comments",
      },
      body: JSON.stringify({
        message: `Add comment from ${comment.author} on ${pageId}`,
        content: base64Content,
        committer: {
          name: "Standard Comments Bot",
          email: env.MODERATION_EMAIL || "bot@standard.ffp.co",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }

    return comment;
  } catch (error) {
    console.error("Error saving comment to GitHub:", error);
    throw error;
  }
}

/**
 * Handle OPTIONS requests (CORS preflight)
 */
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

/**
 * Handle GET requests (fetch comments)
 */
async function handleGet(request, env) {
  try {
    const url = new URL(request.url);
    const pageId = url.searchParams.get("pageId");

    if (!pageId) {
      return new Response(
        JSON.stringify({ error: "pageId query parameter is required" }),
        { headers: corsHeaders, status: 400 },
      );
    }

    const comments = await fetchCommentsFromGitHub(pageId, env);

    return new Response(JSON.stringify({ comments, pageId }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch comments" }),
      { headers: corsHeaders, status: 500 },
    );
  }
}

/**
 * Handle POST requests (submit new comment)
 */
async function handlePost(request, env) {
  try {
    const body = await request.json();
    const { pageId, author, email, content, parentId } = body;

    // Validation
    if (!pageId) {
      return new Response(JSON.stringify({ error: "pageId is required" }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    if (!author || !author.trim()) {
      return new Response(JSON.stringify({ error: "author is required" }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    if (!email || !email.trim()) {
      return new Response(JSON.stringify({ error: "email is required" }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    if (!content || !content.trim()) {
      return new Response(JSON.stringify({ error: "content is required" }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    // Extract client info for spam detection
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Save comment to GitHub
    const comment = await saveCommentToGitHub(
      pageId,
      {
        author: author.trim().slice(0, 100),
        email: email.trim().slice(0, 100),
        content: content.trim().slice(0, 10000),
        parentId: parentId || null,
        userAgent,
        ip: clientIp,
      },
      env,
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Comment submitted! It will appear after moderation.",
        comment,
      }),
      { headers: corsHeaders, status: 201 },
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to submit comment" }),
      { headers: corsHeaders, status: 500 },
    );
  }
}

/**
 * Main Cloudflare Pages Function handler
 * Context parameter contains: request, env, data
 */
export async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  const method = request.method;

  // Debug: log environment variables
  console.log("DEBUG env keys:", Object.keys(env || {}));
  console.log("DEBUG has GITHUB_TOKEN:", !!env?.GITHUB_TOKEN);
  console.log("DEBUG has GITHUB_OWNER:", !!env?.GITHUB_OWNER);

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return handleOptions();
  }

  // Route to appropriate handler
  if (method === "GET") {
    return await handleGet(request, env);
  } else if (method === "POST") {
    return await handlePost(request, env);
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: corsHeaders,
      status: 405,
    });
  }
}
