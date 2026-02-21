// api/generate-goal-plan.js
// Vercel Serverless Function

export default async function handler(req, res) {

  /* ---------- FIXED CORS (CRITICAL) ---------- */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // VERY IMPORTANT → must return AFTER headers set
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  /* ---------- ONLY POST ---------- */
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    /* ---------- SAFE BODY READ ---------- */
    const body = req.body || {};
    const { title, area, why, deadline } = body;

    if (!title || !area) {
      return res.status(400).json({ error: 'Title and area required' });
    }

    /* ---------- CALL ANTHROPIC ---------- */
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Create a detailed action plan for this goal:

Goal: "${title}"
Category: ${area}
Why it matters: ${why || 'Personal growth'}
Deadline: ${deadline || 'No specific deadline'}

Generate a comprehensive, personalized plan in JSON format. Make it specific to this exact goal.

Return ONLY valid JSON:

{
  "steps": ["step1","step2"],
  "dailySchedule": [],
  "habits": [],
  "weeklyTasks": []
}`
        }]
      })
    });

    /* ---------- HANDLE API FAILURE SAFELY ---------- */
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);

      return res.status(500).json({
        error: 'AI generation failed',
        details: errorText?.slice(0,300)
      });
    }

    /* ---------- PARSE RESPONSE ---------- */
    const data = await response.json();

    const aiText =
      data?.content?.find?.(c => c.type === 'text')?.text || '';

    if (!aiText) {
      throw new Error('Empty AI response');
    }

    /* ---------- CLEAN JSON ---------- */
    let cleaned = aiText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    /* ---------- SAFE JSON PARSE ---------- */
    let plan;

    try {
      plan = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", cleaned);
      throw new Error('AI returned invalid JSON');
    }

    /* ---------- VALIDATE ---------- */
    if (!plan.steps || !Array.isArray(plan.steps)) {
      throw new Error('Invalid plan structure');
    }

    /* ---------- SUCCESS ---------- */
    return res.status(200).json({
      success: true,
      plan
    });

  } catch (error) {

    console.error('Server error:', error);

    return res.status(500).json({
      error: 'Failed to generate plan',
      details: error?.message || 'Unknown error'
    });
  }
}
