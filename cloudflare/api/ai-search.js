/**
 * AI Semantic Search API Endpoint
 * 
 * @component AI Search Function
 * @category Cloudflare Functions
 * @author Francis Fontaine
 * @since 0.11.0
 * 
 * Semantic search powered by AI. Instead of keyword matching, this endpoint
 * understands the MEANING of queries and finds relevant content even when
 * exact words don't match. It's like having a librarian who actually read
 * and understood all your documentation.
 * 
 * In the future, this will use vector embeddings for even better results.
 * For now, it uses AI to intelligently search through your content.
 * 
 * @example javascript - Client-side usage
 *   const response = await fetch('/api/ai-search', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       query: 'How do I make text look good?',
 *       content: allDocumentation
 *     })
 *   });
 */

export async function onRequest(context) {
  const { env, request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, content, model = 'anthropic/claude-3.5-sonnet' } = await request.json();

    if (!query) {
      return Response.json(
        { error: 'Query is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `You are a documentation search assistant. 
    
User query: "${query}"

Search through this documentation and return the most relevant sections. Format your response as a JSON array with this structure:
[
  {
    "title": "Section Title",
    "excerpt": "Brief relevant excerpt",
    "relevance": 0.95
  }
]

Documentation:
${content}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_KEY}`,
        'HTTP-Referer': env.SITE_URL || 'https://standard.ffp.co',
        'X-Title': 'Standard Framework',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const results = JSON.parse(data.choices[0].message.content);

    return Response.json({
      results,
      query,
      usage: data.usage
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[AI Search] Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
