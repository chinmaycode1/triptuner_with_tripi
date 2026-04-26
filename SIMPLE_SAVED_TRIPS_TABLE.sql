-- ============================================
-- SIMPLE SAVED TRIPS TABLE - PDF STORAGE APPROACH
-- ============================================
-- Run this in Supabase SQL Editor

-- Drop the complex table and create a simple one
DROP TABLE IF EXISTS saved_trips CASCADE;

CREATE TABLE saved_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  destination TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own trips" 
  ON saved_trips FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" 
  ON saved_trips FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" 
  ON saved_trips FOR DELETE 
  USING (auth.uid() = user_id);

-- Verify table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'saved_trips'
ORDER BY ordinal_position;

-- Success message
SELECT 'Simple saved_trips table created successfully!' as message;

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Go to Supabase Storage
-- 2. Create a new bucket called 'trip-pdfs'
-- 3. Set it to public
-- 4. Add storage policy for authenticated users
-- ============================================