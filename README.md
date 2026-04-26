# 🎯 TripTuner - AI-Powered India Travel Planner

**Your intelligent travel companion for exploring India with Tripi AI**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chinmaycode1/triptuner_with_tripi)

## ✨ Features

- 🤖 **Tripi AI Assistant** - Intelligent travel planning with Gemini 2.5 Flash
- 🗺️ **500+ Destinations** - Comprehensive India travel database
- 💾 **PDF Trip Storage** - Save itineraries as professional PDFs
- 📱 **Mobile Responsive** - Perfect experience on all devices
- 🌍 **Near Me Feature** - Location-based destination discovery
- 💰 **Real Budget Planning** - Accurate INR costs and breakdowns
- 🔐 **Secure Authentication** - Supabase Auth integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/chinmaycode1/triptuner_with_tripi.git
cd triptuner_with_tripi
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Setup

**Backend (.env):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

### 4. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create simplified saved_trips table
DROP TABLE IF EXISTS saved_trips CASCADE;

CREATE TABLE saved_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  destination TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips" ON saved_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON saved_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON saved_trips FOR DELETE USING (auth.uid() = user_id);
```

### 5. Storage Setup

1. Go to Supabase → Storage
2. Create bucket: `trip-pdfs`
3. Set to **Public**
4. Add storage policies for authenticated users

### 6. Run Development Servers

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 📦 Deployment

### Vercel Deployment

1. **Fork this repository**
2. **Connect to Vercel**
3. **Set Environment Variables** in Vercel dashboard
4. **Deploy Backend** separately (Railway, Render, etc.)
5. **Update VITE_API_URL** to your backend URL

### Backend Deployment Options

- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic choice
- **DigitalOcean**: App Platform

## 🏗️ Architecture

```
Frontend (React + Vite) → Backend (Express.js) → Supabase (Database + Storage) → Gemini AI
```

### Key Components

- **Frontend**: React 18, Vite, React Router
- **Backend**: Express.js, Supabase Client
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (PDF files)
- **AI**: Google Gemini 2.5 Flash
- **Auth**: Supabase Auth

## 📁 Project Structure

```
triptuner_with_tripi/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities & API
│   │   └── data/           # Static data
│   └── package.json
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── package.json
├── SIMPLE_SAVED_TRIPS_TABLE.sql  # Database setup
└── README.md
```

## 🔧 Configuration

### API Keys Required

1. **Supabase**: Database and authentication
2. **Google Gemini**: AI-powered trip planning

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_SERVICE_KEY` | Service role key | ✅ |
| `SUPABASE_ANON_KEY` | Anonymous key | ✅ |
| `GEMINI_API_KEY` | Google AI Studio API key | ✅ |
| `VITE_API_URL` | Backend API URL | ✅ |

## 🎨 Features Overview

### 🤖 Tripi AI Assistant
- Natural language trip planning
- Structured itinerary generation
- Real-time budget calculations
- Multi-language support

### 💾 PDF Trip Storage
- Professional PDF generation
- Supabase Storage integration
- Offline access to itineraries
- Easy sharing capabilities

### 🗺️ Interactive Features
- Location-based recommendations
- Interactive destination cards
- Real-time itinerary generation
- Mobile-optimized interface

## 🔒 Security

- Row Level Security (RLS) enabled
- Authenticated API endpoints
- Secure file storage
- Environment variable protection

## 🐛 Troubleshooting

### Common Issues

**"Failed to save trip"**
- Ensure Supabase storage bucket exists
- Check storage policies are set
- Verify user authentication

**"API connection failed"**
- Check backend is running
- Verify environment variables
- Confirm CORS settings

**"Gemini API error"**
- Validate API key
- Check API quotas
- Ensure proper key permissions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **Supabase** for backend infrastructure
- **Unsplash** for destination images
- **React** ecosystem for frontend tools

---

**Built with ❤️ for India travel enthusiasts**

For support, please open an issue or contact the maintainers.