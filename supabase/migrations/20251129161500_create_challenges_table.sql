-- Create Enum Types
CREATE TYPE challenge_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE challenge_type AS ENUM ('template', 'custom');

-- Create Challenges Table
CREATE TABLE challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty challenge_difficulty NOT NULL,
    type challenge_type NOT NULL,
    content JSONB NOT NULL, -- Polymorphic content (Template Config OR Custom HTML)
    objectives JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of validation rules
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Everyone can view published challenges
CREATE POLICY "Public challenges are viewable by everyone"
ON challenges FOR SELECT
USING (is_published = true);

-- 2. Authenticated users can create challenges (Future feature)
CREATE POLICY "Users can create challenges"
ON challenges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- 3. Users can update their own challenges
CREATE POLICY "Users can update own challenges"
ON challenges FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);
