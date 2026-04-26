require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const chatRoutes = require('./routes/chat');
const tripsRoutes = require('./routes/trips');
const destinationsRoutes = require('./routes/destinations');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORRECT CORS FIX
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.FRONTEND_URL // your Vercel URL
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(authMiddleware);

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/destinations', destinationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TripTuner API',
    ai: 'Tripi',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 TripTuner API running on port ${PORT}`);
  console.log(`🤖 Tripi AI powered by Google Gemini 2.5 Flash`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY not set — Tripi AI will not work!');
  }

  if (!process.env.FRONTEND_URL) {
    console.warn('⚠️ FRONTEND_URL not set — CORS may block requests!');
  }
});
