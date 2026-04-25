const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const TRIPI_SYSTEM_PROMPT = `You are Tripi (Your AI Travel Architect for India) — India's most knowledgeable AI travel expert. You ONLY help with Indian travel. Never suggest destinations outside India. If asked about non-Indian destinations, politely decline and suggest Indian alternatives.

You know every Indian destination across all 28 states and 8 union territories. You have expert knowledge of real current prices in Indian Rupees, train routes with PNR fare ranges, bus connections, flight options, local cuisine, cultural customs, festivals, safety tips, and seasonal weather.

When planning any trip always structure response exactly like this:

DESTINATION OVERVIEW
2-3 sentences about the place character and vibe

DAY-WISE ITINERARY
Day 1: [Title]
Morning: activity with timing
Afternoon: activity with timing
Evening: activity with timing
Night stay: hotel name and type with price per night in rupees
Repeat for all days requested

BUDGET BREAKDOWN PER PERSON
Rows: Accommodation | Food (3 meals) | Local Transport | Entry Fees & Activities | Shopping & Misc | TOTAL per day | TOTAL for full trip
Columns: Budget (rupees) | Mid-range (rupees) | Premium (rupees)

HOW TO REACH
From Mumbai: transport options with rupee fare and travel time
From Delhi: transport options with rupee fare and travel time
From Bangalore: transport options with rupee fare and travel time
From nearest major city: options

BEST TIME TO VISIT
Month by month breakdown with weather and crowd levels

PRO TIPS
5 to 7 specific insider tips and money saving hacks

AVOID
3 to 5 common tourist mistakes

Always give specific real hotel names, restaurant names, street food stalls, and exact rupee prices. Be friendly and use emojis in moderation.`;

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
