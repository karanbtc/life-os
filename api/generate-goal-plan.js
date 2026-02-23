export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { title, area, why, deadline, context } = req.body;

    if (!title || !area) {
      res.status(400).json({ error: 'Title and area required' });
      return;
    }

    // Build context-aware prompt
    let contextInfo = '';
    if (context && context.existingGoals !== 'None yet') {
      contextInfo = `

IMPORTANT - USER'S CURRENT CONTEXT:
The user already has these goals: ${context.existingGoals}

Current daily schedule includes: ${context.existingSchedule}

Existing habits being tracked: ${context.existingHabits}

CRITICAL: Your suggestions MUST NOT conflict with existing schedule times. Find available time slots that don't overlap. If the user already has similar activities, complement them rather than duplicate.`;
    }

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
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
${contextInfo}

Generate a comprehensive, personalized plan in JSON format. Make it specific to this exact goal.

Return ONLY valid JSON (no markdown, no backticks, no explanation):

{
  "steps": [
    "Specific actionable step 1 for ${title}",
    "Specific actionable step 2 for ${title}",
    "Specific actionable step 3 for ${title}",
    "Specific actionable step 4 for ${title}",
    "Specific actionable step 5 for ${title}",
    "Specific actionable step 6 for ${title}"
  ],
  "dailySchedule": [
    {
      "time": "Best time for this activity (e.g., 7:00-7:30 PM)",
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

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      res.status(anthropicResponse.status).json({ 
        error: 'AI service error',
        details: errorText 
      });
      return;
    }

    const data = await anthropicResponse.json();
    let aiText = data.content.find(c => c.type === 'text')?.text || '';

    // Clean JSON - remove markdown formatting
    aiText = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Extract JSON object
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiText = jsonMatch[0];
    }

    const plan = JSON.parse(aiText);

    // Validate plan structure
    if (!plan.steps || !Array.isArray(plan.steps) || plan.steps.length === 0) {
      res.status(500).json({ error: 'Invalid plan structure from AI' });
      return;
    }

    res.status(200).json({ success: true, plan });

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Failed to generate plan',
      details: error.message 
    });
  }
}
