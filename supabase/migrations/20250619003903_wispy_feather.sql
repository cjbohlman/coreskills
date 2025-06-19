/*
  # Create community discussions table

  1. New Tables
    - `community_discussions`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `parent_id` (uuid, nullable for replies)
      - `content` (text)
      - `tags` (text array)
      - `likes` (integer)
      - `dislikes` (integer)
      - `is_highlighted` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `community_discussions` table
    - Add policies for authenticated users to read all discussions
    - Add policies for authenticated users to create their own discussions
    - Add policies for users to update/delete their own discussions
*/

-- Create community_discussions table
CREATE TABLE IF NOT EXISTS community_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES community_discussions(id) ON DELETE CASCADE,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  is_highlighted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE community_discussions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read discussions"
  ON community_discussions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create discussions"
  ON community_discussions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discussions"
  ON community_discussions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions"
  ON community_discussions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_discussions_challenge 
ON community_discussions (challenge_id);

CREATE INDEX IF NOT EXISTS idx_community_discussions_user 
ON community_discussions (user_id);

CREATE INDEX IF NOT EXISTS idx_community_discussions_parent 
ON community_discussions (parent_id);

CREATE INDEX IF NOT EXISTS idx_community_discussions_created 
ON community_discussions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_discussions_likes 
ON community_discussions (likes DESC);

CREATE INDEX IF NOT EXISTS idx_community_discussions_tags 
ON community_discussions USING gin (tags);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_community_discussions_updated_at
  BEFORE UPDATE ON community_discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();