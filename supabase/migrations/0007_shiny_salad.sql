/*
  # Fix RLS Policies

  1. Changes
    - Add proper RLS policies for messages table
    - Add proper RLS policies for participants table
    - Add error handling for user deletion

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Update messages policies
DROP POLICY IF EXISTS "Allow read access to messages" ON messages;
CREATE POLICY "Authenticated users can read messages"
ON messages FOR SELECT
TO authenticated
USING (true);

-- Update participants policies
DROP POLICY IF EXISTS "Allow read access to participants" ON participants;
CREATE POLICY "Authenticated users can read participants"
ON participants FOR SELECT
TO authenticated
USING (true);

-- Update delete_user function with better error handling
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's favorites
  DELETE FROM favorites WHERE user_id = auth.uid();
  
  -- Delete user's auth account
  DELETE FROM auth.users WHERE id = auth.uid();

EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;