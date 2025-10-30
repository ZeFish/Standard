/**
 * AI Content Enhancement API Endpoint
 * 
 * @component AI Enhance Function
 * @category Cloudflare Functions
 * @author Francis Fontaine
 * @since 0.11.0
 * 
 * Runtime content enhancement. Takes user-submitted content and improves
 * grammar, clarity, tone, and structure. Perfect for user-generated content,
 * comment systems, or draft enhancement tools.
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
    const { content, task = 'enhance', model = 'anthropic/claude-3.5-sonnet' } = await request.json();

    if (!content) {
      return Response.json(
        { error: 'Content is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompts = {
      enhance: `Improve this text by fixing grammar, enhancing clarity, and making it more engaging. Keep the same meaning and tone:\n\n${content}`,
      summarize: `Summarize this content in 2-3 sentences:\n\n${content}`,
      translate: `Translate this to ${task.split(':')[1] || 'French'}:\n\n${content}`,
      keywords: `Extract 5-10 relevant keywords from this content. Return as comma-separated values:\n\n${content}`
    };

    const prompt = prompts[task.split(':')[0]] || prompts.enhance;

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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json({
      result: data.choices[0].message.content,
      task,
      usage: data.usage
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[AI Enhance] Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
