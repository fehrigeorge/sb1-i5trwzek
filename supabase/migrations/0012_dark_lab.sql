/*
  # Chat Import Function

  1. New Functions
    - import_chat_messages: Handles importing messages from JSON format
      - Parameters:
        - p_participant_id: UUID of the participant
        - p_messages: JSONB array of messages
      
  2. Changes
    - Adds function to efficiently import messages in batches
    - Handles sender identification based on name
    - Preserves original timestamps
*/

-- Create function to import chat messages
CREATE OR REPLACE FUNCTION import_chat_messages(
  p_participant_id UUID,
  p_messages JSONB
) RETURNS void AS $$
DECLARE
  v_message JSONB;
  v_remco_id UUID := '77777777-7777-7777-7777-777777777777';
BEGIN
  FOR v_message IN SELECT * FROM jsonb_array_elements(p_messages)
  LOOP
    INSERT INTO messages (
      participant_id,
      sender_id,
      message,
      timestamp
    ) VALUES (
      p_participant_id,
      CASE 
        WHEN v_message->>'name' = 'Remco' THEN v_remco_id 
        ELSE p_participant_id 
      END,
      v_message->>'message',
      (v_message->>'timestamp')::timestamptz
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;