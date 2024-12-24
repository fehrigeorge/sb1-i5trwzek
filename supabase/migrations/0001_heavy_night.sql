/*
  # Chat History Tables

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `last_active` (timestamptz)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, foreign key)
      - `sender_id` (uuid)
      - `message` (text)
      - `timestamp` (timestamptz)
      - `is_read` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create participants table
CREATE TABLE participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  last_active timestamptz NOT NULL DEFAULT now(),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_messages_participant_id ON messages(participant_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_message_search ON messages USING gin(to_tsvector('english', message));

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to participants"
  ON participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO participants (id, name, last_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alice', now() - interval '1 hour'),
  ('22222222-2222-2222-2222-222222222222', 'Bob', now() - interval '2 hours'),
  ('33333333-3333-3333-3333-333333333333', 'Charlie', now() - interval '3 hours');

-- Insert sample messages (truncated for brevity)
INSERT INTO messages (participant_id, sender_id, message, timestamp)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Hello Alice!', now() - interval '1 hour'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Hi Bob!', now() - interval '2 hours'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Hey Charlie!', now() - interval '3 hours');