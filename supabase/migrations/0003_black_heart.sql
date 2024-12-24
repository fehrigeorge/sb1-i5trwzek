/*
  # Seed Chat Data with Remco
  
  1. New Participants
    - Add Remco and chat participants with unique IDs
  2. Messages
    - Create conversations with different message counts:
      * Chat 1: 10 messages
      * Chat 2: 100 messages
      * Chat 3: 500 messages
      * Chat 4: 750 messages
      * Chat 5: 1000 messages
*/

-- Insert Remco and other participants with new UUIDs
INSERT INTO participants (id, name, last_active, avatar_url) VALUES
  ('77777777-7777-7777-7777-777777777777', 'Remco', now(), 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'),
  ('88888888-8888-8888-8888-888888888888', 'Sarah Chen', now() - interval '10 minutes', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'),
  ('99999999-9999-9999-9999-999999999999', 'Mike Johnson', now() - interval '1 hour', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lisa Brown', now() - interval '2 hours', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tom Wilson', now() - interval '3 hours', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Anna Martinez', now() - interval '4 hours', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb');

-- Function to generate dummy messages
CREATE OR REPLACE FUNCTION generate_messages(
  p_participant_id UUID,
  p_count INTEGER
) RETURNS VOID AS $$
DECLARE
  v_remco_id UUID := '77777777-7777-7777-7777-777777777777';
  v_message TEXT;
  v_sender_id UUID;
  v_timestamp TIMESTAMPTZ;
  i INTEGER;
BEGIN
  FOR i IN 1..p_count LOOP
    -- Alternate between Remco and the other participant
    v_sender_id := CASE WHEN i % 2 = 0 THEN v_remco_id ELSE p_participant_id END;
    
    -- Generate a message based on the sender
    v_message := CASE WHEN v_sender_id = v_remco_id
      THEN 'Message from Remco #' || i
      ELSE 'Reply from participant #' || i
    END;
    
    -- Calculate timestamp, going backwards from now
    v_timestamp := now() - (interval '1 minute' * i);
    
    -- Insert the message
    INSERT INTO messages (
      participant_id,
      sender_id,
      message,
      timestamp
    ) VALUES (
      p_participant_id,
      v_sender_id,
      v_message,
      v_timestamp
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate messages for each conversation
SELECT generate_messages('88888888-8888-8888-8888-888888888888', 10);   -- Chat 1: 10 messages
SELECT generate_messages('99999999-9999-9999-9999-999999999999', 100);  -- Chat 2: 100 messages
SELECT generate_messages('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 500);  -- Chat 3: 500 messages
SELECT generate_messages('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 750);  -- Chat 4: 750 messages
SELECT generate_messages('cccccccc-cccc-cccc-cccc-cccccccccccc', 1000); -- Chat 5: 1000 messages

-- Clean up the function
DROP FUNCTION generate_messages;