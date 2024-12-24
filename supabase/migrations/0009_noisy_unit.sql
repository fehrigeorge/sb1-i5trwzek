/*
  # Add PIN Protection for Chats

  1. New Tables
    - `protected_chats`: Stores encrypted PINs and attempt tracking
      - `participant_id` (uuid, primary key)
      - `pin_hash` (text, encrypted)
      - `last_attempt` (timestamptz)
      - `attempt_count` (int)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Only admins can manage PINs
    - All users must verify PIN to access protected chats
*/

CREATE TABLE protected_chats (
  participant_id uuid PRIMARY KEY REFERENCES participants(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  last_attempt timestamptz,
  attempt_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE protected_chats ENABLE ROW LEVEL SECURITY;

-- Only admins can manage PINs
CREATE POLICY "Admins can manage protected chats"
  ON protected_chats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'isAdmin' = 'true'
    )
  );

-- All users can check if a chat is protected
CREATE POLICY "Users can check if chat is protected"
  ON protected_chats
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to verify PIN
CREATE OR REPLACE FUNCTION verify_pin(
  p_participant_id uuid,
  p_pin text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_protected_chat protected_chats;
  v_now timestamptz;
BEGIN
  v_now := now();
  
  -- Get protected chat record and lock it
  SELECT * INTO v_protected_chat
  FROM protected_chats
  WHERE participant_id = p_participant_id
  FOR UPDATE;
  
  -- Reset attempts if more than 60 seconds have passed
  IF v_protected_chat.last_attempt < v_now - interval '60 seconds' THEN
    UPDATE protected_chats
    SET attempt_count = 0,
        last_attempt = v_now
    WHERE participant_id = p_participant_id;
    
    v_protected_chat.attempt_count := 0;
  END IF;
  
  -- Check attempt limit
  IF v_protected_chat.attempt_count >= 5 THEN
    RETURN false;
  END IF;
  
  -- Update attempt counter
  UPDATE protected_chats
  SET attempt_count = attempt_count + 1,
      last_attempt = v_now
  WHERE participant_id = p_participant_id;
  
  -- Verify PIN
  RETURN v_protected_chat.pin_hash = crypt(p_pin, v_protected_chat.pin_hash);
END;
$$;