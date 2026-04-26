# ⚡ Setup Guide

## 🎯 Complete Setup in 10 Minutes

### Step 1: Database Setup (2 minutes)

**Run this SQL in Supabase SQL Editor:**

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

### Step 2: Storage Setup (1 minute)

1. **Supabase → Storage → Create bucket: `trip-pdfs`**
2. **Set to Public ✅**
3. **Add storage policies:**

```sql
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trip-pdfs');

CREATE POLICY "Users can view PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'trip-pdfs');

CREATE POLICY "Users can delete PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trip-pdfs');
```

### Step 3: Environment Variables (2 minutes)

**Backend (.env):**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

### Step 4: Install & Run (5 minutes)

```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Run backend (Terminal 1)
cd backend
npm start

# Run frontend (Terminal 2)
cd frontend
npm run dev
```

**Visit: http://localhost:5173** ✅

---

## 🧪 Quick Test

1. **Register/Login** ✅
2. **Generate itinerary** (any page) ✅
3. **Click "💾 Save Trip"** ✅
4. **Check "Saved Trips" page** ✅

---

## 🚀 Deploy to Production

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide**

**Quick Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chinmaycode1/triptuner_with_tripi)

---

## 🔧 API Keys Needed

1. **Supabase** (free): https://supabase.com
2. **Google Gemini** (free): https://aistudio.google.com

---

## ✅ Features Working

- 🤖 **Tripi AI** - Smart itinerary generation
- 💾 **PDF Storage** - Professional trip PDFs
- 🗺️ **Near Me** - Location-based recommendations
- 📱 **Mobile** - Responsive design
- 🔐 **Auth** - Secure user accounts

---

**Need help?** Check [README.md](README.md) or open an issue!