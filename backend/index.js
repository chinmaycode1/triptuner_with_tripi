require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const chatRoutes = require('./routes/chat');
const tripsRoutes = require('./routes/trips');
const destinationsRoutes = require('./routes/destinations');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
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
  res.json({ status: 'ok', service: 'TripTuner API', ai: 'Tripi', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 TripTuner API running on http://localhost:${PORT}`);
  console.log(`🤖 Tripi AI powered by Google Gemini 2.5 Flash`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — Tripi AI will not work!');
    console.warn('   Get a free key at: https://aistudio.google.com/app/apikey');
  }
});
