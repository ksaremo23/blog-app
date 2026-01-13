-- ============================================
-- Supabase Setup SQL Script
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Anyone can view blogs" ON blogs;
DROP POLICY IF EXISTS "Users can create blogs" ON blogs;
DROP POLICY IF EXISTS "Users can update own blogs" ON blogs;
DROP POLICY IF EXISTS "Users can delete own blogs" ON blogs;

-- 4. Create policies
-- Allow anyone to read blogs
CREATE POLICY "Anyone can view blogs"
  ON blogs FOR SELECT
  USING (true);

-- Allow authenticated users to create blogs
CREATE POLICY "Users can create blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own blogs
CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own blogs
CREATE POLICY "Users can delete own blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Storage Setup (Run these in Storage section)
-- ============================================
-- 1. Create a bucket named "blog-images"
-- 2. Make it public
-- 3. Set allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
-- 4. Run the storage policies below
-- ============================================

-- Storage policies (run after creating the bucket)
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

