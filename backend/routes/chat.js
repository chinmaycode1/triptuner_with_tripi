const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const TRIPI_SYSTEM_PROMPT = `You are Tripi — India's AI Travel Architect. You ONLY help with Indian travel destinations across 28 states and 8 union territories.

CRITICAL: Keep responses SHORT, CLEAN, and HIGHLY STRUCTURED. No long paragraphs. Maximum 3 activities per day.

FORMAT YOUR ITINERARY RESPONSE EXACTLY LIKE THIS:

🎯 Overview
[2-3 short lines only about destination vibe and highlights]

📅 Day-wise Plan

Day 1:
Morning: [Activity name] • ₹[Cost]
Afternoon: [Activity name] • ₹[Cost]
Evening: [Activity name] • ₹[Cost]
Stay: [Hotel name/type] • ₹[Cost]

Day 2:
Morning: [Activity name] • ₹[Cost]
Afternoon: [Activity name] • ₹[Cost]
Evening: [Activity name] • ₹[Cost]
Stay: [Hotel name/type] • ₹[Cost]

[Continue for all days - MAX 3 activities per day]

💰 Budget Summary (per person)

Stay: ₹[X]/day
Food: ₹[X]/day
Transport: ₹[X]/day
Activities: ₹[X]/day
Total/day: ₹[X]
Total trip: ₹[X]

📆 Best Time
[Month range]: [Weather + why]
[Avoid]: [When to avoid + why]

💡 Tips
• [Tip 1 - actionable and specific]
• [Tip 2 - money saving]
• [Tip 3 - insider hack]
• [Tip 4 - local secret]
• [Tip 5 - best timing]

STRICT RULES:
1. Keep TOTAL response under 500 words
2. Each day = EXACTLY 3 activities (Morning, Afternoon, Evening) + Stay
3. ALWAYS show costs in ₹ (INR)
4. NO long paragraphs or explanations
5. Use simple, clear language
6. Be specific: "Zostel Goa ₹600" not "budget hostel"
7. Mobile-friendly format (short lines)
8. Use realistic current prices
9. Overview = max 3 lines
10. Tips = max 5 bullet points

For non-itinerary questions, keep answers brief and helpful.`;

async function callGemini(userMessages, systemPrompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  // Build conversation history for Gemini
  const history = [];
  const msgs = userMessages.slice(-20);

  // Filter out the initial assistant greeting and build history
  // All messages except the last one go into history
  for (let i = 0; i < msgs.length - 1; i++) {
    // Skip assistant messages that are at the beginning (greeting messages)
    if (i === 0 && msgs[i].role === 'assistant') {
      continue;
    }
    history.push({
      role: msgs[i].role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msgs[i].content }],
    });
  }

  const chat = model.startChat({ history });
  const lastMsg = msgs[msgs.length - 1];
  const result = await chat.sendMessage(lastMsg.content);
  return result.response.text();
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages, language = 'en', sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const systemPrompt = language !== 'en'
      ? TRIPI_SYSTEM_PROMPT + `\n\nIMPORTANT: Respond in the language for code "${language}". hi=Hindi, ta=Tamil, te=Telugu, bn=Bengali, mr=Marathi, gu=Gujarati, kn=Kannada.`
      : TRIPI_SYSTEM_PROMPT;

    const reply = await callGemini(messages, systemPrompt);

    // Save to chat_sessions if user is logged in (non-fatal)
    if (req.user && sessionId) {
      supabase.from('chat_sessions').upsert({
        id: sessionId,
        user_id: req.user.id,
        messages: messages.concat([{ role: 'assistant', content: reply }]),
        updated_at: new Date().toISOString(),
      }).catch(() => {});
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    const isKeyMissing = !process.env.GEMINI_API_KEY;
    res.status(500).json({
      error: isKeyMissing
        ? 'GEMINI_API_KEY not set in backend/.env'
        : 'Failed to get AI response',
      details: err.message,
    });
  }
});

// POST /api/chat/generate-trip
router.post('/generate-trip', async (req, res) => {
  try {
    const { destination, days, groupSize, budget, tripType, style, transport, accommodation, season, interests } = req.body;

    if (!destination) return res.status(400).json({ error: 'destination required' });

    const prompt = `Plan a detailed ${days || 5}-day ${tripType || 'leisure'} trip to ${destination} for ${groupSize || 2} people.
Travel style: ${style || 'Mid-range Comfort'}
Total budget: Rs.${budget || 25000}
Accommodation: ${accommodation || 'Mid-range Hotel'}
Transport: ${transport || 'Public Transport'}
Season: ${season || 'Winter'}
Interests: ${(interests || []).join(', ') || 'General sightseeing'}

Provide a complete itinerary with day-by-day plan, budget breakdown, how to reach, best time, pro tips and things to avoid.`;

    const plan = await callGemini([{ role: 'user', content: prompt }], TRIPI_SYSTEM_PROMPT);
    res.json({ plan });
  } catch (err) {
    console.error('Generate trip error:', err.message);
    res.status(500).json({ error: 'Failed to generate trip', details: err.message });
  }
});

module.exports = router;
