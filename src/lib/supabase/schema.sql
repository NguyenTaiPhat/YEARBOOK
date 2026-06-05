-- ============================================================
-- OUR MEMORIES — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  memory_message TEXT,
  visitor_identifier TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHOTOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  drive_file_id TEXT,
  caption TEXT,
  heart_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SIGNATURES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  note TEXT,
  position_x FLOAT DEFAULT 50,
  position_y FLOAT DEFAULT 50,
  color TEXT DEFAULT '#3B3028',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHOTO HEARTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS photo_hearts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  visitor_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, visitor_identifier)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signatures_created_at ON signatures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photo_hearts_photo_id ON photo_hearts(photo_id);
CREATE INDEX IF NOT EXISTS idx_users_visitor_identifier ON users(visitor_identifier);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_hearts ENABLE ROW LEVEL SECURITY;

-- Allow read for all
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Allow public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public read signatures" ON signatures FOR SELECT USING (true);
CREATE POLICY "Allow public read photo_hearts" ON photo_hearts FOR SELECT USING (true);

-- Allow insert for all (anon)
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert photos" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert signatures" ON signatures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert photo_hearts" ON photo_hearts FOR INSERT WITH CHECK (true);

-- Allow update heart_count
CREATE POLICY "Allow update heart_count" ON photos FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET (run separately)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- CREATE POLICY "Allow public avatar upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
-- CREATE POLICY "Allow public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
