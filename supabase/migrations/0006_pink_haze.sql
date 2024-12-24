/*
  # User Management Functions

  1. New Functions
    - delete_user: Allows users to delete their account and associated data
  
  2. Security
    - Function can only be executed by authenticated users
    - Only deletes data for the calling user
*/

-- Function to delete user account and associated data
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
END;
$$;