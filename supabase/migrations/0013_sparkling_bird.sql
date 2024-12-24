/*
  # Cleanup Chats Migration

  1. Changes
    - Keep only two specific chats:
      - One with 100 messages (99999999-9999-9999-9999-999999999999)
      - One with 1000 messages (cccccccc-cccc-cccc-cccc-cccccccccccc)
    - Remove all other chats and their messages
  
  2. Security
    - Maintains RLS policies
    - Preserves data integrity
    - Handles foreign key constraints
*/

-- First, delete favorites for participants we want to remove
DELETE FROM favorites 
WHERE participant_id NOT IN (
  '77777777-7777-7777-7777-777777777777', -- Remco (keep system user)
  '99999999-9999-9999-9999-999999999999', -- Chat with 100 messages
  'cccccccc-cccc-cccc-cccc-cccccccccccc'  -- Chat with 1000 messages
);

-- Then delete protected_chats entries
DELETE FROM protected_chats
WHERE participant_id NOT IN (
  '77777777-7777-7777-7777-777777777777',
  '99999999-9999-9999-9999-999999999999',
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
);

-- Finally delete participants (messages will be deleted via CASCADE)
DELETE FROM participants 
WHERE id NOT IN (
  '77777777-7777-7777-7777-777777777777',
  '99999999-9999-9999-9999-999999999999',
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
);