// api/generate-goal-plan.js
// Vercel Serverless Function

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, area, why, deadline } = req.body;

    if (!title || !area) {
      return res.status(400).json({ error: 'Title and area required' });
    }

    // Call Anthropic API
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

Return ONLY valid JSON (no markdown, no backticks):

{
  "steps": [
    "Specific step 1 for ${title}",
    "Specific step 2 for ${title}",
    "Specific step 3 for ${title}",
    "Specific step 4 for ${title}",
    "Specific step 5 for ${title}",
    "Specific step 6 for ${title}"
  ],
  "dailySchedule": [
    {
      "time": "Best time for this activity (e.g., 7:00-7:30 AM)",
      "icon": "Relevant emoji",
      "activity": "Activity name related to ${title}",
      "details": "Specific details on what to do",
      "minutes": 30
    }
  ],
  "habits": [
    {"icon": "emoji", "label": "Daily habit specifically for ${title}"},
    {"icon": "emoji", "label": "Another habit for ${title}"}
  ],
  "weeklyTasks": [
    "Monday: Specific task for ${title}",
    "Tuesday: Specific task for ${title}",
    "Wednesday: Specific task for ${title}",
    "Thursday: Specific task for ${title}",
    "Friday: Specific task for ${title}",
    "Saturday: Specific task for ${title}",
    "Sunday: Specific task for ${title}"
  ]
}

Make it personal, specific, and actionable. Tailor everything to "${title}" in the ${area} category.`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return res.status(response.status).json({ error: 'AI generation failed' });
    }

    const data = await response.json();
    let aiText = data.content.find(c => c.type === 'text')?.text || '';

    // Clean JSON
    aiText = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiText = jsonMatch[0];
    }

    const plan = JSON.parse(aiText);

    // Validate
    if (!plan.steps || !Array.isArray(plan.steps)) {
      throw new Error('Invalid plan structure');
    }

    return res.status(200).json({ success: true, plan });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate plan',
      details: error.message 
    });
  }
}
