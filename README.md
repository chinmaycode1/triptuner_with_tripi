# 🧭 TripTuner - India's AI Travel Planner

> Your AI-powered travel companion for exploring India, powered by **Tripi AI** using Google Gemini 2.5 Flash

![TripTuner](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🤖 **Tripi AI Agent** - Intelligent travel planning assistant powered by Google Gemini
- 🗺️ **Curated Itineraries** - 12+ pre-planned trips across India with real images
- 📋 **Detailed Day-wise Plans** - Complete breakdown with activities, timings, and stays
- 💰 **Budget Breakdown** - Transparent pricing (Budget/Mid-range/Premium)
- 📄 **Professional PDF Downloads** - Beautiful, print-ready itinerary documents
- 🌐 **Multi-language Support** - English + 7 Indian languages
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🔐 **User Authentication** - Powered by Supabase
- 💾 **Save Trips** - Bookmark and manage your favorite itineraries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))
- Supabase account ([Sign up free](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chinmaycode1/triptuner_with_tripi.git
   cd triptuner_with_tripi
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

   Create `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:5173

## 📁 Project Structure

```
triptuner/
├── backend/                 # Express.js API server
│   ├── routes/             # API routes
│   │   ├── chat.js        # Tripi AI chat endpoints
│   │   ├── trips.js       # Trip management
│   │   └── destinations.js # Destinations API
│   ├── middleware/         # Auth middleware
│   └── index.js           # Server entry point
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── data/          # Static data (itineraries, destinations)
│   │   ├── lib/           # Utilities (API, PDF, Supabase)
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
│
└── package.json           # Root package.json for scripts
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create required tables:

```sql
-- Users table (handled by Supabase Auth)

-- Saved trips table
CREATE TABLE saved_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  state TEXT,
  itinerary_text TEXT,
  itinerary_json JSONB,
  duration_days INTEGER,
  budget_total INTEGER,
  budget_per_person INTEGER,
  group_size INTEGER,
  trip_type TEXT,
  travel_style TEXT,
  transport_mode TEXT,
  accommodation_type TEXT,
  season TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations table
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT,
  category TEXT[],
  avg_budget_per_day INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own trips" ON saved_trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON saved_trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON saved_trips
  FOR DELETE USING (auth.uid() = user_id);
```

### Google Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to `backend/.env` as `GEMINI_API_KEY`

## 🎯 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install all dependencies

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with hot reload
- `npm start` - Start production server

## 🌐 API Endpoints

### Chat with Tripi AI
```
POST /api/chat
Body: {
  messages: [{ role: "user", content: "Plan a trip to Goa" }],
  language: "en"
}
```

### Generate Trip Plan
```
POST /api/chat/generate-trip
Body: {
  destination: "Goa",
  days: 5,
  groupSize: 2,
  budget: 25000
}
```

### Saved Trips
```
GET    /api/trips          # Get user's saved trips
POST   /api/trips          # Save a new trip
DELETE /api/trips/:id      # Delete a trip
```

### Destinations
```
GET /api/destinations?category=beaches&state=Goa
```

## 🎨 Customization

### Adding New Itineraries

Edit `frontend/src/data/itineraries.js`:

```javascript
{
  id: "13",
  title: "Your New Itinerary",
  route: "City A → City B → City C",
  duration: "7 Days",
  groupSize: "2-6",
  category: "Adventure",
  emoji: "🏔️",
  image: "https://images.unsplash.com/photo-xxx",
  highlights: ["Highlight 1", "Highlight 2"],
  budgetTotal: { budget: 15000, mid: 30000, premium: 60000 },
  budgetPerPerson: { budget: 7500, mid: 15000, premium: 30000 },
  description: "Your description here",
  days: [
    { day: 1, title: "Arrival", morning: "...", afternoon: "...", evening: "...", stay: "..." }
  ]
}
```

### Changing Colors

Edit `frontend/src/styles/theme.css`:

```css
:root {
  --primary: #7C5CFC;    /* Purple */
  --secondary: #FF4D8D;  /* Pink */
  /* ... other colors */
}
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `frontend/dist` folder

3. Set environment variables in your hosting platform

### Backend (Railway/Render/Heroku)

1. Push to your hosting platform
2. Set environment variables
3. Ensure `PORT` is set correctly

### Environment Variables for Production

Make sure to set all required environment variables in your hosting platform's dashboard.

## 🔒 Security Notes

- ⚠️ **Never commit `.env` files** - They contain sensitive API keys
- ✅ Use environment variables for all secrets
- ✅ Enable Row Level Security in Supabase
- ✅ Use HTTPS in production
- ✅ Validate all user inputs on the backend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** - AI model powering Tripi
- **Supabase** - Backend and authentication
- **React** - Frontend framework
- **Vite** - Build tool
- **Unsplash** - Destination images

## 📧 Contact

Chinmay - [@chinmaycode1](https://github.com/chinmaycode1)

Project Link: [https://github.com/chinmaycode1/triptuner_with_tripi](https://github.com/chinmaycode1/triptuner_with_tripi)

---

Made with ❤️ for travelers exploring India 🇮🇳
