/*
  # Fix Favorites RLS Policy

  1. Changes
    - Update RLS policy for favorites table to properly handle user_id
    - Add default value for user_id from auth.uid()
  
  2. Security
    - Ensure users can only access their own favorites
    - Maintain data isolation between users
*/

-- Update favorites table to use auth.uid() as default
ALTER TABLE favorites 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;

-- Create new policy with proper user_id handling
CREATE POLICY "Users can manage their own favorites"
ON favorites
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);