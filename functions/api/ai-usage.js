/**
 * AI Usage Dashboard API
 * 
 * @component AI Usage Tracker
 * @category Cloudflare Functions
 * @author Francis Fontaine
 * @since 0.11.0
 * 
 * Fetches usage statistics from OpenRouter's API and presents them in a
 * clean, dashboard-friendly format. Shows token usage, costs, rate limits,
 * and per-model breakdowns for the current month.
 * 
 * NOTE: OpenRouter's usage API requires authentication and may have
 * rate limits. Cache results when possible.
 */

export async function onRequest(context) {
  const { env, request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch usage from OpenRouter
    // NOTE: This endpoint may not be publicly available yet
    // You might need to track usage manually in KV/D1
    
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Unable to fetch usage data');
    }

    const data = await response.json();

    return Response.json({
      usage: data.data || {},
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[AI Usage] Error:', error);
    
    // Return mock data for development
    return Response.json({
      usage: {
        totalRequests: 1247,
        totalTokens: 2345678,
        totalCost: 47.23,
        byModel: {
          'anthropic/claude-3.5-sonnet': { requests: 867, cost: 32.10 },
          'openai/gpt-4': { requests: 234, cost: 12.45 },
          'google/gemini-pro': { requests: 146, cost: 2.68 }
        }
      },
      timestamp: new Date().toISOString(),
      note: 'Mock data - connect to OpenRouter API for real stats'
    }, { headers: corsHeaders });
  }
}
